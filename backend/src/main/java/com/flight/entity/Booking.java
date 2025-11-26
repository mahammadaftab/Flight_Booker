package com.flight.entity;

import com.flight.entity.Passenger;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "bookings")
public class Booking extends BaseEntity {
    
    @Field("pnr")
    private String pnr; // Passenger Name Record
    
    @Field("user_id")
    private String userId;
    
    @Field("flight_id")
    private String flightId;
    
    @Field("passenger_details")
    private List<Passenger> passengerDetails;
    
    @Field("seats")
    private List<String> seats; // List of seat numbers
    
    @Field("total_price")
    private Double totalPrice;
    
    @Field("booking_status")
    private String bookingStatus; // Confirmed, Cancelled, Pending
    
    @Field("payment_id")
    private String paymentId;
    
    public Booking() {
        this.setCreatedAt(LocalDateTime.now());
        this.setUpdatedAt(LocalDateTime.now());
    }
    
    // Getters and Setters
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