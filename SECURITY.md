# Flight Management System - Security Implementation

## Overview

This document describes the enterprise-level security features implemented in the Flight Management System. The system implements robust authentication, authorization, and protection mechanisms to ensure data security and user privacy.

## Authentication Features

### JWT Access + Refresh Tokens

1. **Access Tokens**
   - Short-lived tokens (default: 7 days)
   - Used for API authentication
   - Automatically validated by JwtAuthenticationFilter

2. **Refresh Tokens**
   - Long-lived tokens (default: 7 days)
   - Used to obtain new access tokens without re-authentication
   - Stored in database with expiration dates
   - Automatically cleaned up on successful login

3. **Token Management**
   - Automatic token generation on login
   - Token refresh endpoint for seamless user experience
   - Secure logout that invalidates refresh tokens

### Password Security

1. **BCrypt Hashing**
   - Industry-standard password hashing algorithm
   - Configurable cost factor for security/performance balance
   - Salt generation for each password to prevent rainbow table attacks

2. **Password Policies**
   - Minimum length requirements
   - Complexity validation
   - Secure storage only (no plain text passwords)

## Authorization Features

### Role-Based Access Control (RBAC)

1. **User Roles**
   - **USER**: Standard users with access to booking features
   - **ADMIN**: Administrative users with access to management features

2. **Role Annotations**
   - `@AdminOnly`: Restricts access to admin users only
   - `@UserAccess`: Allows access to both users and admins

3. **Method-Level Security**
   - Fine-grained access control using Spring Security annotations
   - Pre-authorization checks for sensitive operations

### Protected API Endpoints

1. **Public Endpoints**
   - `/api/auth/login`: User authentication
   - `/api/auth/signup`: User registration
   - `/api/auth/refresh`: Token refresh
   - `/api/auth/logout`: User logout

2. **Protected Endpoints**
   - All other API endpoints require valid JWT token
   - Role-specific access control for administrative functions

## Account Protection Features

### Rate Limiting

1. **Login Attempt Tracking**
   - Tracks failed login attempts by IP address and username
   - Stores attempt history in MongoDB collection

2. **Account Blocking**
   - Blocks accounts after 5 failed attempts
   - 30-minute block duration
   - Automatic unblocking after block period expires

3. **IP-Based Throttling**
   - Prevents brute force attacks from single IP addresses
   - Blocks entire IP if multiple accounts are targeted

### Brute Force Detection

1. **Attempt Monitoring**
   - Real-time tracking of login attempts
   - Pattern recognition for suspicious activity

2. **Adaptive Blocking**
   - Increases block duration for repeat offenders
   - Permanent blocking for severe violations (configurable)

## Security Hardening

### CSRF Protection

1. **Stateless API Design**
   - RESTful API with JWT tokens eliminates CSRF vulnerabilities
   - No session cookies used for authentication

2. **Double Submit Cookie Pattern**
   - Optional implementation for additional CSRF protection

### XSS Protection

1. **Input Sanitization**
   - Server-side filtering of malicious scripts
   - Removal of dangerous HTML tags and attributes

2. **Output Encoding**
   - Contextual encoding for HTML, JavaScript, and CSS output
   - Safe rendering of user-generated content

### CORS Hardening

1. **Origin Validation**
   - Strict origin checking for cross-origin requests
   - Configurable allowed origins for development/production

2. **Header Security**
   - Proper CORS headers to prevent unauthorized access
   - Credential handling for trusted origins only

## Backend Input Validation

### Data Validation

1. **Bean Validation**
   - JSR-380 annotations for request DTO validation
   - Custom validation constraints for business rules

2. **Sanitization**
   - Input cleaning to remove malicious content
   - Type-safe data binding to prevent injection attacks

### API Security

1. **Request Validation**
   - Schema validation for all API endpoints
   - Parameter validation to prevent malformed requests

2. **Response Security**
   - Sensitive data filtering in API responses
   - Error message sanitization to prevent information leakage

## Security Best Practices Implemented

### Secure Coding Practices

1. **Principle of Least Privilege**
   - Minimal permissions for database access
   - Role-based access to system resources

2. **Defense in Depth**
   - Multiple layers of security controls
   - Redundant protection mechanisms

3. **Secure Defaults**
   - Security-enabled by default
   - Fail-safe security configurations

### Monitoring and Logging

1. **Security Event Logging**
   - Login attempts and outcomes
   - Access violations and blocked requests
   - Administrative actions

2. **Audit Trails**
   - User activity tracking
   - System configuration changes
   - Security incident recording

## Configuration

### Environment Variables

1. **JWT Configuration**
   - `app.jwt-secret`: Secret key for token signing
   - `app.jwt-expiration-milliseconds`: Access token expiration
   - `app.jwt-refresh-expiration-milliseconds`: Refresh token expiration

2. **Security Settings**
   - Rate limiting thresholds
   - Block duration settings
   - Password policy requirements

### Security Headers

1. **HTTP Security Headers**
   - Content Security Policy (CSP)
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Strict-Transport-Security (HSTS)

## Testing and Validation

### Security Testing

1. **Penetration Testing**
   - Regular security assessments
   - Vulnerability scanning
   - Code review for security issues

2. **Compliance Validation**
   - OWASP Top 10 compliance
   - Industry standard security practices
   - Regular security updates

## Future Enhancements

### Advanced Security Features

1. **Multi-Factor Authentication (MFA)**
   - TOTP-based two-factor authentication
   - SMS/email verification codes
   - Hardware security keys support

2. **Session Management**
   - Concurrent session control
   - Session timeout enforcement
   - Device fingerprinting

3. **Advanced Threat Protection**
   - Machine learning-based anomaly detection
   - Behavioral analysis for fraud prevention
   - Real-time threat intelligence integration

This security implementation provides a robust foundation for protecting the Flight Management System against common security threats while maintaining usability and performance.