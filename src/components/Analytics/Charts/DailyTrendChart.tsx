import React from 'react';
import { LineChart } from 'lucide-react';

export const DailyTrendChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-medium mb-4">每日對話量趨勢</h3>
      <div className="h-64 flex items-center justify-center">
        <LineChart className="w-full h-full text-gray-300" />
      </div>
    </div>
  );
};