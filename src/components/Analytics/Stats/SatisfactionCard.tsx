import React from 'react';
import { Smile } from 'lucide-react';
import { MetricsCard } from '../Common/MetricsCard';

export const SatisfactionCard: React.FC = () => {
  return (
    <MetricsCard
      title="客戶滿意度"
      value="94.5%"
      change="+2.3% 較上月"
      changeType="positive"
      Icon={Smile}
      iconColor="text-green-500"
    />
  );
};