package com.flight.dto;

import com.flight.entity.Passenger;

import java.util.List;

public class BookingDto {
    private String id;
    private String pnr;
    private String userId;
    private String flightId;
    private List<Passenger> passengerDetails;
    private List<String> seats;
    private Double totalPrice;
    private String bookingStatus;
    private String paymentId;
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getPnr() {
        return pnr;
    }
    
    public void setPnr(String pnr) {
        this.pnr = pnr;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getFlightId() {
        return flightId;
    }
    
    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }
    
    public List<Passenger> getPassengerDetails() {
        return passengerDetails;
    }
    
    public void setPassengerDetails(List<Passenger> passengerDetails) {
        this.passengerDetails = passengerDetails;
    }
    
    public List<String> getSeats() {
        return seats;
    }
    
    public void setSeats(List<String> seats) {
        this.seats = seats;
    }
    
    public Double getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public String getBookingStatus() {
        return bookingStatus;
    }
    
    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
}