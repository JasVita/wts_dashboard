import React from 'react';
import { CustomerStatsCard } from '../Stats/CustomerStatsCard';
import { ResponseTimeCard } from '../Stats/ResponseTimeCard';
import { SatisfactionCard } from '../Stats/SatisfactionCard';

export const MetricsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <CustomerStatsCard />
      <ResponseTimeCard />
      <SatisfactionCard />
    </div>
  );
};