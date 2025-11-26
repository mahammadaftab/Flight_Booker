# Payment Integration Guide

This guide explains how to set up and use the payment integration features in the Flight Management System.

## Table of Contents

1. [Overview](#overview)
2. [Supported Payment Gateways](#supported-payment-gateways)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [API Endpoints](#api-endpoints)
7. [Frontend Integration](#frontend-integration)
8. [Webhook Handling](#webhook-handling)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

## Overview

The Flight Management System supports multiple payment gateways to provide flexibility for users worldwide. The current implementation includes:

- Stripe for credit/debit card payments (global)
- Razorpay for Indian users
- PayPal integration (placeholder)

All payment data is securely stored in MongoDB with appropriate encryption and compliance measures.

## Supported Payment Gateways

### Stripe
- Global payment processor
- Supports all major credit/debit cards
- Strong customer authentication (SCA) compliant
- Recurring payments support

### Razorpay
- Indian payment gateway
- Supports UPI, wallets, net banking
- INR currency support
- Easy integration for Indian customers

### PayPal
- International payment platform
- Wide user base
- Multiple funding sources

## Setup Instructions

### Prerequisites

1. Java 17 or higher
2. Maven 3.8+
3. MongoDB instance
4. Payment gateway accounts (Stripe, Razorpay)

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory
3. Update `application.properties` with your credentials
4. Build the project:
   ```bash
   mvn clean install
   ```
5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

### Application Properties

Update the following properties in `src/main/resources/application.properties`:

```properties
# Stripe Configuration
stripe.secret.key=sk_test_your_stripe_secret_key

# Razorpay Configuration
razorpay.key.id=rzp_test_your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret
```

For production, use environment variables:

```properties
# Stripe Configuration
stripe.secret.key=${STRIPE_SECRET_KEY}

# Razorpay Configuration
razorpay.key.id=${RAZORPAY_KEY_ID}
razorpay.key.secret=${RAZORPAY_KEY_SECRET}
```

### Environment Variables

Set the following environment variables for production:

```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
RAZORPAY_KEY_ID=rzp_live_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Testing

### Stripe Testing

Use the following test card details:

- Card Number: 4242 4242 4242 4242
- Expiration: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Razorpay Testing

Refer to the [Razorpay test cards documentation](https://razorpay.com/docs/payments/payments/test-card-upi-details/) for test card details.

### Running Tests

Run backend tests with Maven:

```bash
mvn test
```

## API Endpoints

### Initiate Payment

```
POST /api/payments/initiate
```

Parameters:
- bookingId (string)
- userId (string)
- amount (double)
- currency (string)
- paymentMethod (string: "Stripe", "Razorpay", "PayPal")
- description (string)

Body (optional):
- metadata (JSON object)

Response:
```json
{
  "id": "payment_123",
  "bookingId": "booking_123",
  "userId": "user_123",
  "amount": 100.0,
  "currency": "USD",
  "paymentMethod": "Stripe",
  "transactionId": "ch_123",
  "paymentStatus": "Pending",
  "paymentDate": "2023-01-01T00:00:00",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00"
}
```

### Confirm Payment

```
PUT /api/payments/{paymentId}/confirm
```

Parameters:
- transactionId (string)

Response:
```json
{
  "id": "payment_123",
  "bookingId": "booking_123",
  "userId": "user_123",
  "amount": 100.0,
  "currency": "USD",
  "paymentMethod": "Stripe",
  "transactionId": "ch_123",
  "paymentStatus": "Success",
  "paymentDate": "2023-01-01T00:00:00",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00"
}
```

### Fail Payment

```
PUT /api/payments/{paymentId}/fail
```

Response:
```json
{
  "id": "payment_123",
  "bookingId": "booking_123",
  "userId": "user_123",
  "amount": 100.0,
  "currency": "USD",
  "paymentMethod": "Stripe",
  "transactionId": "ch_123",
  "paymentStatus": "Failed",
  "paymentDate": "2023-01-01T00:00:00",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00"
}
```

### Refund Payment

```
POST /api/payments/{paymentId}/refund
```

Parameters:
- amount (double)

Response:
```json
true
```

### Webhook Handling

```
POST /api/payments/webhook/{paymentMethod}
```

Headers:
- Stripe-Signature (for Stripe webhooks)

Body:
- Webhook payload from the payment gateway

Response:
```json
{
  "id": "payment_123",
  "bookingId": "booking_123",
  "userId": "user_123",
  "amount": 100.0,
  "currency": "USD",
  "paymentMethod": "Stripe",
  "transactionId": "ch_123",
  "paymentStatus": "Success",
  "paymentDate": "2023-01-01T00:00:00",
  "createdAt": "2023-01-01T00:00:00",
  "updatedAt": "2023-01-01T00:00:00"
}
```

## Frontend Integration

### Payment Component

The frontend includes a comprehensive payment component that supports all payment methods:

```jsx
import { payments } from '../services/api';

// Initiate a payment
const payment = await payments.initiate(
  bookingId,
  userId,
  amount,
  currency,
  paymentMethod,
  description,
  metadata
);

// Confirm a payment
const confirmedPayment = await payments.confirmPayment(
  paymentId,
  transactionId
);

// Process a refund
const isRefunded = await payments.refundPayment(
  paymentId,
  amount
);
```

### Stripe Integration

The frontend uses Stripe.js for secure card tokenization:

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');
```

### Razorpay Integration

Razorpay integration uses their checkout.js library:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## Webhook Handling

### Stripe Webhooks

1. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/payments/webhook/Stripe`
   - Events: `charge.succeeded`, `charge.failed`

2. Verify webhook signatures:
   ```java
   Event event = Webhook.constructEvent(payload, signature, stripeSecretKey);
   ```

### Razorpay Webhooks

1. Configure webhook endpoint in Razorpay Dashboard:
   - URL: `https://yourdomain.com/api/payments/webhook/Razorpay`
   - Events: `payment_link.paid`, `payment_link.cancelled`

2. Verify webhook signatures using Razorpay's utility methods.

## Security Considerations

### API Keys

Never expose secret keys in frontend code. Always use environment variables for production.

### Webhook Verification

Always verify webhook signatures to prevent unauthorized requests.

### PCI Compliance

Use Stripe Elements or similar for card input to maintain PCI-DSS compliance.

### Data Encryption

All payment data is encrypted at rest in MongoDB.

## Troubleshooting

### Common Issues

1. **Payment initiation fails**
   - Check API keys
   - Verify network connectivity
   - Ensure correct currency codes

2. **Webhook verification fails**
   - Check webhook signatures
   - Verify endpoint URLs
   - Check for proxy/SSL issues

3. **Refund processing fails**
   - Verify payment status
   - Check refund eligibility
   - Ensure sufficient funds

### Logs

Check application logs for detailed error information:

```bash
tail -f logs/application.log
```

### Debugging

Enable debug logging in `application.properties`:

```properties
logging.level.com.flight.service.payment=DEBUG
```

## Support

For issues with the payment integration, contact:

- Stripe Support: https://support.stripe.com/
- Razorpay Support: https://razorpay.com/support/

For issues with the Flight Management System, please open an issue on GitHub.