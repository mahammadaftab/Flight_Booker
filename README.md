# Flight Management System ✈️

A comprehensive Flight Booking Platform with Real-Time Features built using cutting-edge technologies.

## 🌟 Key Features

### 🌍 1. Global Airport Coverage
Supports airports from all countries with detailed information:
- IATA/ICAO codes
- Airport names and cities
- Countries and states
- Geolocation data
- Timezones

### 🔍 2. Real-time Flight Search
Advanced search functionality with:
- Origin/destination selection
- Date pickers with flexible options
- Sorting (price, duration, departure time)
- Filtering options

### 💺 3. Interactive Seat Selection
Real-time seat locking with:
- WebSocket updates
- Multiple cabin classes (Economy, Premium Economy, Business, First)
- Dynamic pricing
- Color-coded seat status
- Auto-unlock after timeout (2 minutes)

### 🔐 4. Secure Authentication
JWT-based authentication with:
- User registration/login
- Role-based access control (User/Admin)
- Password encryption with BCrypt
- Session management

### 🧾 5. Complete Booking Flow
End-to-end booking process:
- Flight selection
- Seat reservation with real-time locking
- Passenger information collection
- Payment processing
- Booking confirmation with PNR

### 💳 6. Payment Integration
Secure payment processing with:
- Stripe for credit/debit card payments
- Razorpay for Indian payment methods
- PayPal integration (placeholder)
- Webhook handling for real-time updates
- Refund processing

### 🛠 7. Admin Panel
Comprehensive management interface:
- Flight management
- Airport management
- Booking oversight
- Reporting dashboard

### ⚡ 8. Real-time Features
WebSocket-powered live updates:
- Seat availability
- Flight status changes
- Booking notifications

## 🏗 Technology Stack

### Frontend (React + Vite + Tailwind)
- Fully responsive design
- Modular component structure
- Country → State → Airport cascading dropdown
- Airline UI design similar to MakeMyTrip, Skyscanner, Kayak
- Real-time seat selection
- Payment UI
- Booking confirmation page
- State management (Zustand)
- Reusable hooks & components

### Backend (Java Spring Boot)
- RESTful API architecture
- MongoDB for data persistence
- WebSocket for real-time communication
- JWT for secure authentication
- Spring Security for authorization
- Lombok for boilerplate reduction
- Maven for dependency management

### Payment Gateways
- Stripe for global credit/debit card payments
- Razorpay for Indian payment methods
- Secure webhook integration
- PCI-DSS compliant processing

## 📁 Project Structure

```
Flight Management System/
├── backend/                 # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flight/
│   │   │   │   ├── config/      # Configuration classes
│   │   │   │   ├── controller/  # REST controllers
│   │   │   │   ├── dto/         # Data Transfer Objects
│   │   │   │   ├── entity/      # JPA entities
│   │   │   │   ├── exception/   # Custom exceptions
│   │   │   │   ├── repository/  # Spring Data repositories
│   │   │   │   ├── security/    # Security configuration
│   │   │   │   ├── service/     # Business logic
│   │   │   │   ├── util/        # Utility classes
│   │   │   │   └── websocket/   # WebSocket configuration
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql     # Initial data
│   │   └── test/                # Unit and integration tests
├── frontend/                # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/                    # Documentation files
├── ARCHITECTURE.md          # System architecture documentation
├── DOCUMENTATION.md         # Technical documentation
├── PAYMENT_INTEGRATION.md   # Payment integration implementation details
├── README.md                # This file
├── SECURITY.md              # Security documentation
└── SUMMARY.md               # Project summary
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MongoDB
- Maven 3.8+
- npm 8+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies and build:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Payment Gateway Configuration
To enable payment processing, configure the following environment variables:

#### Stripe
- Sign up at [Stripe](https://stripe.com) and get your API keys
- Set `STRIPE_SECRET_KEY` in `backend/src/main/resources/application.properties`

#### Razorpay
- Sign up at [Razorpay](https://razorpay.com) and get your API keys
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/src/main/resources/application.properties`

## 🧪 Testing

### Backend Testing
Run unit and integration tests:
```bash
cd backend
mvn test
```

### Frontend Testing
Run component tests:
```bash
cd frontend
npm test
```

## 🔐 Security

The application implements industry-standard security practices:
- JWT-based authentication
- BCrypt password hashing
- Role-based access control
- Input validation and sanitization
- Secure HTTP headers
- CORS configuration
- PCI-DSS compliant payment processing

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview
- [DOCUMENTATION.md](DOCUMENTATION.md) - Comprehensive technical documentation
- [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) - Payment integration details
- [docs/PAYMENT_INTEGRATION_GUIDE.md](docs/PAYMENT_INTEGRATION_GUIDE.md) - Payment setup guide
- [docs/BOOKING_FLOW_WITH_PAYMENTS.md](docs/BOOKING_FLOW_WITH_PAYMENTS.md) - Booking flow with payments

## 🛠 API Documentation

When the backend is running, visit `http://localhost:8080/swagger-ui.html` for interactive API documentation.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and feature requests, please open an issue on GitHub.