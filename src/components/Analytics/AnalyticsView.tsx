import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartData,
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
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const reorderDays = (days: string[], startDay: string) => {
  const startIndex = days.findIndex((day) => day.trim() === startDay.trim());
  return [...days.slice(startIndex + 1), ...days.slice(0, startIndex + 1)];
};

const getWeeklyLabels = (weeksBack: number) => {
  const labels = [];
  const today = new Date();

  // Get the current week's start date
  let currentWeekStart = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days to subtract to reach Monday
  currentWeekStart.setDate(today.getDate() - daysToMonday);

  for (let i = 0; i < weeksBack; i++) {
    labels.unshift(currentWeekStart.toISOString().split("T")[0]); // Add the week start date to labels in YYYY-MM-DD format
    currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Move back 1 week
  }

  return labels;
};

const today = new Date();

const labelsByTimeline: any = {
  "Last 24 Hours": ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
  "Last Week": [
    "Monday   ",
    "Tuesday  ",
    "Wednesday",
    "Thursday ",
    "Friday   ",
    "Saturday ",
    "Sunday   ",
  ],
  "Last Month": Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  }),
  "Last 2 Months": getWeeklyLabels(8),
  "Last Quarter": getWeeklyLabels(12),
};

const timelineOptions = [
  "Last 24 Hours",
  "Last Week",
  "Last Month",
  "Last 2 Months",
  "Last Quarter",
];

const statOptions = ["Active Users", "Booked Meetings", "Fully AI handled chats"];

export const AnalyticsView: React.FC = () => {
  const [selectedTimeline, setSelectedTimeline] = useState("Last 24 Hours");
  const [selectedStat, setSelectedStat] = useState("Active Users");
  const [activeUsers, setactiveUsers] = useState<any>({});
  const [bookedMeetings, setbookedMeetings] = useState<any>({});
  const [AIhandled, setAIhandled] = useState<any>({});
  const [WAIDS, setWAIDS] = useState<any>({});
  const [barChartData, setBarChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });
  const [pieChartData, setpieChartData] = useState<ChartData<"pie">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/stats/stats/activeUsers`
        );
        setactiveUsers(response.data);

        const response2 = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/stats/stats/bookedMeetings`
        );
        setbookedMeetings(response2.data);

        const response3 = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/stats/stats/AIhandled`
        );
        setAIhandled(response3.data);

        const response4 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stats/stats/WAIDS`);
        setWAIDS(response4.data);

        // Initialize an array of zeros with the same length as `timeIntervals`
        const initialBarChart = Array(labelsByTimeline[selectedTimeline].length).fill(0);

        // Populate the result array based on `initialBarChart`
        response.data[0].forEach((entry: { time_interval: string; info: number }) => {
          const index = labelsByTimeline[selectedTimeline].indexOf(entry.time_interval); // Find the index of the time interval
          initialBarChart[index] = Number(entry.info); // Set the user count at the correct index
        });

        // Initialize Pie Chart Data for "Last 24 Hours"
        const initialPieChart = response4.data[0]; // Assuming index 0 is "Last 24 Hours"

        setBarChartData({
          labels: labelsByTimeline[selectedTimeline],
          datasets: [
            {
              label: `${selectedStat} Data`,
              data: initialBarChart,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });

        setpieChartData({
          labels: initialPieChart.map((item: { region: any }) => item.region),
          datasets: [
            {
              data: initialPieChart.map((item: { percentage: any }) => item.percentage),
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    try {
      const dataSources: any = {
        "Active Users": activeUsers,
        "Booked Meetings": bookedMeetings,
        "Fully AI handled chats": AIhandled,
      };

      const fieldMapping: any = {
        "Last 24 Hours": "time_interval",
        "Last Week": "day_of_week",
        "Last Month": "day",
        "Last 2 Months": "week",
        "Last Quarter": "week",
      };

      const sourceData = dataSources[selectedStat][timelineOptions.indexOf(selectedTimeline)];
      const field = fieldMapping[selectedTimeline];
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const newLabelsByTimeLine = reorderDays(labelsByTimeline[selectedTimeline], today);

      const data = Array(newLabelsByTimeLine.length).fill(0);

      sourceData.forEach((entry: { [x: string]: string; info: any }) => {
        const index = newLabelsByTimeLine.indexOf(entry[field]);
        data[index] = Number(entry.info);
      });

      setBarChartData({
        labels: newLabelsByTimeLine,
        datasets: [
          {
            label: `${selectedStat} Data`,
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error updating timeline for active users:", error);
    }
  }, [selectedTimeline, selectedStat]);

  useEffect(() => {
    try {
      const data = WAIDS[timelineOptions.indexOf(selectedTimeline)];

      setpieChartData({
        labels: data.map((item: any) => item.region),
        datasets: [
          {
            label: `${selectedStat} Data`,
            data: data.map((item: any) => item.amount),
            backgroundColor: ["#FF6384", "#FFCE56", "4BC0C0"],
            // borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error updating timeline for active users:", error);
    }
  }, [selectedTimeline]);

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
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            // Ensure the value is an integer before displaying it
            if (typeof tickValue === "number" && Number.isInteger(tickValue)) {
              return tickValue;
            }
            return null;
          },
          stepSize: 1, // Ensure step size is 1 to display all integers
        },
      },
    },
  };

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
            <SelectValue placeholder={selectedTimeline} />
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
