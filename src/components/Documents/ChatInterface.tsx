import React from 'react';

export const ChatInterface: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg max-w-2xl ml-auto">
        <p className="text-gray-700">This is a simulated response using gpt-4 with 0 documents.</p>
      </div>
    </div>
  );
};