import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { flights as flightService } from '../services/api';
import useStore from '../store';
import { useApi } from '../hooks/useApi';
import FlightCard from '../components/common/FlightCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams } = useStore();
  
  // Use custom hook for API data fetching
  const { data: flights, loading, error, refetch } = useApi(() => 
    flightService.search(
      searchParams.originAirportId,
      searchParams.destinationAirportId,
      searchParams.departure,
      searchParams.passengers,
      'best'
    ), 
    [searchParams]
  );
  
  const [sortBy, setSortBy] = useState('best');

  const handleSortChange = async (newSortBy) => {
    setSortBy(newSortBy);
    // In a real implementation, you would re-fetch flights with the new sort option
    // For now, we'll just update the state
  };

  const handleSelectFlight = (flight) => {
    navigate('/flights/' + flight.id, { state: { flight } });
  };

  const formatSearchInfo = () => {
    const departureDate = new Date(searchParams.departure).toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `${searchParams.originAirportId} to ${searchParams.destinationAirportId} • ${departureDate} • ${searchParams.passengers} ${searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="md" message="Searching for flights..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <ErrorMessage 
            message={error.message || 'Failed to load flight results'} 
            showRetry={true}
            onRetry={refetch}
          />
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
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Flight Results</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Info */}
        <div className="mb-6">
          <p className="text-gray-600">{formatSearchInfo()}</p>
        </div>

        {/* Sort Options */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSortChange('best')}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === 'best'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Best
              </button>
              <button
                onClick={() => handleSortChange('price')}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === 'price'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cheapest
              </button>
              <button
                onClick={() => handleSortChange('duration')}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === 'duration'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Fastest
              </button>
              <button
                onClick={() => handleSortChange('departure')}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === 'departure'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Earliest Departure
              </button>
              <button
                onClick={() => handleSortChange('arrival')}
                className={`px-3 py-1 text-sm rounded-full ${
                  sortBy === 'arrival'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Latest Arrival
              </button>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-6">
          {flights && flights.length > 0 ? (
            flights.map((flight) => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                onSelect={handleSelectFlight} 
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No flights found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  New Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;