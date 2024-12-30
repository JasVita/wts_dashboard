import React from "react";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  Icon: LucideIcon;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, Icon, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center">
        <Icon className="w-full h-full text-gray-300" />
      </div>
    </div>
  );
};
