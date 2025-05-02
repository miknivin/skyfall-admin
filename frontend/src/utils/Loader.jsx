
import React from 'react';

export const FullScreenLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-700 font-medium text-lg text-center">{text}</p>
      </div>
    </div>
  );
};