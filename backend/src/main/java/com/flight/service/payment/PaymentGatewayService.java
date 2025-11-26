package com.flight.service.payment;

import com.flight.entity.Payment;

import java.util.Map;

/**
 * Base interface for payment gateway services
 */
public interface PaymentGatewayService {
    
    /**
     * Initiate a payment with the payment gateway
     * @param amount The amount to charge
     * @param currency The currency code (e.g., USD, INR)
     * @param description Description of the payment
     * @param metadata Additional metadata for the payment
     * @return Payment object with gateway-specific details
     */
    Payment initiatePayment(Double amount, String currency, String description, Map<String, Object> metadata);
    
    /**
     * Verify a payment with the payment gateway
     * @param paymentId The payment ID from the gateway
     * @param payment The payment entity to verify
     * @return True if payment is successful, false otherwise
     */
    boolean verifyPayment(String paymentId, Payment payment);
    
    /**
     * Refund a payment
     * @param paymentId The payment ID from the gateway
     * @param amount The amount to refund
     * @return True if refund is successful, false otherwise
     */
    boolean refundPayment(String paymentId, Double amount);
    
    /**
     * Handle webhook notifications from the payment gateway
     * @param payload The webhook payload
     * @param signature The webhook signature for verification
     * @return Processed payment entity
     */
    Payment handleWebhook(String payload, String signature);
}