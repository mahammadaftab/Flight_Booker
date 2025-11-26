package com.flight.repository;

import com.flight.entity.LoginAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoginAttemptRepository extends MongoRepository<LoginAttempt, String> {
    Optional<LoginAttempt> findByIpAddressAndUsername(String ipAddress, String username);
    List<LoginAttempt> findByIpAddress(String ipAddress);
    List<LoginAttempt> findByUsername(String username);
}