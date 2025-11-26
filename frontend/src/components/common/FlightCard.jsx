import React from 'react';
import { Link } from 'react-router-dom';

const FlightCard = ({ flight, onSelect }) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateDuration = (departure, arrival) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const diffMs = arrivalTime - departureTime;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMinutes = Math.floor((diffMs % 3600000) / 60000);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{flight.airline}</h3>
                <p className="text-gray-600">{flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${flight.price}</p>
                <p className="text-sm text-gray-500">per passenger</p>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                <p className="text-sm text-gray-600">{flight.originAirportCode}</p>
                <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
              </div>

              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">
                      {calculateDuration(flight.departureTime, flight.arrivalTime)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
                <p className="text-sm text-gray-600">{flight.destinationAirportCode}</p>
                <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
              </div>
            </div>

            {flight.aircraft && (
              <div className="mt-3 text-sm text-gray-500">
                <span>Aircraft: {flight.aircraft.aircraftNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {flight.status}
            </span>
            {flight.availableSeats <= 5 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Only {flight.availableSeats} seats left
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(flight)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;