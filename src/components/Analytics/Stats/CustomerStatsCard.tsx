import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { MetricsCard } from '../Common/MetricsCard';

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
        const countResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stats/stats/count`);
        const countData = await countResponse.json();
        const namesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stats/stats/customers`);
        const namesData = await namesResponse.json();

        setData({
          count: countData.count,
          names: namesData.map((customer: { name: string }) => customer.name),
        });
      } catch (err) {
        setError("無法載入客戶資料");
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MetricsCard
      title="客戶總數"
      value={error ? "載入失敗" : loading ? "載入中..." : data.count.toString()}
      change={error ? "無法取得增長數據" : "+12.5% 較上月"}
      changeType={error ? "negative" : "positive"}
      Icon={MessageSquare}
      iconColor="text-blue-500"
    />
  );
};