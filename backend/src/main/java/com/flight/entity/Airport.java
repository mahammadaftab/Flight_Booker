package com.flight.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "airports")
public class Airport extends BaseEntity {
    
    @Field("iata_code")
    private String iataCode;
    
    @Field("icao_code")
    private String icaoCode;
    
    @Field("name")
    private String name;
    
    @Field("city")
    private String city;
    
    @Field("country_id")
    private String countryId;
    
    @Field("state_id")
    private String stateId;
    
    @Field("latitude")
    private Double latitude;
    
    @Field("longitude")
    private Double longitude;
    
    @Field("timezone")
    private String timezone;
    
    @Field("airport_type")
    private String airportType; // International / Domestic
    
    public Airport() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    public Airport(String iataCode, String icaoCode, String name, String city, 
                   String countryId, String stateId, Double latitude, Double longitude, 
                   String timezone, String airportType) {
        this();
        this.iataCode = iataCode;
        this.icaoCode = icaoCode;
        this.name = name;
        this.city = city;
        this.countryId = countryId;
        this.stateId = stateId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timezone = timezone;
        this.airportType = airportType;
    }
    
    // Getters and Setters
    public String getIataCode() {
        return iataCode;
    }
    
    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }
    
    public String getIcaoCode() {
        return icaoCode;
    }
    
    public void setIcaoCode(String icaoCode) {
        this.icaoCode = icaoCode;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getCountryId() {
        return countryId;
    }
    
    public void setCountryId(String countryId) {
        this.countryId = countryId;
    }
    
    public String getStateId() {
        return stateId;
    }
    
    public void setStateId(String stateId) {
        this.stateId = stateId;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getTimezone() {
        return timezone;
    }
    
    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
    
    public String getAirportType() {
        return airportType;
    }
    
    public void setAirportType(String airportType) {
        this.airportType = airportType;
    }
}