import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flights as flightService, airports as airportService } from '../services/api';
import useStore from '../store';

const SearchFlights = () => {
  const navigate = useNavigate();
  const { setSearchParams, setSelectedFlight } = useStore();
  
  const [searchData, setSearchData] = useState({
    fromCountry: '',
    fromState: '',
    fromAirport: '',
    toCountry: '',
    toState: '',
    toAirport: '',
    departure: '',
    return: '',
    passengers: 1,
    tripType: 'one-way'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([
    { id: 'country-1', name: 'United States' },
    { id: 'country-2', name: 'United Kingdom' },
    { id: 'country-3', name: 'France' },
    { id: 'country-4', name: 'Germany' },
    { id: 'country-5', name: 'Japan' },
    { id: 'country-6', name: 'Canada' },
    { id: 'country-7', name: 'Australia' },
    { id: 'country-8', name: 'India' }
  ]);
  const [fromStates, setFromStates] = useState([]);
  const [toStates, setToStates] = useState([]);
  const [fromAirports, setFromAirports] = useState([]);
  const [toAirports, setToAirports] = useState([]);

  // Default states and airports for mock data
  const defaultStates = {
    'country-1': [
      { id: 'state-1', name: 'California' },
      { id: 'state-2', name: 'New York' },
      { id: 'state-3', name: 'Texas' }
    ],
    'country-2': [
      { id: 'state-4', name: 'England' },
      { id: 'state-5', name: 'Scotland' }
    ],
    'country-3': [
      { id: 'state-6', name: 'Île-de-France' }
    ],
    'country-8': [
      { id: 'state-7', name: 'Maharashtra' },
      { id: 'state-8', name: 'Karnataka' }
    ]
  };

  const defaultAirports = {
    'country-1': [
      { id: 'airport-1', name: 'Los Angeles International Airport', iataCode: 'LAX' },
      { id: 'airport-2', name: 'John F. Kennedy International Airport', iataCode: 'JFK' },
      { id: 'airport-3', name: 'Dallas/Fort Worth International Airport', iataCode: 'DFW' }
    ],
    'country-2': [
      { id: 'airport-4', name: 'London Heathrow Airport', iataCode: 'LHR' }
    ],
    'country-3': [
      { id: 'airport-5', name: 'Charles de Gaulle Airport', iataCode: 'CDG' }
    ],
    'country-8': [
      { id: 'airport-6', name: 'Chhatrapati Shivaji Maharaj International Airport', iataCode: 'BOM' },
      { id: 'airport-7', name: 'Kempegowda International Airport', iataCode: 'BLR' }
    ],
    'state-1': [
      { id: 'airport-1', name: 'Los Angeles International Airport', iataCode: 'LAX' },
      { id: 'airport-8', name: 'San Francisco International Airport', iataCode: 'SFO' }
    ],
    'state-2': [
      { id: 'airport-2', name: 'John F. Kennedy International Airport', iataCode: 'JFK' },
      { id: 'airport-9', name: 'LaGuardia Airport', iataCode: 'LGA' }
    ],
    'state-7': [
      { id: 'airport-6', name: 'Chhatrapati Shivaji Maharaj International Airport', iataCode: 'BOM' }
    ],
    'state-8': [
      { id: 'airport-7', name: 'Kempegowda International Airport', iataCode: 'BLR' }
    ]
  };


  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryData = await airportService.getAllCountries();
        if (countryData && countryData.length > 0) {
          setCountries(countryData);
        }
        // If API fails, we'll keep the default countries
      } catch (err) {
        console.error('Failed to load countries from API, using default countries:', err);
        // Keep the default countries already set in state
      }
    };
    
    loadCountries();
  }, []);

  // Load states when fromCountry is selected
  useEffect(() => {
    const loadFromStates = async () => {
      if (searchData.fromCountry) {
        try {
          const stateData = await airportService.getStatesByCountry(searchData.fromCountry);
          if (stateData && stateData.length > 0) {
            setFromStates(stateData);
          } else {
            // Use default states if API returns no data
            setFromStates(defaultStates[searchData.fromCountry] || []);
          }
          // Reset dependent fields
          setSearchData(prev => ({
            ...prev,
            fromState: '',
            fromAirport: ''
          }));
          setFromAirports([]);
        } catch (err) {
          console.error('Failed to load from states, using default data:', err);
          // Use default states if API fails
          setFromStates(defaultStates[searchData.fromCountry] || []);
        }
      } else {
        setFromStates([]);
        setSearchData(prev => ({
          ...prev,
          fromState: '',
          fromAirport: ''
        }));
        setFromAirports([]);
      }
    };
    
    loadFromStates();
  }, [searchData.fromCountry]);

  // Load states when toCountry is selected
  useEffect(() => {
    const loadToStates = async () => {
      if (searchData.toCountry) {
        try {
          const stateData = await airportService.getStatesByCountry(searchData.toCountry);
          if (stateData && stateData.length > 0) {
            setToStates(stateData);
          } else {
            // Use default states if API returns no data
            setToStates(defaultStates[searchData.toCountry] || []);
          }
          // Reset dependent fields
          setSearchData(prev => ({
            ...prev,
            toState: '',
            toAirport: ''
          }));
          setToAirports([]);
        } catch (err) {
          console.error('Failed to load to states, using default data:', err);
          // Use default states if API fails
          setToStates(defaultStates[searchData.toCountry] || []);
        }
      } else {
        setToStates([]);
        setSearchData(prev => ({
          ...prev,
          toState: '',
          toAirport: ''
        }));
        setToAirports([]);
      }
    };
    
    loadToStates();
  }, [searchData.toCountry]);

  // Load airports when fromState is selected
  useEffect(() => {
    const loadFromAirports = async () => {
      if (searchData.fromState) {
        try {
          const airportData = await airportService.getAirportsByState(searchData.fromState);
          if (airportData && airportData.length > 0) {
            setFromAirports(airportData);
          } else {
            // Use default airports if API returns no data
            setFromAirports(defaultAirports[searchData.fromState] || []);
          }
          // Reset airport selection
          setSearchData(prev => ({
            ...prev,
            fromAirport: ''
          }));
        } catch (err) {
          console.error('Failed to load from airports, using default data:', err);
          // Use default airports if API fails
          setFromAirports(defaultAirports[searchData.fromState] || []);
        }
      } else if (searchData.fromCountry && !searchData.fromState) {
        // Load airports by country if no state selected
        try {
          const airportData = await airportService.getAirportsByCountry(searchData.fromCountry);
          if (airportData && airportData.length > 0) {
            setFromAirports(airportData);
          } else {
            // Use default airports if API returns no data
            setFromAirports(defaultAirports[searchData.fromCountry] || []);
          }
          setSearchData(prev => ({
            ...prev,
            fromAirport: ''
          }));
        } catch (err) {
          console.error('Failed to load from airports, using default data:', err);
          // Use default airports if API fails
          setFromAirports(defaultAirports[searchData.fromCountry] || []);
        }
      } else {
        setFromAirports([]);
        setSearchData(prev => ({
          ...prev,
          fromAirport: ''
        }));
      }
    };
    
    loadFromAirports();
  }, [searchData.fromState, searchData.fromCountry]);

  // Load airports when toState is selected
  useEffect(() => {
    const loadToAirports = async () => {
      if (searchData.toState) {
        try {
          const airportData = await airportService.getAirportsByState(searchData.toState);
          if (airportData && airportData.length > 0) {
            setToAirports(airportData);
          } else {
            // Use default airports if API returns no data
            setToAirports(defaultAirports[searchData.toState] || []);
          }
          // Reset airport selection
          setSearchData(prev => ({
            ...prev,
            toAirport: ''
          }));
        } catch (err) {
          console.error('Failed to load to airports, using default data:', err);
          // Use default airports if API fails
          setToAirports(defaultAirports[searchData.toState] || []);
        }
      } else if (searchData.toCountry && !searchData.toState) {
        // Load airports by country if no state selected
        try {
          const airportData = await airportService.getAirportsByCountry(searchData.toCountry);
          if (airportData && airportData.length > 0) {
            setToAirports(airportData);
          } else {
            // Use default airports if API returns no data
            setToAirports(defaultAirports[searchData.toCountry] || []);
          }
          setSearchData(prev => ({
            ...prev,
            toAirport: ''
          }));
        } catch (err) {
          console.error('Failed to load to airports, using default data:', err);
          // Use default airports if API fails
          setToAirports(defaultAirports[searchData.toCountry] || []);
        }
      } else {
        setToAirports([]);
        setSearchData(prev => ({
          ...prev,
          toAirport: ''
        }));
      }
    };
    
    loadToAirports();
  }, [searchData.toState, searchData.toCountry]);

  // Handle search input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!searchData.fromAirport || !searchData.toAirport || !searchData.departure) {
      setError('Please select origin and destination airports and departure date');
      return;
    }
    
    if (searchData.tripType === 'round-trip' && !searchData.return) {
      setError('Please select a return date');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Set search params in store
      setSearchParams({
        ...searchData,
        originAirportId: searchData.fromAirport,
        destinationAirportId: searchData.toAirport
      });
      
      // Navigate to results page
      navigate('/flights/results');
    } catch (err) {
      setError(err.message || 'Failed to search for flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Search Flights</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/airports" className="text-blue-600 hover:text-blue-800 font-medium">
                Airport Search
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSearch}>
            {/* Trip Type */}
            <div className="flex space-x-4 mb-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="tripType"
                  value="one-way"
                  checked={searchData.tripType === 'one-way'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700">One Way</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="tripType"
                  value="round-trip"
                  checked={searchData.tripType === 'round-trip'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700">Round Trip</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* From Country */}
              <div>
                <label htmlFor="fromCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  From Country
                </label>
                <select
                  id="fromCountry"
                  name="fromCountry"
                  value={searchData.fromCountry}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id} className="text-gray-900">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* From State */}
              <div>
                <label htmlFor="fromState" className="block text-sm font-medium text-gray-700 mb-1">
                  From State/Province
                </label>
                <select
                  id="fromState"
                  name="fromState"
                  value={searchData.fromState}
                  onChange={handleChange}
                  disabled={!searchData.fromCountry}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
                >
                  <option value="">Select State (Optional)</option>
                  {fromStates.map(state => (
                    <option key={state.id} value={state.id} className="text-gray-900">
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* From Airport */}
              <div>
                <label htmlFor="fromAirport" className="block text-sm font-medium text-gray-700 mb-1">
                  From Airport
                </label>
                <select
                  id="fromAirport"
                  name="fromAirport"
                  value={searchData.fromAirport}
                  onChange={handleChange}
                  disabled={!searchData.fromCountry}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select Airport</option>
                  {fromAirports.map(airport => (
                    <option key={airport.id} value={airport.id} className="text-gray-900">
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* To Country */}
              <div>
                <label htmlFor="toCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  To Country
                </label>
                <select
                  id="toCountry"
                  name="toCountry"
                  value={searchData.toCountry}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id} className="text-gray-900">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To State */}
              <div>
                <label htmlFor="toState" className="block text-sm font-medium text-gray-700 mb-1">
                  To State/Province
                </label>
                <select
                  id="toState"
                  name="toState"
                  value={searchData.toState}
                  onChange={handleChange}
                  disabled={!searchData.toCountry}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
                >
                  <option value="">Select State (Optional)</option>
                  {toStates.map(state => (
                    <option key={state.id} value={state.id} className="text-gray-900">
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Airport */}
              <div>
                <label htmlFor="toAirport" className="block text-sm font-medium text-gray-700 mb-1">
                  To Airport
                </label>
                <select
                  id="toAirport"
                  name="toAirport"
                  value={searchData.toAirport}
                  onChange={handleChange}
                  disabled={!searchData.toCountry}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 bg-white"
                  required
                >
                  <option value="">Select Airport</option>
                  {toAirports.map(airport => (
                    <option key={airport.id} value={airport.id} className="text-gray-900">
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure */}
              <div>
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="departure"
                    name="departure"
                    value={searchData.departure}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Return (conditional) */}
              {searchData.tripType === 'round-trip' && (
                <div>
                  <label htmlFor="return" className="block text-sm font-medium text-gray-700 mb-1">
                    Return
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      id="return"
                      name="return"
                      value={searchData.return}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Passengers */}
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Passengers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2C7 16.656 7.126 16.029 7.356 15.454M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <select
                    id="passengers"
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  'Search Flights'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Popular Destinations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496581429265-08be267e4b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-5661de0fe4c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
              { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
            ].map((destination, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={destination.image} 
                  alt={destination.city} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{destination.city}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFlights;