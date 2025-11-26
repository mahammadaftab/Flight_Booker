package com.flight.service.payment;

import com.flight.entity.Payment;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Refund;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.ChargeCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.Map;
import java.util.HashMap;

@Service
public class StripePaymentService implements PaymentGatewayService {
    
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    @Override
    public Payment initiatePayment(Double amount, String currency, String description, Map<String, Object> metadata) {
        try {
            // Convert amount to cents (Stripe uses smallest currency unit)
            long amountInCents = Math.round(amount * 100);
            
            ChargeCreateParams.Builder builder = ChargeCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency.toLowerCase())
                .setDescription(description);
            
            // Add metadata if provided
            if (metadata != null && !metadata.isEmpty()) {
                Map<String, String> stringMetadata = new HashMap<>();
                for (Map.Entry<String, Object> entry : metadata.entrySet()) {
                    stringMetadata.put(entry.getKey(), entry.getValue().toString());
                }
                builder.putAllMetadata(stringMetadata);
            }
            
            // For testing purposes, we're using a test token
            // In a real implementation, you would get this from the frontend
            builder.setSource("tok_visa"); // Test token
            
            Charge charge = Charge.create(builder.build());
            
            // Create payment entity
            Payment payment = new Payment();
            payment.setTransactionId(charge.getId());
            payment.setAmount(amount);
            payment.setCurrency(currency);
            payment.setPaymentMethod("Stripe");
            payment.setPaymentStatus("Pending");
            
            return payment;
        } catch (StripeException e) {
            throw new RuntimeException("Failed to initiate Stripe payment: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean verifyPayment(String paymentId, Payment payment) {
        try {
            Charge charge = Charge.retrieve(paymentId);
            
            if (charge.getPaid() && "succeeded".equals(charge.getStatus())) {
                payment.setPaymentStatus("Success");
                return true;
            } else {
                payment.setPaymentStatus("Failed");
                return false;
            }
        } catch (StripeException e) {
            payment.setPaymentStatus("Failed");
            throw new RuntimeException("Failed to verify Stripe payment: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean refundPayment(String paymentId, Double amount) {
        try {
            // Convert amount to cents
            long amountInCents = Math.round(amount * 100);
            
            RefundCreateParams params = RefundCreateParams.builder()
                .setCharge(paymentId)
                .setAmount(amountInCents)
                .build();
            
            Refund refund = Refund.create(params);
            
            return "succeeded".equals(refund.getStatus());
        } catch (StripeException e) {
            throw new RuntimeException("Failed to refund Stripe payment: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Payment handleWebhook(String payload, String signature) {
        try {
            // Verify webhook signature
            Event event = Webhook.constructEvent(payload, signature, stripeSecretKey);
            
            // Handle different event types
            switch (event.getType()) {
                case "charge.succeeded":
                    // Handle successful charge
                    Charge charge = (Charge) event.getDataObjectDeserializer().getObject().get();
                    Payment payment = new Payment();
                    payment.setTransactionId(charge.getId());
                    payment.setAmount((double) charge.getAmount() / 100); // Convert from cents
                    payment.setCurrency(charge.getCurrency());
                    payment.setPaymentMethod("Stripe");
                    payment.setPaymentStatus("Success");
                    return payment;
                    
                case "charge.failed":
                    // Handle failed charge
                    Charge failedCharge = (Charge) event.getDataObjectDeserializer().getObject().get();
                    Payment failedPayment = new Payment();
                    failedPayment.setTransactionId(failedCharge.getId());
                    failedPayment.setAmount((double) failedCharge.getAmount() / 100); // Convert from cents
                    failedPayment.setCurrency(failedCharge.getCurrency());
                    failedPayment.setPaymentMethod("Stripe");
                    failedPayment.setPaymentStatus("Failed");
                    return failedPayment;
                    
                default:
                    // Handle other events or ignore
                    return null;
            }
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Failed to verify Stripe webhook signature: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to handle Stripe webhook: " + e.getMessage(), e);
        }
    }
}