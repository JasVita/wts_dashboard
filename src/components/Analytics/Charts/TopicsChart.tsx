import React from 'react';
import { BarChart } from 'lucide-react';

export const TopicsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <h3 className="font-medium mb-4">熱門查詢主題</h3>
      <div className="h-64 flex items-center justify-center">
        <BarChart className="w-full h-full text-gray-300" />
      </div>
    </div>
  );
};