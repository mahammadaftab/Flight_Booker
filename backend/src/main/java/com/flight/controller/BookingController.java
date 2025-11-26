package com.flight.controller;

import com.flight.entity.Booking;
import com.flight.entity.Passenger;
import com.flight.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam String userId,
            @RequestParam String flightId,
            @RequestBody List<Passenger> passengers,
            @RequestParam List<String> seatNumbers,
            @RequestParam Double totalPrice) {
        
        Booking booking = bookingService.createBooking(userId, flightId, passengers, seatNumbers, totalPrice);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/{bookingId}/confirm")
    public ResponseEntity<Booking> confirmBooking(
            @PathVariable String bookingId,
            @RequestParam String paymentId) {
        
        Booking booking = bookingService.confirmBooking(bookingId, paymentId);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String bookingId) {
        Booking booking = bookingService.cancelBooking(bookingId);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<Booking> getBookingByPNR(@PathVariable String pnr) {
        Booking booking = bookingService.getBookingByPNR(pnr);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }
    
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<Booking>> getBookingsByFlight(@PathVariable String flightId) {
        return ResponseEntity.ok(bookingService.getBookingsByFlight(flightId));
    }
}