package com.flight.repository;

import com.flight.entity.Aircraft;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AircraftRepository extends MongoRepository<Aircraft, String> {
    Optional<Aircraft> findByName(String name);
    Optional<Aircraft> findByModel(String model);
}