package com.flight.dto;

import com.flight.entity.Seat;

import java.time.LocalDateTime;
import java.util.List;

public class FlightDto {
    private String id;
    private String flightNumber;
    private String airline;
    private String originAirportId;
    private String destinationAirportId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer durationMinutes;
    private String aircraftId;
    private Double price;
    private Integer availableSeats;
    private Integer totalSeats;
    private String status;
    private List<Seat> seats;
    private String flightType; // Direct, Connecting
    private List<FlightDto> connectingFlights;
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFlightNumber() {
        return flightNumber;
    }
    
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
    
    public String getAirline() {
        return airline;
    }
    
    public void setAirline(String airline) {
        this.airline = airline;
    }
    
    public String getOriginAirportId() {
        return originAirportId;
    }
    
    public void setOriginAirportId(String originAirportId) {
        this.originAirportId = originAirportId;
    }
    
    public String getDestinationAirportId() {
        return destinationAirportId;
    }
    
    public void setDestinationAirportId(String destinationAirportId) {
        this.destinationAirportId = destinationAirportId;
    }
    
    public LocalDateTime getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }
    
    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public String getAircraftId() {
        return aircraftId;
    }
    
    public void setAircraftId(String aircraftId) {
        this.aircraftId = aircraftId;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public Integer getAvailableSeats() {
        return availableSeats;
    }
    
    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
    
    public Integer getTotalSeats() {
        return totalSeats;
    }
    
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<Seat> getSeats() {
        return seats;
    }
    
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
    
    public String getFlightType() {
        return flightType;
    }
    
    public void setFlightType(String flightType) {
        this.flightType = flightType;
    }
    
    public List<FlightDto> getConnectingFlights() {
        return connectingFlights;
    }
    
    public void setConnectingFlights(List<FlightDto> connectingFlights) {
        this.connectingFlights = connectingFlights;
    }
}