import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, HeartPulse, MessageSquareText, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Pollution Map", href: "/map", icon: Map },
  { label: "Health Guide", href: "/health", icon: HeartPulse },
  { label: "AI Assistant", href: "/assistant", icon: MessageSquareText },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r bg-card/50 backdrop-blur-xl">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Wind className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              NagpurAir
            </h1>
            <p className="text-xs text-muted-foreground font-medium">Urban Health Monitor</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50">
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-4 border border-accent/20">
          <h4 className="font-display font-bold text-accent-foreground text-sm mb-1">Health Alert</h4>
          <p className="text-xs text-muted-foreground mb-3">
            AQI in Central Nagpur is rising. Check precautions.
          </p>
          <Link href="/health" className="text-xs font-semibold text-accent hover:underline">
            View Guide →
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 px-6 py-3 flex justify-between items-center pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2">
            <div className={cn(
              "p-2 rounded-full transition-all",
              isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground"
            )}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
