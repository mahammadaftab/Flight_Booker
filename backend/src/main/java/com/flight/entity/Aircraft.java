package com.flight.entity;

import com.flight.entity.Seat;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "aircrafts")
public class Aircraft extends BaseEntity {
    
    @Field("name")
    private String name;
    
    @Field("manufacturer")
    private String manufacturer;
    
    @Field("model")
    private String model;
    
    @Field("total_seats")
    private Integer totalSeats;
    
    @Field("seat_layout")
    private List<Seat> seatLayout;
    
    public Aircraft() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    public Aircraft(String name, String manufacturer, String model, Integer totalSeats, List<Seat> seatLayout) {
        this();
        this.name = name;
        this.manufacturer = manufacturer;
        this.model = model;
        this.totalSeats = totalSeats;
        this.seatLayout = seatLayout;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getManufacturer() {
        return manufacturer;
    }
    
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getTotalSeats() {
        return totalSeats;
    }
    
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }
    
    public List<Seat> getSeatLayout() {
        return seatLayout;
    }
    
    public void setSeatLayout(List<Seat> seatLayout) {
        this.seatLayout = seatLayout;
    }
}