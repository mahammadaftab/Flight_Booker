package com.flight.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "login_attempts")
public class LoginAttempt extends BaseEntity {
    
    @Field("ip_address")
    private String ipAddress;
    
    @Field("username")
    private String username;
    
    @Field("attempts")
    private int attempts;
    
    @Field("last_attempt")
    private LocalDateTime lastAttempt;
    
    @Field("blocked")
    private boolean blocked;
    
    @Field("block_expiration")
    private LocalDateTime blockExpiration;
    
    public LoginAttempt() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
        this.attempts = 0;
        this.blocked = false;
    }
    
    // Getters and Setters
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public int getAttempts() {
        return attempts;
    }
    
    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }
    
    public LocalDateTime getLastAttempt() {
        return lastAttempt;
    }
    
    public void setLastAttempt(LocalDateTime lastAttempt) {
        this.lastAttempt = lastAttempt;
    }
    
    public boolean isBlocked() {
        return blocked;
    }
    
    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }
    
    public LocalDateTime getBlockExpiration() {
        return blockExpiration;
    }
    
    public void setBlockExpiration(LocalDateTime blockExpiration) {
        this.blockExpiration = blockExpiration;
    }
}