package com.flight.service;

import com.flight.entity.Booking;
import com.flight.entity.Flight;
import com.flight.entity.Passenger;
import com.flight.entity.Payment;
import com.flight.repository.BookingRepository;
import com.flight.repository.FlightRepository;
import com.flight.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int PNR_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();
    
    public Booking createBooking(String userId, String flightId, List<Passenger> passengers, 
                                List<String> seatNumbers, Double totalPrice) {
        Booking booking = new Booking();
        booking.setPnr(generatePNR());
        booking.setUserId(userId);
        booking.setFlightId(flightId);
        booking.setPassengerDetails(passengers);
        booking.setSeats(seatNumbers);
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus("Pending");
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);
        
        return bookingRepository.save(booking);
    }
    
    public Booking confirmBooking(String bookingId, String paymentId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            booking.setBookingStatus("Confirmed");
            booking.setPaymentId(paymentId);
            
            // Update timestamps
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Update flight seat availability
            Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
            if (flight != null) {
                flight.setAvailableSeats(flight.getAvailableSeats() - booking.getSeats().size());
                flight.setUpdatedAt(LocalDateTime.now());
                flightRepository.save(flight);
            }
            
            // Send confirmation email
            sendBookingConfirmationEmail(booking);
            
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public Booking cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            booking.setBookingStatus("Cancelled");
            
            // Update timestamps
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Refund logic would go here
            
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public Booking getBookingByPNR(String pnr) {
        return bookingRepository.findByPnr(pnr).orElse(null);
    }
    
    public List<Booking> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getBookingsByFlight(String flightId) {
        return bookingRepository.findByFlightId(flightId);
    }
    
    /**
     * Generate a unique PNR (Passenger Name Record) following standard airline format
     * Standard format: 6-character alphanumeric code
     */
    private String generatePNR() {
        StringBuilder sb = new StringBuilder(PNR_LENGTH);
        for (int i = 0; i < PNR_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
    
    /**
     * Send booking confirmation email to the passenger
     */
    private void sendBookingConfirmationEmail(Booking booking) {
        try {
            // Get the first passenger's email
            String email = "";
            if (booking.getPassengerDetails() != null && !booking.getPassengerDetails().isEmpty()) {
                email = booking.getPassengerDetails().get(0).getEmail();
            }
            
            if (email != null && !email.isEmpty()) {
                String subject = "Booking Confirmation - PNR: " + booking.getPnr();
                StringBuilder body = new StringBuilder();
                body.append("Dear Customer,\n\n");
                body.append("Your booking has been confirmed successfully!\n\n");
                body.append("Booking Details:\n");
                body.append("PNR: ").append(booking.getPnr()).append("\n");
                body.append("Booking Status: ").append(booking.getBookingStatus()).append("\n");
                body.append("Total Price: $").append(booking.getTotalPrice()).append("\n");
                body.append("Seats: ").append(String.join(", ", booking.getSeats())).append("\n\n");
                body.append("Thank you for choosing our airline!\n");
                body.append("Safe travels!");
                
                emailService.sendBookingConfirmationEmail(email, subject, body.toString());
            }
        } catch (Exception e) {
            // Log the error but don't fail the booking process
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
    }
}