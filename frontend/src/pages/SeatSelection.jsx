import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { flights as flightService } from '../services/api';
import webSocketService from '../services/websocket';
import useStore from '../store';
import useWebSocket from '../hooks/useWebSocket';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight || {
    id: 1,
    airline: 'Sky Airlines',
    flightNumber: 'SA123',
    departure: {
      airport: 'New York (JFK)',
      time: '2025-12-15T08:30:00'
    },
    arrival: {
      airport: 'Los Angeles (LAX)',
      time: '2025-12-15T11:45:00'
    }
  };

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState({}); // Track locked seats with expiration times
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [seatLockCountdowns, setSeatLockCountdowns] = useState({}); // Track countdowns for locked seats
  const seatLockTimers = useRef({}); // Store timeout IDs for seat lock expiration
  const countdownIntervals = useRef({}); // Store interval IDs for countdown updates

  // Use the WebSocket hook
  const { 
    connected: websocketConnectedHook, 
    subscribeToSeatUpdates, 
    subscribeToFlightPriceUpdates,
    error: websocketError 
  } = useWebSocket();

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Call the real API to get flight details which includes seat information
        const flightData = await flightService.getById(flight.id);
        
        // Transform the seat data to match our UI structure
        const transformedSeats = flightData.seats.map(seat => ({
          id: seat.seatNumber,
          type: seat.seatClass.toLowerCase().includes('first') ? 'first' :
                seat.seatClass.toLowerCase().includes('business') ? 'business' : 
                seat.seatClass.toLowerCase().includes('premium') ? 'premium' : 'economy',
          available: seat.status === 'Available',
          status: seat.status, // Keep original status for more accurate tracking
          price: seat.currentPrice || seat.basePrice,
          row: seat.row,
          column: seat.column
        }));
        
        setSeats(transformedSeats);
      } catch (err) {
        console.error('Failed to load seat data:', err);
        setError(err.message || 'Failed to load seat data');
        // No fallback to mock data - show error instead
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeatData();
  }, [flight.id]);

  // WebSocket connection effect
  useEffect(() => {
    if (!websocketConnectedHook) return;

    // Subscribe to seat updates for this flight
    const seatSubscription = subscribeToSeatUpdates(flight.id, (seatUpdate) => {
      console.log('Received seat update:', seatUpdate);
      // Update the seat in our local state
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === seatUpdate.seatNumber 
            ? { 
                ...seat, 
                status: seatUpdate.status,
                available: seatUpdate.status === 'Available'
              } 
            : seat
        )
      );
      
      // If a seat becomes available, clear any lock timer and countdown for it
      if (seatUpdate.status === 'Available') {
        if (seatLockTimers.current[seatUpdate.seatNumber]) {
          clearTimeout(seatLockTimers.current[seatUpdate.seatNumber]);
          delete seatLockTimers.current[seatUpdate.seatNumber];
        }
        if (countdownIntervals.current[seatUpdate.seatNumber]) {
          clearInterval(countdownIntervals.current[seatUpdate.seatNumber]);
          delete countdownIntervals.current[seatUpdate.seatNumber];
        }
        setSeatLockCountdowns(prev => {
          const newCountdowns = { ...prev };
          delete newCountdowns[seatUpdate.seatNumber];
          return newCountdowns;
        });
      }
    });

    // Subscribe to price updates for this flight
    const priceSubscription = subscribeToFlightPriceUpdates(flight.id, (flightUpdate) => {
      console.log('Received flight price update:', flightUpdate);
      // Update seat prices in our local state
      if (flightUpdate.seats) {
        setSeats(prevSeats => 
          prevSeats.map(seat => {
            const updatedSeat = flightUpdate.seats.find(s => s.seatNumber === seat.id);
            if (updatedSeat) {
              return {
                ...seat,
                price: updatedSeat.currentPrice || updatedSeat.basePrice
              };
            }
            return seat;
          })
        );
      }
    });

    // Cleanup function
    return () => {
      // Clear all seat lock timers and countdown intervals
      Object.values(seatLockTimers.current).forEach(timer => clearTimeout(timer));
      Object.values(countdownIntervals.current).forEach(interval => clearInterval(interval));
      seatLockTimers.current = {};
      countdownIntervals.current = {};
    };
  }, [flight.id, websocketConnectedHook, subscribeToSeatUpdates, subscribeToFlightPriceUpdates]);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const lockSeat = async (seatId) => {
    try {
      // Call the seat lock API
      const response = await flightService.lockSeat(flight.id, seatId);
      console.log('Seat lock response:', response);
      
      // Set a timer to automatically unlock the seat after 2 minutes (120 seconds)
      const lockDuration = 120; // 2 minutes in seconds
      const timerId = setTimeout(() => {
        unlockSeat(seatId);
      }, lockDuration * 1000);
      
      // Store the timer ID
      seatLockTimers.current[seatId] = timerId;
      
      // Start countdown interval
      setSeatLockCountdowns(prev => ({
        ...prev,
        [seatId]: lockDuration
      }));
      
      const intervalId = setInterval(() => {
        setSeatLockCountdowns(prev => {
          const currentSeconds = prev[seatId] || lockDuration;
          if (currentSeconds <= 1) {
            clearInterval(intervalId);
            return prev;
          }
          return {
            ...prev,
            [seatId]: currentSeconds - 1
          };
        });
      }, 1000);
      
      // Store the interval ID
      countdownIntervals.current[seatId] = intervalId;
      
      // Update local state to reflect the locked seat
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === seatId 
            ? { ...seat, status: 'Temporarily Locked', available: false } 
            : seat
        )
      );
      
      return true;
    } catch (err) {
      console.error('Failed to lock seat:', err);
      return false;
    }
  };

  const unlockSeat = async (seatId) => {
    try {
      // Call the seat unlock API
      const response = await flightService.unlockSeat(flight.id, seatId);
      console.log('Seat unlock response:', response);
      
      // Clear the timer and interval for this seat
      if (seatLockTimers.current[seatId]) {
        clearTimeout(seatLockTimers.current[seatId]);
        delete seatLockTimers.current[seatId];
      }
      if (countdownIntervals.current[seatId]) {
        clearInterval(countdownIntervals.current[seatId]);
        delete countdownIntervals.current[seatId];
      }
      
      // Remove countdown display
      setSeatLockCountdowns(prev => {
        const newCountdowns = { ...prev };
        delete newCountdowns[seatId];
        return newCountdowns;
      });
      
      // Update local state to reflect the unlocked seat
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === seatId 
            ? { ...seat, status: 'Available', available: true } 
            : seat
        )
      );
    } catch (err) {
      console.error('Failed to unlock seat:', err);
    }
  };

  const toggleSeat = async (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || !seat.available) return;

    if (selectedSeats.includes(seatId)) {
      // Deselect seat - unlock it
      await unlockSeat(seatId);
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Select seat - lock it
      const locked = await lockSeat(seatId);
      if (locked) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatClass = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return '';

    // Color mapping based on seat status and class
    switch (seat.status) {
      case 'Booked':
        return 'bg-gray-500 text-white cursor-not-allowed';
      case 'Temporarily Locked':
        return 'bg-red-500 text-white cursor-not-allowed animate-pulse';
      case 'Selected':
        // Different colors for selected seats based on class
        switch (seat.type) {
          case 'first':
            return 'bg-indigo-600 text-white';
          case 'business':
            return 'bg-yellow-600 text-white';
          case 'premium':
            return 'bg-purple-600 text-white';
          case 'economy':
            return 'bg-blue-600 text-white';
          default:
            return 'bg-blue-600 text-white';
        }
      default:
        // Available seats - different colors based on class
        switch (seat.type) {
          case 'first':
            return 'bg-indigo-200 hover:bg-indigo-300 text-gray-800';
          case 'business':
            return 'bg-yellow-200 hover:bg-yellow-300 text-gray-800';
          case 'premium':
            return 'bg-purple-200 hover:bg-purple-300 text-gray-800';
          case 'economy':
            return 'bg-blue-200 hover:bg-blue-300 text-gray-800';
          default:
            return 'bg-blue-200 hover:bg-blue-300 text-gray-800';
        }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigate('/booking', { 
        state: { 
          flight: flight,
          selectedSeats: selectedSeats,
          totalPrice: selectedSeats.reduce((total, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            return total + (seat ? seat.price : 0);
          }, 0)
        } 
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading seat map...</p>
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
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group seats by row and cabin class for better visualization
  const groupSeatsByCabinClass = () => {
    const grouped = {
      first: [],
      business: [],
      premium: [],
      economy: []
    };
    
    seats.forEach(seat => {
      switch (seat.type) {
        case 'first':
          grouped.first.push(seat);
          break;
        case 'business':
          grouped.business.push(seat);
          break;
        case 'premium':
          grouped.premium.push(seat);
          break;
        case 'economy':
          grouped.economy.push(seat);
          break;
        default:
          grouped.economy.push(seat);
      }
    });
    
    // Group each cabin class by row
    Object.keys(grouped).forEach(classType => {
      const rows = {};
      grouped[classType].forEach(seat => {
        if (!rows[seat.row]) {
          rows[seat.row] = [];
        }
        rows[seat.row].push(seat);
      });
      grouped[classType] = rows;
    });
    
    return grouped;
  };

  const renderCabinClassSection = (classType, title, bgColor) => {
    const groupedSeats = groupSeatsByCabinClass()[classType];
    const rowNumbers = Object.keys(groupedSeats).sort((a, b) => parseInt(a) - parseInt(b));
    
    if (rowNumbers.length === 0) return null;
    
    return (
      <div className={`mb-8 ${bgColor}`}>
        <div className="py-2 px-4 bg-gray-800 text-white font-bold rounded-t-lg">
          {title}
        </div>
        <div className="p-4">
          {rowNumbers.map(rowNumber => (
            <div key={rowNumber} className="flex items-center mb-2">
              <div className="w-8 text-center text-sm font-medium text-gray-500">{rowNumber}</div>
              <div className="flex gap-2">
                {groupedSeats[rowNumber]
                  .sort((a, b) => a.column.localeCompare(b.column))
                  .map(seat => (
                    <div key={seat.id} className="flex flex-col items-center">
                      <button
                        onClick={() => toggleSeat(seat.id)}
                        disabled={!seat.available || seat.status === 'Temporarily Locked'}
                        className={`w-12 h-12 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${getSeatClass(seat.id)} ${seat.available && seat.status !== 'Temporarily Locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        {seat.column}
                      </button>
                      <div className="text-xs text-gray-600 font-medium mt-1">
                        ${seat.price.toFixed(2)}
                      </div>
                      {seatLockCountdowns[seat.id] !== undefined && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          {formatCountdown(seatLockCountdowns[seat.id])}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Select Seats</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{flight.airline} - {flight.flightNumber}</h2>
                <p className="text-gray-600">
                  {flight.departure.airport} to {flight.arrival.airport} • {formatTime(flight.departure.time)}
                </p>
              </div>

              {/* Seat Legend */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Economy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Premium Economy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Business</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-indigo-200 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">First Class</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-600">Temporarily Locked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Selected (Economy)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Selected (Premium)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Selected (Business)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Selected (First)</span>
                </div>
              </div>

              {/* Live Price Indicator */}
              <div className="mb-4 p-3 bg-green-100 rounded-lg flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Live pricing - Prices update in real-time</span>
              </div>

              {/* Seat Grid - Organized by Cabin Class */}
              <div className="mt-6">
                {renderCabinClassSection('first', 'First Class', 'bg-indigo-50')}
                {renderCabinClassSection('business', 'Business Class', 'bg-yellow-50')}
                {renderCabinClassSection('premium', 'Premium Economy', 'bg-purple-50')}
                {renderCabinClassSection('economy', 'Economy Class', 'bg-blue-50')}
              </div>

              {/* Aircraft aisle */}
              <div className="my-6 h-1 bg-gray-300 rounded"></div>

              {/* Exit indicators */}
              <div className="flex justify-between mt-4">
                <div className="text-xs text-gray-500">Front</div>
                <div className="text-xs text-gray-500">Rear</div>
              </div>
            </div>
          </div>

          {/* Selected Seats Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Selection</h3>
              
              {selectedSeats.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {selectedSeats.map((seatId) => {
                      const seat = seats.find(s => s.id === seatId);
                      return (
                        <div key={seatId} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">Seat {seatId}</p>
                            <p className="text-sm text-gray-500 capitalize">{seat?.type} Class</p>
                            {seatLockCountdowns[seatId] !== undefined && (
                              <p className="text-xs text-red-600 font-medium">
                                Expires in: {formatCountdown(seatLockCountdowns[seatId])}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">${seat?.price?.toFixed(2)}</span>
                            <button 
                              onClick={() => toggleSeat(seatId)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${selectedSeats.reduce((total, seatId) => {
                          const seat = seats.find(s => s.id === seatId);
                          return total + (seat ? seat.price : 0);
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleContinue}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Continue to Booking
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h4 className="mt-4 text-lg font-medium text-gray-900">No seats selected</h4>
                  <p className="mt-1 text-gray-500">Choose seats from the diagram to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;