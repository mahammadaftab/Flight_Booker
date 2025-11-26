package com.flight.scheduler;

import com.flight.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class PriceUpdateScheduler {

    @Autowired
    private FlightService flightService;

    // Sample flight IDs - in a real application, you would query for active flights
    private final List<String> sampleFlightIds = Arrays.asList(
        "flight-1", "flight-2", "flight-3", "flight-4", "flight-5"
    );

    /**
     * Update prices for sample flights every 30 seconds
     * In a real application, you would query for all active flights
     */
    @Scheduled(fixedRate = 30000) // 30 seconds
    public void updateFlightPrices() {
        for (String flightId : sampleFlightIds) {
            try {
                flightService.updateFlightPrices(flightId);
            } catch (Exception e) {
                // Log the error but continue with other flights
                System.err.println("Error updating prices for flight " + flightId + ": " + e.getMessage());
            }
        }
    }
}