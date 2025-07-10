import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const CategoryBadge = ({ category, className }) => {
  const categoryConfig = {
    Work: { variant: "primary", label: "Work" },
    Personal: { variant: "success", label: "Personal" },
    Health: { variant: "error", label: "Health" },
    Learning: { variant: "warning", label: "Learning" },
    Leisure: { variant: "info", label: "Leisure" },
    Finance: { variant: "accent", label: "Finance" }
  };
  const config = categoryConfig[category] || categoryConfig.Personal;

  return (
    <Badge
      variant={config.variant}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};

export default CategoryBadge;