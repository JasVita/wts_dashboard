import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { MetricsCard } from "../Common/MetricsCard";

interface CustomerData {
  count: number;
  names: string[];
}

export const CustomerStatsCard: React.FC = () => {
  const [data, setData] = useState<CustomerData>({ count: 0, names: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch customer stats
        const countResponse = await fetch("http://localhost:3000/api/stats/stats/count");
        const countData = await countResponse.json();

        // Fetch customer names
        const namesResponse = await fetch("http://localhost:3000/api/stats/stats/customers");
        const namesData = await namesResponse.json();

        setData({
          count: countData.count,
          names: namesData.map((customer: { name: string }) => customer.name),
        });
      } catch (err) {
        setError("Failed to fetch customer data");
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <MetricsCard title="客戶總數" value="載入中..." change="--" changeType="positive" Icon={MessageSquare} iconColor="text-blue-500" />;
  }

  if (error) {
    return <MetricsCard title="客戶總數" value="載入失敗" change="請稍後再試" changeType="negative" Icon={MessageSquare} iconColor="text-red-500" />;
  }

  return <MetricsCard title="客戶總數" value={data.count.toString()} change={`${data.names.length} 位活躍客戶`} changeType="positive" Icon={MessageSquare} iconColor="text-blue-500" />;
};
