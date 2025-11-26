import React, { useState } from 'react';

const PassengerForm = ({ onSubmit, initialData = {} }) => {
  const [passengerData, setPassengerData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    passportNumber: initialData.passportNumber || '',
    dateOfBirth: initialData.dateOfBirth || '',
    nationality: initialData.nationality || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassengerData(prev => ({
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

  const validateForm = () => {
    const newErrors = {};

    if (!passengerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!passengerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!passengerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(passengerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!passengerData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!passengerData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    }

    if (!passengerData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!passengerData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(passengerData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={passengerData.firstName}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={passengerData.lastName}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={passengerData.email}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={passengerData.phone}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.phone ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Passport Number *
          </label>
          <input
            type="text"
            id="passportNumber"
            name="passportNumber"
            value={passengerData.passportNumber}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.passportNumber ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.passportNumber && <p className="mt-1 text-sm text-red-600">{errors.passportNumber}</p>}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={passengerData.dateOfBirth}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality *
          </label>
          <select
            id="nationality"
            name="nationality"
            value={passengerData.nationality}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.nationality ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          >
            <option value="">Select nationality</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
          </select>
          {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default PassengerForm;