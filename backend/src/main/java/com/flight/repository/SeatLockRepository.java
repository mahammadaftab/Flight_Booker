package com.flight.repository;

import com.flight.entity.SeatLock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatLockRepository extends MongoRepository<SeatLock, String> {
    List<SeatLock> findByFlightIdAndSeatNumber(String flightId, String seatNumber);
    List<SeatLock> findByFlightId(String flightId);
    List<SeatLock> findByUserId(String userId);
    List<SeatLock> findByExpiresAtBefore(LocalDateTime expiryTime);
    Optional<SeatLock> findByFlightIdAndSeatNumberAndUserId(String flightId, String seatNumber, String userId);
}