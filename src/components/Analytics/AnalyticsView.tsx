import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

// Ensure `dataByTimeline` and `labelsByTimeline` have keys matching `TimelineKey`
const dataByTimeline: any = {
  "Last 24 Hours": [5, 10, 15, 20, 25, 30, 35],
  "Last Week": [12, 19, 3, 5, 2, 3, 9],
  "Last Month": [
    40, 60, 30, 80, 20, 50, 70, 60, 30, 80, 20, 50, 70, 60, 30, 80, 20, 50, 70, 60, 30, 80, 20, 50,
    70, 60, 30, 80, 20, 50,
  ],
  "Last 2 Months": [100, 200, 150, 120, 250, 300, 220, 69],
  "Last Quarter": [300, 400, 500, 350, 450, 550, 600, 500, 350, 450, 550, 600],
};

const labelsByTimeline: any = {
  "Last 24 Hours": ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "12 AM"],
  "Last Week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "Last Month": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  "Last 2 Months": Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`),
  "Last Quarter": Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
};

const statOptions = ["Active Users", "Lead Qualification Rate", "AI Engagement Success Rate"];
const timelineOptions = [
  "Last 24 Hours",
  "Last Week",
  "Last Month",
  "Last 2 Months",
  "Last Quarter",
];

export const AnalyticsView: React.FC = () => {
  const [selectedTimeline, setSelectedTimeline] = useState("Last 24 Hours");
  const [selectedStat, setSelectedStat] = useState("Active Users");

  const regionData = [
    { region: "North America (+1)", percentage: 35 },
    { region: "Europe (+44)", percentage: 25 },
    { region: "Asia (+81)", percentage: 20 },
    { region: "Australia (+61)", percentage: 15 },
    { region: "Others", percentage: 5 },
  ];

  const initialMessagesData = [
    { message: "Hi", count: 1200 },
    { message: "Hello", count: 800 },
    { message: "Help", count: 500 },
    { message: "Question", count: 300 },
    { message: "Support", count: 200 },
  ];

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedStat} Over ${selectedTimeline}`,
        font: {
          size: 18,
        },
      },
    },
  };

  // Bar chart configuration
  const barChartData = {
    labels: labelsByTimeline[selectedTimeline],
    datasets: [
      {
        label: `${selectedStat} Data`,
        data: dataByTimeline[selectedTimeline],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: regionData.map((item) => item.region), // Regions as labels
    datasets: [
      {
        data: regionData.map((item) => item.percentage), // Percentages as data
        backgroundColor: [
          "#FF6384", // North America
          "#36A2EB", // Europe
          "#FFCE56", // Asia
          "#4BC0C0", // Australia
          "#9966FF", // Others
        ],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Pie Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Legend at the top
      },
      title: {
        display: true,
        text: "Users by Region",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">數據分析</h1>
        <Select onValueChange={setSelectedTimeline}>
          <SelectTrigger className="w-[180px] focus:ring-blue-500 bg-white">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-evenly gap-4 mb-8">
        {statOptions.map((label) => (
          <button
            key={label}
            onClick={() => setSelectedStat(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-72 border ${
              selectedStat === label
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Bar Chart Section */}
      <div className="flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 w-3/4">
          <Bar options={barChartOptions} data={barChartData} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Region Distribution */}
        <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-sm">
          <div className="w-1/2">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Initial Messages */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Initial Messages</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Message</th>
                <th className="border-b p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {initialMessagesData.map(({ message, count }) => (
                <tr key={message}>
                  <td className="border-b p-2">"{message}"</td>
                  <td className="border-b p-2">{count} users</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
