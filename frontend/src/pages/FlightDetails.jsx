import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { flights as flightService } from '../services/api';
import useStore from '../store';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedFlight } = useStore();
  
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Call the real API to get flight details
        const flightData = await flightService.getById(id);
        
        // Transform the flight data to match our UI structure
        const transformedFlight = {
          id: flightData.id,
          airline: flightData.airline,
          flightNumber: flightData.flightNumber,
          aircraft: flightData.aircraftId, // This should be looked up from the aircraft API
          departure: {
            airport: flightData.originAirportId, // This should be looked up from the airport API
            time: flightData.departureTime,
            terminal: 'Terminal 4' // This should come from the flight data
          },
          arrival: {
            airport: flightData.destinationAirportId, // This should be looked up from the airport API
            time: flightData.arrivalTime,
            terminal: 'Terminal 5' // This should come from the flight data
          },
          duration: `${Math.floor(flightData.durationMinutes / 60)}h ${flightData.durationMinutes % 60}m`,
          price: flightData.price,
          availableSeats: flightData.availableSeats,
          status: flightData.status
        };
        
        setFlight(transformedFlight);
      } catch (err) {
        console.error('Failed to load flight details:', err);
        setError(err.message || 'Failed to load flight details');
        // No fallback to mock data - show error instead
        setFlight(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlightDetails();
  }, [id]);

  const handleSelectFlight = () => {
    if (flight) {
      setSelectedFlight(flight);
      navigate('/seats');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Flight not found</h3>
          <p className="mt-1 text-gray-500">The flight you're looking for doesn't exist</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/search" className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Flight Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Flight Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{flight.airline} - {flight.flightNumber}</h2>
                <p className="text-blue-100">Aircraft: {flight.aircraft}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-white text-blue-600">
                  {flight.status}
                </span>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Departure Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Departure</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{flight.departure.airport}</p>
                      <p className="text-gray-500">{formatDate(flight.departure.time)}</p>
                      <p className="text-gray-500">{formatTime(flight.departure.time)}</p>
                      <p className="text-gray-500">{flight.departure.terminal}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrival Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Arrival</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{flight.arrival.airport}</p>
                      <p className="text-gray-500">{formatDate(flight.arrival.time)}</p>
                      <p className="text-gray-500">{formatTime(flight.arrival.time)}</p>
                      <p className="text-gray-500">{flight.arrival.terminal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Duration */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                </div>
                <div className="ml-2 mr-4 h-1 w-24 bg-gray-200 rounded"></div>
                <div className="text-sm text-gray-500">{flight.duration}</div>
                <div className="ml-4 mr-2 h-1 w-24 bg-gray-200 rounded"></div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">Baggage Allowance</h4>
                <p className="mt-1 text-sm text-gray-500">1 x 23kg checked bag</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">In-flight Entertainment</h4>
                <p className="mt-1 text-sm text-gray-500">Personal screen</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">Wi-Fi</h4>
                <p className="mt-1 text-sm text-gray-500">Available for purchase</p>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Price: <span className="text-2xl font-bold text-blue-600">${flight.price}</span>
                </p>
                <p className="text-sm text-gray-500">{flight.availableSeats} seats available</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleSelectFlight}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Select Seats
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;