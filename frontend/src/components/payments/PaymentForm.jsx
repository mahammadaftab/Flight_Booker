import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, totalPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (validateCardForm()) {
      setProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setProcessing(false);
        onSubmit({ paymentMethod, cardData });
      }, 2000);
    }
  };

  return (
    <div>
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

      {/* Credit Card Form */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h4 className="mt-4 text-lg font-medium text-gray-900">Pay with PayPal</h4>
            <p className="mt-2 text-gray-500">You will be redirected to PayPal to complete your payment</p>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="mt-6 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Continue to PayPal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;