import React from 'react';
import { Clock } from 'lucide-react';
import { MetricsCard } from '../Common/MetricsCard';

export const ResponseTimeCard: React.FC = () => {
  return (
    <MetricsCard
      title="平均回應時間"
      value="2.5 分鐘"
      change="+0.5 分鐘 較上月"
      changeType="negative"
      Icon={Clock}
      iconColor="text-yellow-500"
    />
  );
};