import React from 'react';

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Economy</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-purple-200 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Premium</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Business</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Occupied</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Selected</span>
      </div>
    </div>
  );
};

export default SeatLegend;