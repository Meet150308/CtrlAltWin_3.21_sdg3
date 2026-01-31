import { useEffect, useRef, useState } from "react";
import { useChatStream, useConversations, useCreateConversation, useConversation } from "@/hooks/use-chat";
import { Send, Bot, User, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Assistant() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConvos } = useConversations();
  const { mutate: createChat, isPending: creating } = useCreateConversation();
  
  // Fetch history for active chat
  const { data: activeConversation } = useConversation(activeId);
  
  // Hook for sending messages & streaming
  const { messages: streamMessages, setMessages, sendMessage, isStreaming } = useChatStream(activeId);

  // Sync loaded history into local state when switching chats
  useEffect(() => {
    if (activeConversation?.messages) {
      setMessages(activeConversation.messages);
    }
  }, [activeConversation, setMessages]);

  // Set first conversation as active initially
  useEffect(() => {
    if (!activeId && conversations && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    
    const content = input;
    setInput("");
    await sendMessage(content);
  };

  const handleNewChat = () => {
    createChat("New Health Inquiry", {
      onSuccess: (newChat) => setActiveId(newChat.id),
    });
  };

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Sidebar List */}
      <div className="w-80 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Button 
            onClick={handleNewChat} 
            disabled={creating}
            className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {loadingConvos ? (
              <div className="text-center p-4 text-muted-foreground text-sm">Loading chats...</div>
            ) : conversations?.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveId(chat.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors truncate",
                  activeId === chat.id 
                    ? "bg-secondary font-medium text-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen">
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Bot className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a conversation or start a new one.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {streamMessages.length === 0 && (
                <div className="text-center text-muted-foreground mt-20">
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">Nagpur Health Assistant</h3>
                  <p className="max-w-md mx-auto">
                    Ask me about current air quality, health precautions, or symptoms related to pollution.
                  </p>
                </div>
              )}
              
              {streamMessages.map((msg, i) => (
                <div 
                  key={msg.id || i} 
                  className={cn(
                    "flex gap-4 max-w-3xl mx-auto",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm max-w-[85%]",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card border border-border rounded-tl-sm text-foreground"
                  )}>
                    {msg.content || (isStreaming && i === streamMessages.length - 1 ? <span className="animate-pulse">Thinking...</span> : "")}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-background border-t border-border">
              <form 
                onSubmit={handleSend}
                className="max-w-3xl mx-auto relative flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about air quality..."
                  className="rounded-full pl-6 pr-12 py-6 border-secondary bg-secondary/30 focus-visible:ring-primary shadow-sm"
                  disabled={isStreaming}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!input.trim() || isStreaming}
                  className="absolute right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </form>
              <p className="text-center text-[10px] text-muted-foreground mt-3">
                AI can make mistakes. Always consult a doctor for serious health concerns.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
