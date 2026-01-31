import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  color?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  className,
  color = "default" 
}: StatCardProps) {
  
  const colorStyles = {
    default: "bg-card border-border/50",
    success: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50",
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50",
    destructive: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50",
  };

  return (
    <div className={cn(
      "rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md",
      colorStyles[color],
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold tracking-tight text-foreground">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 bg-background/50 rounded-xl backdrop-blur-sm shadow-sm border border-black/5">
            {icon}
          </div>
        )}
      </div>
      
      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 text-sm">
          {trendValue && (
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded-full text-xs",
              trend === "up" ? "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400" : 
              trend === "down" ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" :
              "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
          {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
