#!/bin/bash

# Payment Integration Verification Script
# This script verifies that all critical components of the payment integration are in place

echo "=== Flight Management System - Payment Integration Verification ==="
echo ""

# Check backend payment service files
echo "Checking backend payment service files..."
if [ -d "backend/src/main/java/com/flight/service/payment" ]; then
    echo "✅ Payment service directory exists"
    
    # Check for required files
    REQUIRED_FILES=(
        "PaymentGatewayService.java"
        "StripePaymentService.java"
        "RazorpayPaymentService.java"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "backend/src/main/java/com/flight/service/payment/$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file is missing"
        fi
    done
else
    echo "❌ Payment service directory is missing"
fi

echo ""

# Check backend test files
echo "Checking backend test files..."
if [ -d "backend/src/test/java/com/flight/service/payment" ]; then
    echo "✅ Payment test directory exists"
    
    # Check for test files
    TEST_FILES=(
        "StripePaymentServiceTest.java"
        "RazorpayPaymentServiceTest.java"
    )
    
    for file in "${TEST_FILES[@]}"; do
        if [ -f "backend/src/test/java/com/flight/service/payment/$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file is missing"
        fi
    done
else
    echo "❌ Payment test directory is missing"
fi

echo ""

# Check frontend files
echo "Checking frontend payment files..."
if [ -f "frontend/src/pages/Payment.jsx" ]; then
    echo "✅ Payment.jsx exists"
else
    echo "❌ Payment.jsx is missing"
fi

if [ -f "frontend/src/services/api.js" ]; then
    echo "✅ api.js exists"
else
    echo "❌ api.js is missing"
fi

echo ""

# Check documentation files
echo "Checking documentation files..."
REQUIRED_DOCS=(
    "PAYMENT_INTEGRATION.md"
    "docs/PAYMENT_INTEGRATION_GUIDE.md"
    "docs/BOOKING_FLOW_WITH_PAYMENTS.md"
    "PAYMENT_INTEGRATION_SUMMARY.md"
    "FINAL_PAYMENT_INTEGRATION_REPORT.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc exists"
    else
        echo "❌ $doc is missing"
    fi
done

echo ""

# Check configuration files
echo "Checking configuration files..."
if [ -f "backend/src/main/resources/application.properties" ]; then
    # Check for Stripe configuration
    if grep -q "stripe.secret.key" "backend/src/main/resources/application.properties"; then
        echo "✅ Stripe configuration found"
    else
        echo "❌ Stripe configuration missing"
    fi
    
    # Check for Razorpay configuration
    if grep -q "razorpay.key.id" "backend/src/main/resources/application.properties"; then
        echo "✅ Razorpay configuration found"
    else
        echo "❌ Razorpay configuration missing"
    fi
else
    echo "❌ application.properties is missing"
fi

echo ""

# Check frontend dependencies
echo "Checking frontend dependencies..."
if [ -f "frontend/package.json" ]; then
    if grep -q "@stripe/stripe-js" "frontend/package.json"; then
        echo "✅ @stripe/stripe-js dependency found"
    else
        echo "❌ @stripe/stripe-js dependency missing"
    fi
else
    echo "❌ package.json is missing"
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "If all checks show ✅, the payment integration is properly implemented."
echo "Any ❌ indicates missing components that need to be addressed."