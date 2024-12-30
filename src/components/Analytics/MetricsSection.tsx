import React, { useEffect, useState } from "react";
import { MessageSquare, Clock, Smile } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { getCustomerStats, CustomerStats } from "../../services/api";

export const MetricsSection: React.FC = () => {
  const [customerStats, setCustomerStats] = useState<CustomerStats>({
    totalCustomers: 0,
    monthlyGrowth: "0.0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getCustomerStats();
      setCustomerStats(stats);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <MetricsCard title="客戶總數" value={customerStats.totalCustomers.toLocaleString()} change={`+${customerStats.monthlyGrowth}% 較上月`} changeType="positive" Icon={MessageSquare} iconColor="text-blue-500" />

      <MetricsCard title="平均回應時間" value="2.5 分鐘" change="+0.5 分鐘 較上月" changeType="negative" Icon={Clock} iconColor="text-yellow-500" />

      <MetricsCard title="客戶滿意度" value="94.5%" change="+2.3% 較上月" changeType="positive" Icon={Smile} iconColor="text-green-500" />
    </div>
  );
};
