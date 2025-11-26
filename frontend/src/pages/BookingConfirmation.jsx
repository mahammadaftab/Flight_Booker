import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  
  const [bookingStatus, setBookingStatus] = useState('processing');
  const [confirmationMessage, setConfirmationMessage] = useState('Processing your booking...');
  const [countdown, setCountdown] = useState(10);
  
  // Use the WebSocket hook
  const { 
    connected, 
    subscribeToBookingConfirmations,
    error: websocketError 
  } = useWebSocket();
  
  useEffect(() => {
    if (!bookingData) {
      navigate('/search-flights');
      return;
    }
    
    // Simulate booking processing
    const processingTimer = setTimeout(() => {
      setBookingStatus('confirmed');
      setConfirmationMessage('Your booking has been confirmed!');
    }, 3000);
    
    return () => clearTimeout(processingTimer);
  }, [bookingData, navigate]);
  
  useEffect(() => {
    if (!connected || !bookingData) return;
    
    // Subscribe to booking confirmations
    const subscription = subscribeToBookingConfirmations(bookingData.userId, (confirmation) => {
      console.log('Received booking confirmation:', confirmation);
      setBookingStatus('confirmed');
      setConfirmationMessage('Your booking has been confirmed!');
    });
    
    return () => {
      // Cleanup if needed
    };
  }, [connected, bookingData, subscribeToBookingConfirmations]);
  
  useEffect(() => {
    if (bookingStatus === 'confirmed') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/my-bookings');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [bookingStatus, navigate]);
  
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Invalid Request</h3>
          <p className="mt-1 text-gray-500">No booking data found.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/search-flights')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search Flights
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
          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmation</h1>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Status Indicator */}
          <div className={`p-6 text-center ${
            bookingStatus === 'processing' ? 'bg-yellow-50' : 
            bookingStatus === 'confirmed' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {bookingStatus === 'processing' && (
              <>
                <svg className="animate-spin h-12 w-12 text-yellow-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="mt-4 text-xl font-bold text-yellow-800">Processing Your Booking</h2>
                <p className="mt-2 text-yellow-700">{confirmationMessage}</p>
              </>
            )}
            
            {bookingStatus === 'confirmed' && (
              <>
                <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-4 text-xl font-bold text-green-800">Booking Confirmed!</h2>
                <p className="mt-2 text-green-700">{confirmationMessage}</p>
                <p className="mt-2 text-green-600">Redirecting to your bookings in {countdown} seconds...</p>
              </>
            )}
          </div>
          
          {/* Booking Details */}
          <div className="p-6">
            <div className="border-b border-gray-200 pb-5 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
              <p className="mt-1 text-sm text-gray-500">Booking reference: {bookingData.pnr}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Flight Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{bookingData.flight.airline}</p>
                      <p className="text-sm text-gray-500">{bookingData.flight.flightNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(bookingData.flight.departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(bookingData.flight.departure.time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="my-3 flex items-center">
                    <div className="flex-1 text-center">
                      <p className="text-sm font-medium text-gray-900">{bookingData.flight.departure.airport}</p>
                    </div>
                    <div className="flex-1 text-center">
                      <svg className="h-5 w-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-sm font-medium text-gray-900">{bookingData.flight.arrival.airport}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-sm font-medium text-gray-900">2h 15m</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(bookingData.flight.arrival.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Passenger Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {bookingData.passengers.map((passenger, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <p className="font-medium text-gray-900">{passenger.firstName} {passenger.lastName}</p>
                      <p className="text-sm text-gray-500">{passenger.email}</p>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-md font-medium text-gray-900 mt-6 mb-3">Selected Seats</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedSeats.map((seatId, index) => {
                      const seat = bookingData.flight.seats?.find(s => s.seatNumber === seatId);
                      return (
                        <div key={index} className="bg-blue-100 rounded-md px-3 py-1">
                          <span className="text-sm font-medium text-blue-800">Seat {seatId}</span>
                          {seat && (
                            <span className="text-xs text-blue-600 ml-1">({seat.seatClass})</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price</span>
                <span className="text-lg font-bold text-gray-900">${bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={() => navigate('/my-bookings')}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Bookings
            </button>
          </div>
        </div>
        
        {/* Real-time Updates Indicator */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-blue-800">
            {connected 
              ? 'Real-time updates enabled - You will receive instant notifications about your booking status' 
              : 'Connecting to real-time updates...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;