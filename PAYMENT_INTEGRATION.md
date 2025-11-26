# Payment Integration Implementation

This document outlines the implementation of payment integration with Stripe and Razorpay for the Flight Management System.

## Features Implemented

1. **Multiple Payment Gateways Support**
   - Stripe integration for credit/debit card payments
   - Razorpay integration for Indian users
   - PayPal option (placeholder for future implementation)

2. **Backend Services**
   - Payment gateway service interfaces
   - Stripe payment service implementation
   - Razorpay payment service implementation
   - Enhanced PaymentService with gateway integration
   - Webhook handlers for payment notifications
   - Refund functionality

3. **Frontend Integration**
   - Updated payment page with multiple payment options
   - Stripe.js integration for secure card tokenization
   - Razorpay checkout integration
   - PayPal redirect flow

4. **Security Features**
   - Secure webhook signature verification
   - PCI-DSS compliant payment processing
   - Encrypted storage of payment data

## Backend Implementation

### Dependencies Added

```xml
<!-- Stripe Payment Gateway -->
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>22.3.0</version>
</dependency>

<!-- Razorpay Payment Gateway -->
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

### Configuration

Added to `application.properties`:

```properties
# Stripe Configuration
stripe.secret.key=sk_test_your_stripe_secret_key

# Razorpay Configuration
razorpay.key.id=rzp_test_your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret
```

### Service Layer

1. **PaymentGatewayService Interface**
   - Defines common methods for all payment gateways
   - Methods: initiatePayment, verifyPayment, refundPayment, handleWebhook

2. **StripePaymentService**
   - Implements Stripe-specific payment processing
   - Handles charge creation, verification, and refunds
   - Processes webhook notifications

3. **RazorpayPaymentService**
   - Implements Razorpay-specific payment processing
   - Handles payment link creation and verification
   - Processes webhook notifications

4. **Enhanced PaymentService**
   - Integrates with payment gateway services
   - Manages payment lifecycle (initiation, confirmation, failure, refund)
   - Handles webhook processing and persistence

### Controller Layer

Updated PaymentController with new endpoints:
- `POST /api/payments/initiate` - Initiate a payment with a gateway
- `POST /api/payments/{paymentId}/refund` - Process a refund
- `POST /api/payments/webhook/{paymentMethod}` - Handle webhook notifications

## Frontend Implementation

### Dependencies Added

```json
"@stripe/stripe-js": "^2.1.0"
```

### Payment Page

The payment page now supports three payment methods:
1. **Credit/Debit Card** - Processed through Stripe
2. **PayPal** - Redirect-based payment (placeholder)
3. **Razorpay** - Indian payment gateway integration

### API Service

Updated payment service with new methods:
- `initiate()` - Initiate a payment with a gateway
- `refundPayment()` - Process a refund

## Webhook Handling

Both Stripe and Razorpay webhooks are implemented:
- Secure signature verification
- Automatic payment status updates
- Database synchronization

## Refund Processing

Refund functionality is available for both payment gateways:
- Partial and full refunds supported
- Status tracking and history

## Testing

To test the payment integration:

1. **Stripe Testing**
   - Use test card number: 4242 4242 4242 4242
   - Any future expiration date
   - Any 3-digit CVC

2. **Razorpay Testing**
   - Use test card details provided by Razorpay
   - Follow their sandbox testing guidelines

## Security Considerations

1. **API Keys**
   - Never expose secret keys in frontend code
   - Use environment variables for production

2. **Webhook Verification**
   - Always verify webhook signatures
   - Use appropriate secret keys for verification

3. **PCI Compliance**
   - Use Stripe Elements or similar for card input
   - Never store card details directly

## Future Enhancements

1. **PayPal Integration**
   - Implement full PayPal checkout flow

2. **Additional Gateways**
   - Add support for more regional payment gateways

3. **Advanced Features**
   - Subscription billing
   - Recurring payments
   - Multi-currency support

## API Endpoints

### Payment Initiation
```
POST /api/payments/initiate
Parameters:
- bookingId
- userId
- amount
- currency
- paymentMethod
- description
Body (optional):
- metadata
```

### Payment Confirmation
```
PUT /api/payments/{paymentId}/confirm
Parameters:
- transactionId
```

### Payment Failure
```
PUT /api/payments/{paymentId}/fail
```

### Refund Processing
```
POST /api/payments/{paymentId}/refund
Parameters:
- amount
```

### Webhook Handling
```
POST /api/payments/webhook/{paymentMethod}
Headers:
- Stripe-Signature (for Stripe)
Body:
- Webhook payload
```

## Error Handling

The implementation includes comprehensive error handling for:
- Network failures
- Payment gateway errors
- Validation failures
- Authentication issues
- Database errors

All errors are logged appropriately and user-friendly error messages are displayed.