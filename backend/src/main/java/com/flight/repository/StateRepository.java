package com.flight.repository;

import com.flight.entity.State;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StateRepository extends MongoRepository<State, String> {
    List<State> findByCountryId(String countryId);
    Optional<State> findByCodeAndCountryId(String code, String countryId);
}