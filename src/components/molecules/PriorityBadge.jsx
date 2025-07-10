import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    High: { variant: "error", label: "High", pulse: true },
    Medium: { variant: "warning", label: "Medium", pulse: false },
    Low: { variant: "success", label: "Low", pulse: false }
  };

  const config = priorityConfig[priority] || priorityConfig.Low;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-medium",
        config.pulse && "animate-pulse-dot",
        className
      )}
    >
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;