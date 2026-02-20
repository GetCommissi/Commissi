import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: "orange" | "green" | "blue" | "purple" | "red" | "teal";
  badge?: string;
  badgeVariant?: "positive" | "negative" | "neutral";
  subtext?: string;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, icon: Icon, iconColor = "orange", badge, badgeVariant = "positive", subtext, ...props }, ref) => {
    const iconColors = {
      orange: "bg-accent-glow text-accent",
      green: "bg-success-bg text-success",
      blue: "bg-blue-bg text-blue",
      purple: "bg-purple-bg text-purple",
      red: "bg-danger-bg text-danger",
      teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    };

    const badgeStyles = {
      positive: "text-success",
      negative: "text-danger",
      neutral: "text-text-secondary",
    };

    return (
      <div className={cn("stat-card", className)} ref={ref} {...props}>
        <div className="flex items-start justify-between">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconColors[iconColor])}>
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className={cn("text-xs font-semibold", badgeStyles[badgeVariant])}>
              {badgeVariant === "positive" && "+"}
              {badgeVariant === "negative" && "-"}
              {badge}
            </span>
          )}
        </div>
        <div>
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{value}</p>
          {subtext && <p className="body-sm mt-1">{subtext}</p>}
        </div>
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

export { StatCard };
