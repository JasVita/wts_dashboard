import React, { useState } from "react";
import { BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium mb-4">
          {selectedStat} Over {selectedTimeline}
        </h2>
        <div className="h-80 flex items-center justify-center border">
          <p className="text-gray-500">Bar Chart Visualization</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Region Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Users by Region</h2>
          <div className="space-y-4">
            {regionData.map(({ region, percentage }) => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-gray-600">{region}</span>
                <span className="font-medium">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Initial Messages */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Initial Messages</h2>
          <div className="space-y-4">
            {initialMessagesData.map(({ message, count }) => (
              <div key={message} className="flex items-center justify-between">
                <span className="text-gray-600">"{message}"</span>
                <span className="font-medium">{count} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
