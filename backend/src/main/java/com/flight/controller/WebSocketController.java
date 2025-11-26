package com.flight.controller;

import com.flight.entity.Flight;
import com.flight.entity.Seat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @MessageMapping("/seat-update")
    public void updateSeat(@Payload SeatUpdateMessage message) {
        // Send the seat update to the specific flight topic
        messagingTemplate.convertAndSend("/topic/seat-updates/" + message.getFlightId(), message.getSeat());
    }
    
    @MessageMapping("/flight-status-update")
    public void updateFlightStatus(@Payload FlightStatusUpdateMessage message) {
        // Send the flight status update to the specific flight topic
        messagingTemplate.convertAndSend("/topic/flight-status-updates/" + message.getFlightId(), message.getStatus());
    }
    
    // Method to send seat updates to specific flight
    public void sendSeatUpdate(String flightId, Seat seat) {
        messagingTemplate.convertAndSend("/topic/seat-updates/" + flightId, seat);
    }
    
    // Method to send flight status updates
    public void sendFlightStatusUpdate(String flightId, String status) {
        messagingTemplate.convertAndSend("/topic/flight-status-updates/" + flightId, status);
    }
    
    // Method to send flight price updates
    public void sendFlightPriceUpdate(String flightId, Flight flight) {
        messagingTemplate.convertAndSend("/topic/flight-price-updates/" + flightId, flight);
    }
    
    // Method to send booking confirmation
    public void sendBookingConfirmation(String bookingId, String userId) {
        messagingTemplate.convertAndSend("/topic/booking-confirmations/" + userId, bookingId);
    }
    
    // Inner class for seat update messages
    public static class SeatUpdateMessage {
        private String flightId;
        private Seat seat;
        
        public SeatUpdateMessage() {}
        
        public SeatUpdateMessage(String flightId, Seat seat) {
            this.flightId = flightId;
            this.seat = seat;
        }
        
        // Getters and setters
        public String getFlightId() {
            return flightId;
        }
        
        public void setFlightId(String flightId) {
            this.flightId = flightId;
        }
        
        public Seat getSeat() {
            return seat;
        }
        
        public void setSeat(Seat seat) {
            this.seat = seat;
        }
    }
    
    // Inner class for flight status update messages
    public static class FlightStatusUpdateMessage {
        private String flightId;
        private String status;
        
        public FlightStatusUpdateMessage() {}
        
        public FlightStatusUpdateMessage(String flightId, String status) {
            this.flightId = flightId;
            this.status = status;
        }
        
        // Getters and setters
        public String getFlightId() {
            return flightId;
        }
        
        public void setFlightId(String flightId) {
            this.flightId = flightId;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}