package com.flight.controller;

import com.flight.entity.Flight;
import com.flight.entity.Seat;
import com.flight.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {
    
    @Autowired
    private FlightService flightService;
    
    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String originAirportId,
            @RequestParam String destinationAirportId,
            @RequestParam String travelDate,
            @RequestParam int passengers,
            @RequestParam(required = false, defaultValue = "best") String sortBy) {
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(travelDate, formatter);
        
        List<Flight> flights = flightService.searchFlights(
                originAirportId, destinationAirportId, date.atStartOfDay(), passengers, sortBy);
        
        return ResponseEntity.ok(flights);
    }
    
    @GetMapping("/{flightId}")
    public ResponseEntity<Flight> getFlightById(@PathVariable String flightId) {
        Flight flight = flightService.getFlightById(flightId);
        if (flight != null) {
            return ResponseEntity.ok(flight);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/airline")
    public ResponseEntity<List<Flight>> getFlightsByAirline(@RequestParam String airline) {
        return ResponseEntity.ok(flightService.getFlightsByAirline(airline));
    }
    
    @GetMapping("/status")
    public ResponseEntity<List<Flight>> getFlightsByStatus(@RequestParam String status) {
        return ResponseEntity.ok(flightService.getFlightsByStatus(status));
    }
    
    @PostMapping("/seat-lock")
    public ResponseEntity<String> lockSeat(
            @RequestParam String flightId,
            @RequestParam String seatNumber,
            @RequestHeader("Authorization") String authHeader) {
        
        // Extract user ID from token (in a real implementation, you would validate the JWT token)
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        boolean result = flightService.lockSeat(flightId, seatNumber, userId);
        if (result) {
            return ResponseEntity.ok("Seat locked successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to lock seat");
        }
    }
    
    @DeleteMapping("/seat-lock")
    public ResponseEntity<String> unlockSeat(
            @RequestParam String flightId,
            @RequestParam String seatNumber,
            @RequestHeader("Authorization") String authHeader) {
        
        // Extract user ID from token (in a real implementation, you would validate the JWT token)
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        
        flightService.unlockSeat(flightId, seatNumber, userId);
        return ResponseEntity.ok("Seat unlocked successfully");
    }
    
    // Helper method to extract user ID from JWT token (simplified for now)
    private String extractUserIdFromToken(String authHeader) {
        // In a real implementation, you would validate the JWT token and extract the user ID
        // For now, we'll just return a dummy user ID if the header is present
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // In a real implementation, you would decode the JWT token and extract the user ID
            // For now, we'll just return a dummy user ID
            return "user-id"; // This should be replaced with actual user ID extraction logic
        }
        return null;
    }
}