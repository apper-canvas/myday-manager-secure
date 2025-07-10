import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    "To Do": { variant: "default", label: "To Do" },
    "In Progress": { variant: "info", label: "In Progress" },
    "Done": { variant: "success", label: "Done" }
  };

  const config = statusConfig[status] || statusConfig["To Do"];

  return (
    <Badge
      variant={config.variant}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;