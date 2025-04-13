
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral", 
  className 
}: StatCardProps) {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium flex items-center mt-1", {
              "text-green-600": trend === "up",
              "text-red-600": trend === "down",
              "text-gray-500": trend === "neutral"
            })}>
              {change}
            </p>
          )}
        </div>
        <div className="bg-primary/10 p-2 rounded-md">
          <Icon className="text-primary" size={24} />
        </div>
      </div>
    </div>
  );
}
