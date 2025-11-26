package com.flight.service;

import com.flight.entity.Flight;
import com.flight.entity.Seat;
import com.flight.entity.SeatLock;
import com.flight.repository.FlightRepository;
import com.flight.repository.SeatLockRepository;
import com.flight.controller.WebSocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FlightService {
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private SeatLockRepository seatLockRepository;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @Autowired
    private PricingService pricingService;
    
    public List<Flight> searchFlights(String originAirportId, String destinationAirportId, 
                                      LocalDateTime travelDate, int passengers, String sortBy) {
        LocalDateTime startDate = travelDate.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endDate = travelDate.withHour(23).withMinute(59).withSecond(59);
        
        List<Flight> flights = flightRepository.findByOriginAirportIdAndDestinationAirportIdAndDepartureTimeBetween(
                originAirportId, destinationAirportId, startDate, endDate);
        
        // Set flight type for each flight
        for (Flight flight : flights) {
            determineFlightType(flight);
        }
        
        // Apply sorting based on the sortBy parameter
        switch (sortBy.toLowerCase()) {
            case "cheapest":
                flights.sort(Comparator.comparing(Flight::getPrice));
                break;
            case "fastest":
                flights.sort(Comparator.comparing(Flight::getDurationMinutes));
                break;
            case "earliest":
                flights.sort(Comparator.comparing(Flight::getDepartureTime));
                break;
            case "latest":
                flights.sort(Comparator.comparing(Flight::getArrivalTime));
                break;
            case "best":
            default:
                // Best sorting: combination of price, duration, and departure time
                flights.sort(Comparator.comparing(Flight::getPrice)
                        .thenComparing(Flight::getDurationMinutes)
                        .thenComparing(Flight::getDepartureTime));
                break;
        }
        
        return flights;
    }
    
    private void determineFlightType(Flight flight) {
        // If flight has connecting flights, it's a connecting flight
        if (flight.getConnectingFlights() != null && !flight.getConnectingFlights().isEmpty()) {
            flight.setFlightType("Connecting");
        } else {
            // Otherwise, it's a direct flight
            flight.setFlightType("Direct");
        }
    }
    
    public Flight getFlightById(String flightId) {
        return flightRepository.findById(flightId).orElse(null);
    }
    
    public List<Flight> getFlightsByAirline(String airline) {
        return flightRepository.findByAirlineContainingIgnoreCase(airline);
    }
    
    public List<Flight> getFlightsByStatus(String status) {
        return flightRepository.findByStatus(status);
    }
    
    public boolean isSeatAvailable(String flightId, String seatNumber) {
        Flight flight = getFlightById(flightId);
        if (flight == null) {
            return false;
        }
        
        // Check if seat is locked
        List<SeatLock> seatLocks = seatLockRepository.findByFlightIdAndSeatNumber(flightId, seatNumber);
        for (SeatLock lock : seatLocks) {
            if (lock.getExpiresAt().isAfter(LocalDateTime.now())) {
                return false; // Seat is locked
            }
        }
        
        // Check if seat is booked
        for (Seat seat : flight.getSeats()) {
            if (seat.getSeatNumber().equals(seatNumber)) {
                return "Available".equals(seat.getStatus());
            }
        }
        
        return false;
    }
    
    public boolean lockSeat(String flightId, String seatNumber, String userId) {
        // Check if seat is available
        if (!isSeatAvailable(flightId, seatNumber)) {
            return false;
        }
        
        // Create seat lock
        SeatLock seatLock = new SeatLock();
        seatLock.setFlightId(flightId);
        seatLock.setSeatNumber(seatNumber);
        seatLock.setUserId(userId);
        seatLock.setLockedAt(LocalDateTime.now());
        seatLock.setExpiresAt(LocalDateTime.now().plusMinutes(2)); // 2 minutes lock
        
        seatLockRepository.save(seatLock);
        
        // Update seat status in flight
        Flight flight = getFlightById(flightId);
        if (flight != null) {
            for (Seat seat : flight.getSeats()) {
                if (seat.getSeatNumber().equals(seatNumber)) {
                    seat.setStatus("Temporarily Locked");
                    flightRepository.save(flight);
                    
                    // Send WebSocket update
                    webSocketController.sendSeatUpdate(flightId, seat);
                    break;
                }
            }
        }
        
        return true;
    }
    
    public void unlockSeat(String flightId, String seatNumber, String userId) {
        Optional<SeatLock> seatLock = seatLockRepository.findByFlightIdAndSeatNumberAndUserId(
                flightId, seatNumber, userId);
        if (seatLock.isPresent()) {
            seatLockRepository.delete(seatLock.get());
            
            // Update seat status in flight
            Flight flight = getFlightById(flightId);
            if (flight != null) {
                for (Seat seat : flight.getSeats()) {
                    if (seat.getSeatNumber().equals(seatNumber)) {
                        seat.setStatus("Available");
                        flightRepository.save(flight);
                        
                        // Send WebSocket update
                        webSocketController.sendSeatUpdate(flightId, seat);
                        break;
                    }
                }
            }
        }
    }
    
    public void releaseExpiredLocks() {
        List<SeatLock> expiredLocks = seatLockRepository.findByExpiresAtBefore(LocalDateTime.now());
        for (SeatLock lock : expiredLocks) {
            // Update seat status in flight
            Flight flight = getFlightById(lock.getFlightId());
            if (flight != null) {
                for (Seat seat : flight.getSeats()) {
                    if (seat.getSeatNumber().equals(lock.getSeatNumber())) {
                        seat.setStatus("Available");
                        flightRepository.save(flight);
                        
                        // Send WebSocket update
                        webSocketController.sendSeatUpdate(lock.getFlightId(), seat);
                        break;
                    }
                }
            }
        }
        seatLockRepository.deleteAll(expiredLocks);
    }
    
    /**
     * Update prices for all seats in a flight and notify clients via WebSocket
     * @param flightId The ID of the flight to update prices for
     */
    public void updateFlightPrices(String flightId) {
        Flight flight = getFlightById(flightId);
        if (flight != null) {
            // Update all seat prices
            pricingService.updateFlightPrices(flight);
            
            // Save the updated flight
            flightRepository.save(flight);
            
            // Notify all clients subscribed to this flight's price updates
            webSocketController.sendFlightPriceUpdate(flightId, flight);
        }
    }
    
    /**
     * Send booking confirmation notification via WebSocket
     * @param bookingId The ID of the booking confirmation
     * @param userId The ID of the user to notify
     */
    public void sendBookingConfirmation(String bookingId, String userId) {
        webSocketController.sendBookingConfirmation(bookingId, userId);
    }
    
    /**
     * Update flight status and notify clients via WebSocket
     * @param flightId The ID of the flight to update
     * @param status The new status of the flight
     */
    public void updateFlightStatus(String flightId, String status) {
        Flight flight = getFlightById(flightId);
        if (flight != null) {
            flight.setStatus(status);
            flightRepository.save(flight);
            
            // Notify all clients subscribed to this flight's status updates
            webSocketController.sendFlightStatusUpdate(flightId, status);
        }
    }
}