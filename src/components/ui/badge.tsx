import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "orange" | "green" | "red" | "purple" | "blue" | "neutral";
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", dot, children, ...props }, ref) => {
    const variants = {
      orange: "badge badge--orange",
      green: "badge badge--green",
      red: "badge badge--red",
      purple: "badge badge--purple",
      blue: "badge badge--blue",
      neutral: "badge badge--neutral",
    };

    return (
      <span className={cn(variants[variant], className)} ref={ref} {...props}>
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
