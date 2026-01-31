import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";

// Assuming these types based on standard replit chat integration
// Adjust if shared/schema.ts exports specific types for chat
interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function useConversations() {
  return useQuery({
    queryKey: ["/api/conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return (await res.json()) as Conversation[];
    },
  });
}

export function useConversation(id: number | null) {
  return useQuery({
    queryKey: ["/api/conversations", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch conversation");
      return (await res.json()) as Conversation & { messages: Message[] };
    },
    enabled: !!id,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string = "New Chat") => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return (await res.json()) as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });
}

export function useChatStream(conversationId: number | null) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    // Optimistically add user message
    const tempId = Date.now();
    const userMsg: Message = { id: tempId, role: "user", content, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      
      // Add placeholder for assistant message
      setMessages(prev => [...prev, { id: tempId + 1, role: "assistant", content: "", createdAt: new Date().toISOString() }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  assistantMsg += data.content;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.content = assistantMsg;
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error("Error parsing SSE data", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsStreaming(false);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
    }
  }, [conversationId, queryClient]);

  return { messages, setMessages, sendMessage, isStreaming };
}
