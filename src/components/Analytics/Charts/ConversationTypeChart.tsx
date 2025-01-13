import React, { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';

interface HotWord {
  word: string;
  count: number;
}

export const ConversationTypeChart: React.FC = () => {
  const [_hotWords, setHotWords] = useState<HotWord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stats/stats/hotWords`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // 3) Now `setHotWords` exists, so this works
        setHotWords(data);
      } catch (err) {
        setError("無法載入對話資料");
        console.error("Error fetching conversation data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-medium mb-4">對話類型分佈</h3>
      <div className="h-64 flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500">載入中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <PieChart className="w-full h-full text-gray-300" />
        )}
      </div>
    </div>
  );
};