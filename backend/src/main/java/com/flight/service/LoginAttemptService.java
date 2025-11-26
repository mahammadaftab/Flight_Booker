package com.flight.service;

import com.flight.entity.LoginAttempt;
import com.flight.repository.LoginAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LoginAttemptService {
    
    @Autowired
    private LoginAttemptRepository loginAttemptRepository;
    
    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_DURATION_MINUTES = 30;
    
    public void loginSucceeded(String ipAddress, String username) {
        // Reset attempts on successful login
        loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username)
                .ifPresent(loginAttemptRepository::delete);
    }
    
    public void loginFailed(String ipAddress, String username) {
        Optional<LoginAttempt> loginAttemptOpt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        LoginAttempt loginAttempt;
        
        if (loginAttemptOpt.isPresent()) {
            loginAttempt = loginAttemptOpt.get();
        } else {
            loginAttempt = new LoginAttempt();
            loginAttempt.setIpAddress(ipAddress);
            loginAttempt.setUsername(username);
        }
        
        loginAttempt.setAttempts(loginAttempt.getAttempts() + 1);
        loginAttempt.setLastAttempt(LocalDateTime.now());
        
        // Check if account should be blocked
        if (loginAttempt.getAttempts() >= MAX_ATTEMPTS) {
            loginAttempt.setBlocked(true);
            loginAttempt.setBlockExpiration(LocalDateTime.now().plusMinutes(BLOCK_DURATION_MINUTES));
        }
        
        loginAttemptRepository.save(loginAttempt);
    }
    
    public boolean isBlocked(String ipAddress, String username) {
        Optional<LoginAttempt> loginAttemptOpt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        
        if (loginAttemptOpt.isPresent()) {
            LoginAttempt loginAttempt = loginAttemptOpt.get();
            
            // Check if block has expired
            if (loginAttempt.isBlocked() && loginAttempt.getBlockExpiration().isBefore(LocalDateTime.now())) {
                // Unblock and reset attempts
                loginAttempt.setBlocked(false);
                loginAttempt.setAttempts(0);
                loginAttemptRepository.save(loginAttempt);
                return false;
            }
            
            return loginAttempt.isBlocked();
        }
        
        return false;
    }
    
    public int getRemainingAttempts(String ipAddress, String username) {
        Optional<LoginAttempt> loginAttemptOpt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        
        if (loginAttemptOpt.isPresent()) {
            LoginAttempt loginAttempt = loginAttemptOpt.get();
            return Math.max(0, MAX_ATTEMPTS - loginAttempt.getAttempts());
        }
        
        return MAX_ATTEMPTS;
    }
    
    public boolean isIpAddressBlocked(String ipAddress) {
        List<LoginAttempt> attempts = loginAttemptRepository.findByIpAddress(ipAddress);
        
        for (LoginAttempt attempt : attempts) {
            if (attempt.isBlocked() && attempt.getBlockExpiration().isAfter(LocalDateTime.now())) {
                return true;
            }
        }
        
        return false;
    }
}