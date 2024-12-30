import React from 'react';
import { BarChart } from 'lucide-react';
import { ChartCard } from '../Common/ChartCard';

export const TopicsChart: React.FC = () => {
  return (
    <ChartCard
      title="熱門查詢主題"
      Icon={BarChart}
      className="col-span-2"
    />
  );
};