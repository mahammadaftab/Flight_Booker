import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { bookings as bookingService } from '../services/api';

const Confirmation = () => {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const passengerData = location.state?.passengerData;
  const flight = location.state?.flight;
  const selectedSeats = location.state?.selectedSeats || [];
  const totalPrice = location.state?.totalPrice || 0;
  const paymentMethod = location.state?.paymentMethod || 'credit';
  const paymentId = location.state?.paymentId || '';

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingId) {
        try {
          setLoading(true);
          setError('');
          
          // Fetch real booking details from the backend
          const bookingData = await bookingService.getBookingByPNR(bookingId);
          setBooking(bookingData);
        } catch (err) {
          console.error('Failed to load booking details:', err);
          setError(err.message || 'Failed to load booking details');
          // No fallback to mock data - show error instead
          setBooking(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
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
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Home
            </Link>
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
          <h1 className="text-2xl font-bold text-gray-900 text-center">Booking Confirmation</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-lg text-gray-600">
            Your flight has been successfully booked.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Booking Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Booking Summary</h3>
                    <p className="text-blue-100">Booking ID: {bookingId || 'N/A'}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-white text-blue-600">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="px-6 py-6 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Flight Information</h4>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-medium text-gray-900">
                          {flight?.airline || 'Sky Airlines'} - {flight?.flightNumber || 'SA123'}
                        </p>
                        <p className="text-gray-500">
                          {flight?.departure?.airport || 'New York (JFK)'} to {flight?.arrival?.airport || 'Los Angeles (LAX)'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(flight?.departure?.time || '2025-12-15T08:30:00')}
                    </p>
                    <p className="text-gray-500">
                      {formatTime(flight?.departure?.time || '2025-12-15T08:30:00')} - {
                        formatTime(flight?.arrival?.time || '2025-12-15T11:45:00')
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="px-6 py-6 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Passenger Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        {passengerData?.firstName || 'John'} {passengerData?.lastName || 'Doe'}
                      </p>
                      <p className="text-gray-500">{passengerData?.email || 'john.doe@example.com'}</p>
                      <p className="text-gray-500">Passport: {passengerData?.passportNumber || 'P12345678'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seat Information */}
              <div className="px-6 py-6 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Seat Selection</h4>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">
                      {selectedSeats.join(', ') || '12A, 12B'}
                    </p>
                    <p className="text-gray-500">Economy Class</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="px-6 py-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Base Fare</p>
                    <p className="text-gray-900">${totalPrice}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Taxes & Fees</p>
                    <p className="text-gray-900">${(totalPrice * 0.15).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <p className="text-lg font-medium text-gray-900">Total Paid</p>
                    <p className="text-lg font-bold text-gray-900">${(totalPrice * 1.15).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Payment Method</p>
                    <p className="text-gray-900 capitalize">{paymentMethod}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="text-gray-900">{paymentId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h4>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Ticket
                </button>
                
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Ticket
                </button>
                
                <Link
                  to="/"
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back to Home
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h5>
                <p className="text-sm text-gray-500">
                  If you have any questions about your booking, please contact our customer support.
                </p>
                <button className="mt-3 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Flights */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                airline: 'Ocean Airways', 
                flight: 'OA456', 
                route: 'Chicago to Miami', 
                time: 'Dec 20', 
                price: '$249' 
              },
              { 
                airline: 'Mountain Airlines', 
                flight: 'MA789', 
                route: 'Seattle to Denver', 
                time: 'Dec 22', 
                price: '$189' 
              },
              { 
                airline: 'Global Express', 
                flight: 'GE012', 
                route: 'Boston to San Francisco', 
                time: 'Dec 25', 
                price: '$329' 
              }
            ].map((flight, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{flight.airline}</h4>
                      <p className="text-gray-600">{flight.flight}</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{flight.price}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{flight.route}</p>
                  <p className="mt-1 text-sm text-gray-500">{flight.time}</p>
                  <button className="mt-4 w-full py-2 px-4 border border-blue-600 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;