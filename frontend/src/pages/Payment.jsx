import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { payments, bookings } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get data from location state or redirect if not available
  const { booking, flight, totalPrice, selectedSeats } = location.state || {};
  
  // Redirect if no booking data
  useEffect(() => {
    if (!booking || !flight || !totalPrice || !selectedSeats) {
      navigate('/dashboard');
    }
  }, [booking, flight, totalPrice, selectedSeats, navigate]);
  
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Stripe promise (initialize with your publishable key)
  const [stripePromise] = useState(() => loadStripe('pk_test_your_stripe_publishable_key'));
  
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateCardForm = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    if (!cardData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    if (!cardData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (validateCardForm()) {
      try {
        setProcessing(true);
        setPaymentError('');
        
        // Handle different payment methods
        if (paymentMethod === 'credit') {
          // For credit card payments, we'll use our backend to process with Stripe
          await handleCreditCardPayment();
        } else if (paymentMethod === 'paypal') {
          // For PayPal, we'll redirect to PayPal
          await handlePayPalPayment();

        }
      } catch (error) {
        console.error('Payment error:', error);
        setPaymentError(error.message || 'Payment failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    }
  };
  
  const handleCreditCardPayment = async () => {
    try {
      // Initiate payment with Stripe through our backend
      const payment = await payments.initiate(
        booking.id, // bookingId
        user.id, // userId
        totalPrice * 1.15, // amount (including taxes)
        'USD', // currency
        'Stripe', // paymentMethod
        `Flight Booking: ${flight.flightNumber}`, // description
        {
          customer_email: user.email,
          customer_name: user.name,
          flight_number: flight.flightNumber,
          booking_id: booking.id
        } // metadata
      );
      
      // In a real implementation, you would redirect to Stripe checkout
      // For this example, we'll simulate the payment confirmation
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Confirm the payment with the backend
      const confirmedPayment = await payments.confirmPayment(
        payment.id,
        payment.transactionId // In real implementation, this would come from Stripe
      );
      
      // Confirm the booking with the payment
      const confirmedBooking = await bookings.confirmBooking(
        booking.id,
        confirmedPayment.id
      );
      
      // Navigate to confirmation page with all booking data
      navigate('/confirmation', {
        state: {
          booking: confirmedBooking,
          flight,
          totalPrice,
          selectedSeats,
          paymentMethod: 'Credit Card'
        }
      });
    } catch (error) {
      throw new Error('Credit card payment failed: ' + error.message);
    }
  };
  
  const handlePayPalPayment = async () => {
    // For PayPal, we would typically redirect to PayPal checkout
    // This is a simplified implementation
    
    try {
      // Create a payment record in the backend
      const payment = await payments.create(
        booking.id, // bookingId
        user.id, // userId
        totalPrice * 1.15, // amount (including taxes)
        'USD', // currency
        'PayPal', // paymentMethod
        `txn_${Date.now()}` // transactionId (in real app, this would come from PayPal)
      );
      
      // Confirm the booking with the payment
      const confirmedBooking = await bookings.confirmBooking(
        booking.id,
        payment.id
      );
      
      // Navigate to confirmation page with all booking data
      navigate('/confirmation', {
        state: {
          booking: confirmedBooking,
          flight,
          totalPrice,
          selectedSeats,
          paymentMethod: 'PayPal'
        }
      });
    } catch (error) {
      throw new Error('PayPal payment failed: ' + error.message);
    }
  };
  

  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!booking || !flight || !totalPrice || !selectedSeats) {
    return null; // Will redirect in useEffect
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
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Payment</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {paymentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{paymentError}</p>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
              
              {/* Payment Method Selection */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`flex-1 py-3 px-4 rounded-md border ${
                    paymentMethod === 'credit' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                      paymentMethod === 'credit' ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'credit' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 py-3 px-4 rounded-md border ${
                    paymentMethod === 'paypal' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${
                      paymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'paypal' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="font-medium">PayPal</span>
                  </div>
                </button>
                

              </div>
              
              {/* Credit Card Option */}
              {paymentMethod === 'credit' && (
                <form onSubmit={handlePayment}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full rounded-md border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      />
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className={`w-full rounded-md border ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          className={`w-full rounded-md border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        />
                        {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="cardHolderName"
                        name="cardHolderName"
                        value={cardData.cardHolderName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={`w-full rounded-md border ${errors.cardHolderName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      />
                      {errors.cardHolderName && <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </>
                      ) : (
                        `Pay $${(totalPrice * 1.15).toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {/* PayPal Option */}
              {paymentMethod === 'paypal' && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-lg p-8 inline-block">
                    <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">Pay with PayPal</h3>
                    <p className="mt-2 text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                    <button
                      onClick={handlePayment}
                      disabled={processing}
                      className="mt-6 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : 'Continue to PayPal'}
                    </button>
                  </div>
                </div>
              )}
              

            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Flight Info */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{flight.airline}</h4>
                    <p className="text-gray-600">{flight.flightNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatTime(flight.departureTime)}</p>
                    <p className="text-gray-600">{flight.originAirportCode}</p>
                  </div>
                  <div className="mx-4">
                    <div className="flex items-center">
                      <div className="w-8 h-px bg-gray-300"></div>
                      <svg className="w-5 h-5 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatTime(flight.arrivalTime)}</p>
                    <p className="text-gray-600">{flight.destinationAirportCode}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600">
                    {new Date(flight.departureTime).toLocaleDateString()} • {selectedSeats.length} {selectedSeats.length === 1 ? 'Passenger' : 'Passengers'}
                  </p>
                  <p className="text-gray-500">Economy Class</p>
                </div>
              </div>
              
              {/* Seats Info */}
              <div className="border-b border-gray-200 py-6">
                <h4 className="font-medium text-gray-900 mb-2">Selected Seats</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900">${(totalPrice * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(totalPrice * 1.15).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;