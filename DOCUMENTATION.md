# Flight Management System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Core Features](#core-features)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Real-Time Features](#real-time-features)
11. [Payment Integration](#payment-integration)

## System Overview

The Flight Management System is a comprehensive airline booking platform built with modern technologies. It provides real-time flight search, seat selection, booking management, and payment processing capabilities.

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1
- MongoDB
- WebSocket for real-time communication
- JWT for authentication
- Maven for dependency management

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand for state management
- React Router for navigation

### Payment Gateways
- Stripe for credit/debit card payments
- Razorpay for Indian payment methods
- PayPal integration (placeholder)

## Architecture

The system follows a microservices-inspired architecture with a monolithic backend and modular frontend:

```
┌─────────────────┐    ┌──────────────────┐
│   Frontend      │    │   Backend        │
│   (React)       │◄──►│   (Spring Boot)  │
└─────────────────┘    └──────────────────┘
                              │
                       ┌──────▼──────┐
                       │  MongoDB    │
                       │  (Atlas)    │
                       └─────────────┘
```

## Core Features

### 1. Global Airport Coverage
Supports airports from all countries with detailed information including:
- IATA/ICAO codes
- Airport names and cities
- Countries and states
- Geolocation data
- Timezones

### 2. Real-time Flight Search
Advanced search functionality with:
- Origin/destination selection
- Date pickers
- Flexible date options
- Sorting (price, duration, departure time)
- Filtering options

### 3. Interactive Seat Selection
Real-time seat locking with:
- WebSocket updates
- Multiple cabin classes (Economy, Premium Economy, Business, First)
- Dynamic pricing
- Color-coded seat status
- Auto-unlock after timeout

### 4. Secure Authentication
JWT-based authentication with:
- User registration/login
- Role-based access control
- Password encryption
- Session management

### 5. Complete Booking Flow
End-to-end booking process:
- Flight selection
- Seat reservation
- Passenger information
- Payment processing
- Booking confirmation

### 6. Admin Panel
Comprehensive management interface:
- Flight management
- Airport management
- Booking oversight
- Reporting dashboard

## API Documentation

Detailed API documentation is available through Swagger UI at `/swagger-ui.html` when the backend is running.

### Authentication Endpoints
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Token refresh

### Airport Endpoints
- GET `/api/airports/countries` - Get all countries
- GET `/api/airports/states/{country}` - Get states for a country
- GET `/api/airports/search` - Search airports by various criteria

### Flight Endpoints
- GET `/api/flights/search` - Search flights
- GET `/api/flights/{id}` - Get flight details

### Booking Endpoints
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/{id}/confirm` - Confirm booking
- PUT `/api/bookings/{id}/cancel` - Cancel booking
- GET `/api/bookings/pnr/{pnr}` - Get booking by PNR
- GET `/api/bookings/user/{userId}` - Get user bookings

### Payment Endpoints
- POST `/api/payments` - Create payment
- POST `/api/payments/initiate` - Initiate payment with gateway
- PUT `/api/payments/{id}/confirm` - Confirm payment
- PUT `/api/payments/{id}/fail` - Mark payment as failed
- POST `/api/payments/{id}/refund` - Process refund
- POST `/api/payments/webhook/{paymentMethod}` - Handle webhooks
- GET `/api/payments/user/{userId}` - Get user payments

## Database Schema

### User
- id (ObjectId)
- name (String)
- email (String)
- password (String)
- roles (List<String>)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Country
- id (ObjectId)
- name (String)
- code (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### State
- id (ObjectId)
- name (String)
- countryCode (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Airport
- id (ObjectId)
- iataCode (String)
- icaoCode (String)
- name (String)
- city (String)
- country (String)
- state (String)
- latitude (Double)
- longitude (Double)
- timezone (String)
- airportType (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Aircraft
- id (ObjectId)
- aircraftNumber (String)
- airline (String)
- totalSeats (Integer)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Flight
- id (ObjectId)
- flightNumber (String)
- airline (String)
- originAirportId (ObjectId)
- destinationAirportId (ObjectId)
- departureTime (LocalDateTime)
- arrivalTime (LocalDateTime)
- duration (Long)
- aircraftId (ObjectId)
- price (Double)
- availableSeats (Integer)
- status (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Seat
- id (ObjectId)
- seatNumber (String)
- seatClass (String)
- basePrice (Double)
- currentPrice (Double)
- status (String)
- flightId (ObjectId)
- userId (ObjectId - when locked)
- lockedUntil (LocalDateTime - when locked)
- row (Integer)
- column (String)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Booking
- id (ObjectId)
- pnr (String)
- userId (ObjectId)
- flightId (ObjectId)
- seats (List<SeatReference>)
- passengers (List<Passenger>)
- totalPrice (Double)
- bookingStatus (String)
- paymentId (ObjectId)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

### Payment
- id (ObjectId)
- bookingId (ObjectId)
- userId (ObjectId)
- amount (Double)
- currency (String)
- paymentMethod (String)
- transactionId (String)
- paymentStatus (String)
- paymentDate (LocalDateTime)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

## Security

### Authentication
- JWT tokens with refresh mechanism
- BCrypt password hashing
- Role-based access control
- CORS configuration

### Data Protection
- HTTPS in production
- MongoDB Atlas encryption
- Input validation and sanitization
- Secure header configuration

### Payment Security
- PCI-DSS compliant processing
- Tokenization of sensitive data
- Webhook signature verification
- Encrypted storage of payment information

## Deployment

### Backend
1. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
2. Build the JAR:
   ```bash
   mvn clean package
   ```
3. Run the application:
   ```bash
   java -jar target/flight-management-system-0.0.1-SNAPSHOT.jar
   ```

### Frontend
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build for production:
   ```bash
   npm run build
   ```
3. Serve the build folder with your preferred web server

## Testing

### Backend Testing
Unit and integration tests are written using JUnit 5 and Mockito.

Run tests with:
```bash
mvn test
```

### Frontend Testing
Component tests are written using Jest and React Testing Library.

Run tests with:
```bash
npm test
```

### End-to-End Testing
Cypress is used for end-to-end testing.

Run tests with:
```bash
npm run cypress:open
```

## Real-Time Features

### Seat Selection

1. User selects a seat on the seat map
2. Frontend sends seat lock request to backend
3. Backend creates seat lock record with expiration time
4. WebSocket broadcasts seat lock to all connected clients
5. Other users see the seat as locked
6. If user doesn't complete booking within timeout, seat is automatically unlocked
7. Scheduled task runs every minute to clean up expired locks

### Flight Status Updates

1. Admin updates flight status in admin panel
2. Backend updates flight record
3. WebSocket broadcasts status update to all connected clients
4. Users see real-time flight status changes

## Payment Integration

### Supported Payment Gateways

1. **Stripe**
   - Global credit/debit card processing
   - Strong customer authentication (SCA) compliant
   - Webhook integration for real-time updates
   - Refund processing

2. **Razorpay**
   - Indian payment methods (UPI, wallets, net banking)
   - INR currency support
   - Payment link integration
   - Webhook processing

3. **PayPal**
   - International payment platform
   - Wide user base support
   - Redirect-based checkout

### Payment Flow

1. User completes booking form
2. System calculates total price
3. User selects payment method
4. System initiates payment with selected gateway
5. User completes payment through gateway interface
6. Payment gateway sends webhook to backend
7. Backend confirms payment and updates booking status
8. Confirmation email is sent to user

### Security Features

- PCI-DSS compliant payment processing
- Encrypted storage of payment data
- Webhook signature verification
- Tokenization of sensitive information
- Regular security audits

### Refund Processing

- Full and partial refund support
- Automated refund processing
- Refund status tracking
- Audit trail for compliance

### Webhook Handling

- Real-time payment notifications
- Signature verification for authenticity
- Duplicate request prevention
- Automatic status updates

For detailed implementation information, see:
- [Payment Integration Implementation](PAYMENT_INTEGRATION.md)
- [Payment Integration Guide](docs/PAYMENT_INTEGRATION_GUIDE.md)
- [Booking Flow with Payments](docs/BOOKING_FLOW_WITH_PAYMENTS.md)