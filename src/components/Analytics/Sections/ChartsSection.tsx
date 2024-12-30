import React from 'react';
import { ConversationTypeChart } from '../Charts/ConversationTypeChart';
import { DailyTrendChart } from '../Charts/DailyTrendChart';
import { TopicsChart } from '../Charts/TopicsChart';

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ConversationTypeChart />
      <DailyTrendChart />
      <TopicsChart />
    </div>
  );
};