import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "btn btn--primary",
      secondary: "btn btn--secondary",
      ghost: "btn btn--ghost",
      gradient: "btn btn--gradient",
      danger: "btn btn--danger",
      success: "btn btn--success",
    };

    const sizes = {
      sm: "btn--sm",
      md: "",
      lg: "btn--lg",
      icon: "btn--icon",
    };

    return (
      <button
        className={cn(
          variants[variant],
          sizes[size],
          isLoading && "is-loading",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
