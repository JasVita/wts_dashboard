import React from "react";
import { PieChart, LineChart, BarChart } from "lucide-react";
import { ChartCard } from "./ChartCard";

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ChartCard title="對話類型分佈" Icon={PieChart} />

      <ChartCard title="每日對話量趨勢" Icon={LineChart} />

      <ChartCard title="熱門查詢主題" Icon={BarChart} className="col-span-2" />
    </div>
  );
};
