package com.flight.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "countries")
public class Country extends BaseEntity {
    
    @Field("name")
    private String name;
    
    @Field("code")
    private String code; // ISO 3166-1 alpha-2 code
    
    public Country() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    public Country(String name, String code) {
        this();
        this.name = name;
        this.code = code;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
        
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
}