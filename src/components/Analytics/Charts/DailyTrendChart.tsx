import React from 'react';
import { LineChart } from 'lucide-react';
import { ChartCard } from '../Common/ChartCard';

export const DailyTrendChart: React.FC = () => {
  return (
    <ChartCard
      title="每日對話量趨勢"
      Icon={LineChart}
    />
  );
};