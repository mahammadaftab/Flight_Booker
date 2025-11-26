package com.flight.repository;

import com.flight.entity.Airport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepository extends MongoRepository<Airport, String> {
    List<Airport> findByCountryId(String countryId);
    List<Airport> findByStateId(String stateId);
    Optional<Airport> findByIataCode(String iataCode);
    List<Airport> findByNameContainingIgnoreCase(String name);
    List<Airport> findByCityContainingIgnoreCase(String city);
}