package com.flight.service;

import com.flight.entity.Payment;
import com.flight.repository.PaymentRepository;
import com.flight.service.payment.PaymentGatewayService;
import com.flight.service.payment.StripePaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private StripePaymentService stripePaymentService;
    

    
    public Payment createPayment(String bookingId, String userId, Double amount, String currency, 
                               String paymentMethod, String transactionId) {
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);
        payment.setPaymentStatus("Pending");
        payment.setPaymentDate(LocalDateTime.now());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        
        return paymentRepository.save(payment);
    }
    
    public Payment initiatePayment(String bookingId, String userId, Double amount, String currency, 
                                 String paymentMethod, String description, Map<String, Object> metadata) {
        PaymentGatewayService paymentGatewayService = getPaymentGatewayService(paymentMethod);
        
        // Initiate payment with the selected gateway
        Payment payment = paymentGatewayService.initiatePayment(amount, currency, description, metadata);
        
        // Set additional payment details
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        payment.setPaymentDate(LocalDateTime.now());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        
        return paymentRepository.save(payment);
    }
    
    public Payment confirmPayment(String paymentId, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment != null) {
            PaymentGatewayService paymentGatewayService = getPaymentGatewayService(payment.getPaymentMethod());
            
            // Verify payment with the gateway
            boolean isVerified = paymentGatewayService.verifyPayment(transactionId, payment);
            
            if (isVerified) {
                payment.setPaymentStatus("Success");
            } else {
                payment.setPaymentStatus("Failed");
            }
            
            // Update timestamps
            payment.setUpdatedAt(LocalDateTime.now());
            
            return paymentRepository.save(payment);
        }
        return null;
    }
    
    public Payment failPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment != null) {
            payment.setPaymentStatus("Failed");
            
            // Update timestamps
            payment.setUpdatedAt(LocalDateTime.now());
            
            return paymentRepository.save(payment);
        }
        return null;
    }
    
    public boolean refundPayment(String paymentId, Double amount) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment != null) {
            PaymentGatewayService paymentGatewayService = getPaymentGatewayService(payment.getPaymentMethod());
            
            // Refund payment with the gateway
            boolean isRefunded = paymentGatewayService.refundPayment(payment.getTransactionId(), amount);
            
            return isRefunded;
        }
        return false;
    }
    
    public Payment handleWebhook(String paymentMethod, String payload, String signature) {
        PaymentGatewayService paymentGatewayService = getPaymentGatewayService(paymentMethod);
        
        // Handle webhook notification
        Payment payment = paymentGatewayService.handleWebhook(payload, signature);
        
        if (payment != null) {
            // Save or update payment in database
            Payment existingPayment = paymentRepository.findByTransactionId(payment.getTransactionId());
            if (existingPayment != null) {
                existingPayment.setPaymentStatus(payment.getPaymentStatus());
                existingPayment.setUpdatedAt(LocalDateTime.now());
                return paymentRepository.save(existingPayment);
            } else {
                payment.setCreatedAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
                return paymentRepository.save(payment);
            }
        }
        return null;
    }
    
    public List<Payment> getPaymentsByUser(String userId) {
        return paymentRepository.findByUserId(userId);
    }
    
    public List<Payment> getPaymentsByBooking(String bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
    
    public List<Payment> getPaymentsByStatus(String paymentStatus) {
        return paymentRepository.findByPaymentStatus(paymentStatus);
    }
    
    private PaymentGatewayService getPaymentGatewayService(String paymentMethod) {
        switch (paymentMethod.toLowerCase()) {
            case "stripe":
                return stripePaymentService;

            default:
                throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
    }
}