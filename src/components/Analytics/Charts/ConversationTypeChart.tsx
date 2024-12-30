import React, { useEffect, useState } from "react";
{
  /* <div>
  <ChartCard title="對話類型分佈" Icon={PieChart} />
</div>; */
}
interface HotWord {
  count: number;
  word: string;
}
export const ConversationTypeChart: React.FC = () => {
  const [hotWords, setHotWords] = useState<HotWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // Fetch hotWords
        const response = await fetch("http://localhost:3000/api/stats/stats/hotWords");
        const responsejson = await response.json();

        setHotWords(responsejson);
      } catch (err) {
        setError("Failed to fetch customer data");
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center shadow-sm">
      <div className="bg-white rounded-lg p-6 flex flex-col w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">對話類型分佈</h2>
        <div className="overflow-hidden border-2 border-gray-100 rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Topics</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotWords.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 text-sm text-gray-800 text-center">{loading ? <p>載入中...</p> : error ? <p>載入失敗</p> : <p>{item.word}</p>}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">{loading ? <p>載入中...</p> : error ? <p>載入失敗</p> : <p>{item.count}</p>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
