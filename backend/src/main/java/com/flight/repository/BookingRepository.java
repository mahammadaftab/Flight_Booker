package com.flight.repository;

import com.flight.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findByFlightId(String flightId);
    List<Booking> findByBookingStatus(String bookingStatus);
}