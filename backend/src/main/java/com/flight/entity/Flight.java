package com.flight.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "flights")
public class Flight extends BaseEntity {
    
    @Field("flight_number")
    private String flightNumber;
    
    @Field("airline")
    private String airline;
    
    @Field("origin_airport_id")
    private String originAirportId;
    
    @Field("destination_airport_id")
    private String destinationAirportId;
    
    @Field("departure_time")
    private LocalDateTime departureTime;
    
    @Field("arrival_time")
    private LocalDateTime arrivalTime;
    
    @Field("duration_minutes")
    private Integer durationMinutes;
    
    @Field("aircraft_id")
    private String aircraftId;
    
    @Field("price")
    private Double price;
    
    @Field("available_seats")
    private Integer availableSeats;
    
    @Field("total_seats")
    private Integer totalSeats;
    
    @Field("status")
    private String status; // On-time, Delayed, Cancelled
    
    @Field("seats")
    private List<Seat> seats;
    
    @Field("flight_type")
    private String flightType; // Direct, Connecting
    
    @Field("connecting_flights")
    private List<Flight> connectingFlights;
    
    public Flight() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    // Getters and Setters
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
    
    public List<Flight> getConnectingFlights() {
        return connectingFlights;
    }
    
    public void setConnectingFlights(List<Flight> connectingFlights) {
        this.connectingFlights = connectingFlights;
    }
}