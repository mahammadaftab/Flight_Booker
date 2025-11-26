package com.flight.controller;

import com.flight.entity.Payment;
import com.flight.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @RequestParam String bookingId,
            @RequestParam String userId,
            @RequestParam Double amount,
            @RequestParam String currency,
            @RequestParam String paymentMethod,
            @RequestParam String transactionId) {
        
        Payment payment = paymentService.createPayment(bookingId, userId, amount, currency, paymentMethod, transactionId);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/initiate")
    public ResponseEntity<Payment> initiatePayment(
            @RequestParam String bookingId,
            @RequestParam String userId,
            @RequestParam Double amount,
            @RequestParam String currency,
            @RequestParam String paymentMethod,
            @RequestParam String description,
            @RequestBody(required = false) Map<String, Object> metadata) {
        
        Payment payment = paymentService.initiatePayment(bookingId, userId, amount, currency, paymentMethod, description, metadata);
        return ResponseEntity.ok(payment);
    }
    
    @PutMapping("/{paymentId}/confirm")
    public ResponseEntity<Payment> confirmPayment(
            @PathVariable String paymentId,
            @RequestParam String transactionId) {
        
        Payment payment = paymentService.confirmPayment(paymentId, transactionId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{paymentId}/fail")
    public ResponseEntity<Payment> failPayment(@PathVariable String paymentId) {
        Payment payment = paymentService.failPayment(paymentId);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<Boolean> refundPayment(
            @PathVariable String paymentId,
            @RequestParam Double amount) {
        
        boolean isRefunded = paymentService.refundPayment(paymentId, amount);
        return ResponseEntity.ok(isRefunded);
    }
    
    @PostMapping("/webhook/{paymentMethod}")
    public ResponseEntity<Payment> handleWebhook(
            @PathVariable String paymentMethod,
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        
        Payment payment = paymentService.handleWebhook(paymentMethod, payload, signature);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable String bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }
    
    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable String paymentStatus) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(paymentStatus));
    }
}