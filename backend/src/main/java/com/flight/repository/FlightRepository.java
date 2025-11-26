package com.flight.repository;

import com.flight.entity.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends MongoRepository<Flight, String> {
    List<Flight> findByOriginAirportIdAndDestinationAirportIdAndDepartureTimeBetween(
            String originAirportId, String destinationAirportId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<Flight> findByOriginAirportIdAndDestinationAirportId(
            String originAirportId, String destinationAirportId);
            
    List<Flight> findByAirlineContainingIgnoreCase(String airline);
    
    List<Flight> findByStatus(String status);
}