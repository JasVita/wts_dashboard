"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, BarChart2, FileText } from "lucide-react";

export const NarrowSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-14 border-r bg-white flex flex-col items-center py-4">
      <button
        onClick={() => router.push("/chats")}
        className={`p-3 rounded-lg mb-2 transition-colors ${
          pathname === "/" ? "bg-green-50 text-green-600" : "text-gray-400 hover:bg-gray-50"
        }`}
        title="訊息"
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <button
        onClick={() => router.push("/analytics")}
        className={`p-3 rounded-lg mb-2 transition-colors ${
          pathname === "/analytics"
            ? "bg-green-50 text-green-600"
            : "text-gray-400 hover:bg-gray-50"
        }`}
        title="數據分析"
      >
        <BarChart2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => router.push("/documents")}
        className={`p-3 rounded-lg transition-colors ${
          pathname === "/documents"
            ? "bg-green-50 text-green-600"
            : "text-gray-400 hover:bg-gray-50"
        }`}
        title="文件"
      >
        <FileText className="w-5 h-5" />
      </button>
    </div>
  );
};
