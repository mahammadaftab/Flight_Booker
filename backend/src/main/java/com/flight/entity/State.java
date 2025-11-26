package com.flight.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "states")
public class State extends BaseEntity {
    
    @Field("name")
    private String name;
    
    @Field("country_id")
    private String countryId;
    
    @Field("code")
    private String code; // State code
    
    public State() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    public State(String name, String countryId, String code) {
        this();
        this.name = name;
        this.countryId = countryId;
        this.code = code;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCountryId() {
        return countryId;
    }
    
    public void setCountryId(String countryId) {
        this.countryId = countryId;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
}