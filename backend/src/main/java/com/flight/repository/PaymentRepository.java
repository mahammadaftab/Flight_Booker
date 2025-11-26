package com.flight.repository;

import com.flight.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    List<Payment> findByBookingId(String bookingId);
    List<Payment> findByPaymentStatus(String paymentStatus);
    Payment findByTransactionId(String transactionId);
}