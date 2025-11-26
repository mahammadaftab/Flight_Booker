import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { airports as airportService } from '../services/api';

const AirportSearch = () => {
  const [searchType, setSearchType] = useState('name'); // name, city, iata, country, state
  const [searchTerm, setSearchTerm] = useState('');
  const [airports, setAirports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryData = await airportService.getAllCountries();
        setCountries(countryData);
      } catch (err) {
        console.error('Failed to load countries:', err);
      }
    };
    
    loadCountries();
  }, []);

  // Load states when country is selected
  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountry) {
        try {
          const stateData = await airportService.getStatesByCountry(selectedCountry);
          setStates(stateData);
          setSelectedState(''); // Reset state selection when country changes
        } catch (err) {
          console.error('Failed to load states:', err);
        }
      } else {
        setStates([]);
        setSelectedState('');
      }
    };
    
    loadStates();
  }, [selectedCountry]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setAirports([]);
      
      let results = [];
      
      switch (searchType) {
        case 'name':
          if (searchTerm.trim()) {
            results = await airportService.searchAirportsByName(searchTerm);
          }
          break;
        case 'city':
          if (searchTerm.trim()) {
            results = await airportService.searchAirportsByCity(searchTerm);
          }
          break;
        case 'iata':
          if (searchTerm.trim()) {
            results = await airportService.searchAirportsByIataCode(searchTerm);
          }
          break;
        case 'country':
          if (selectedCountry) {
            results = await airportService.getAirportsByCountry(selectedCountry);
          }
          break;
        case 'state':
          if (selectedState) {
            results = await airportService.getAirportsByState(selectedState);
          }
          break;
        default:
          break;
      }
      
      setAirports(results || []);
    } catch (err) {
      console.error('Failed to search airports:', err);
      setError(err.message || 'Failed to search airports');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Airport Search</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Search Airports</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search By
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="name">Airport Name</option>
                <option value="city">City</option>
                <option value="iata">IATA Code</option>
                <option value="country">Country</option>
                <option value="state">State/Province</option>
              </select>
            </div>
            
            {/* Search Input - Dynamic based on search type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {searchType === 'name' && 'Airport Name'}
                {searchType === 'city' && 'City'}
                {searchType === 'iata' && 'IATA Code'}
                {searchType === 'country' && 'Country'}
                {searchType === 'state' && 'State/Province'}
              </label>
              
              {/* Text input for name, city, IATA */}
              {(searchType === 'name' || searchType === 'city' || searchType === 'iata') && (
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    searchType === 'name' ? 'Enter airport name' :
                    searchType === 'city' ? 'Enter city name' :
                    'Enter IATA code'
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {/* Country dropdown */}
              {searchType === 'country' && (
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              )}
              
              {/* State dropdown */}
              {searchType === 'state' && (
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          {/* Search Button */}
          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={loading || 
                (searchType === 'name' && !searchTerm.trim()) ||
                (searchType === 'city' && !searchTerm.trim()) ||
                (searchType === 'iata' && !searchTerm.trim()) ||
                (searchType === 'country' && !selectedCountry) ||
                (searchType === 'state' && !selectedState)
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : 'Search Airports'}
            </button>
          </div>
        </div>
        
        {/* Results */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Search Results {airports.length > 0 && `(${airports.length} airports found)`}
            </h2>
          </div>
          
          {loading ? (
            <div className="px-6 py-12 text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Searching for airports...</p>
            </div>
          ) : airports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Airport
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Codes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {airports.map((airport) => (
                    <tr key={airport.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{airport.name}</div>
                        <div className="text-sm text-gray-500">{airport.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {countries.find(c => c.id === airport.countryId)?.name || 'N/A'}
                        </div>
                        {airport.stateId && (
                          <div className="text-sm text-gray-500">
                            {states.find(s => s.id === airport.stateId)?.name || 'N/A'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">IATA:</span> {airport.iataCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">ICAO:</span> {airport.icaoCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {airport.airportType}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {airport.timezone}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No airports found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchType === 'name' && 'Try searching for an airport by name'}
                {searchType === 'city' && 'Try searching for airports in a city'}
                {searchType === 'iata' && 'Try searching for an airport by IATA code'}
                {searchType === 'country' && 'Select a country to see its airports'}
                {searchType === 'state' && 'Select a state to see its airports'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirportSearch;