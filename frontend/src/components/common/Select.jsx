import React from 'react';

const Select = ({ 
  label, 
  id, 
  error, 
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`block w-full rounded-md border ${
            error ? 'border-red-300' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;