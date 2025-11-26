export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateCardNumber = (cardNumber) => {
  // Remove spaces and check if it's 16 digits
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
};

export const validateCVV = (cvv) => {
  // 3 or 4 digits
  return /^\d{3,4}$/.test(cvv);
};

export const validateExpiryDate = (expiryDate) => {
  // MM/YY format
  return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate);
};

export const validatePassportNumber = (passportNumber) => {
  // At least 6 characters
  return passportNumber.length >= 6;
};

export const validatePhone = (phone) => {
  // Basic phone validation (at least 10 digits)
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};