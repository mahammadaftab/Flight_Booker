import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handleSelectFlight = () => {
    navigate(`/flights/${flight.id}`, { state: { flight } });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get flight type from flight data or default to Direct
  const getFlightType = () => {
    return flight.flightType || "Direct";
  };

  // Calculate seat availability percentage
  const getSeatAvailability = () => {
    if (flight.totalSeats && flight.availableSeats) {
      const percentage = (flight.availableSeats / flight.totalSeats) * 100;
      if (percentage > 50) return "Good availability";
      if (percentage > 20) return "Limited seats";
      return "Very few seats left";
    }
    return "Availability info not available";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">{flight.airline}</h3>
                  <p className="text-gray-500">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getFlightType()}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                    <p className="text-gray-500">{formatDate(flight.departureTime)}</p>
                  </div>

                  <div className="flex flex-col items-center mx-4 my-2 sm:my-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="ml-2 mr-2 h-1 w-16 bg-gray-200 rounded"></div>
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-300"></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{formatDuration(flight.durationMinutes)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
                    <p className="text-gray-500">{formatDate(flight.arrivalTime)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center">
              <div className="flex items-center mr-4">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="ml-1 text-sm text-gray-500">{flight.originAirportId}</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="ml-1 text-sm text-gray-500">{flight.destinationAirportId}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 md:ml-6 md:text-right">
            <p className="text-2xl font-bold text-gray-900">${flight.price}</p>
            <p className="text-sm text-gray-500">{flight.availableSeats} seats available</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                flight.availableSeats > 5 ? 'bg-green-100 text-green-800' : 
                flight.availableSeats > 2 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {getSeatAvailability()}
              </span>
            </div>
            <button
              onClick={handleSelectFlight}
              className="mt-4 w-full md:w-auto px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Select
            </button>
          </div>
        </div>
        
        {/* Mobile flight type indicator */}
        <div className="mt-4 md:hidden">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {getFlightType()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;