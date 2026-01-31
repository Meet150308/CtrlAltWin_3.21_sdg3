import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, MobileNav } from "@/components/Sidebar";

import Dashboard from "@/pages/Dashboard";
import MapPage from "@/pages/MapPage";
import HealthGuide from "@/pages/HealthGuide";
import Assistant from "@/pages/Assistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 relative overflow-x-hidden pb-16 md:pb-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/map" component={MapPage} />
          <Route path="/health" component={HealthGuide} />
          <Route path="/assistant" component={Assistant} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
