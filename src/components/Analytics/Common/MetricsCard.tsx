import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  Icon: LucideIcon;
  iconColor: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType,
  Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{title}</h3>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
};