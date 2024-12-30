import React from "react";
import { MetricsSection } from "./Sections/MetricsSection";
import { ChartsSection } from "./Sections/ChartsSection";

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">數據分析</h1>
      <MetricsSection />
      <ChartsSection />
    </div>
  );
};
