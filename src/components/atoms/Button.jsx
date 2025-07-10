import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  icon,
  iconPosition = "left",
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-card hover:shadow-card-hover",
    secondary: "bg-surface text-primary border border-primary hover:bg-primary hover:text-white shadow-card hover:shadow-card-hover",
    accent: "bg-gradient-to-r from-accent to-accent/90 text-white hover:from-accent/90 hover:to-accent/80 shadow-card hover:shadow-card-hover",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-error to-error/90 text-white hover:from-error/90 hover:to-error/80 shadow-card hover:shadow-card-hover",
    success: "bg-gradient-to-r from-success to-success/90 text-white hover:from-success/90 hover:to-success/80 shadow-card hover:shadow-card-hover"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;