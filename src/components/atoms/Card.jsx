import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;