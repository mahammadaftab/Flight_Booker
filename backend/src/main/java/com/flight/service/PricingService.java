package com.flight.service;

import com.flight.entity.Flight;
import com.flight.entity.Seat;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PricingService {

    private final Random random = new Random();

    /**
     * Calculate dynamic price for a seat based on various factors
     * @param seat The seat to calculate price for
     * @param flight The flight the seat belongs to
     * @return The dynamically calculated price
     */
    public Double calculateDynamicPrice(Seat seat, Flight flight) {
        if (seat.getBasePrice() == null) {
            return 0.0;
        }

        // Start with base price
        double price = seat.getBasePrice();

        // Factor 1: Time until departure (closer to departure = higher price)
        if (flight.getDepartureTime() != null) {
            long hoursUntilDeparture = java.time.Duration.between(LocalDateTime.now(), flight.getDepartureTime()).toHours();
            if (hoursUntilDeparture < 24) {
                // Last 24 hours - increase price by up to 50%
                price *= (1 + (24.0 - hoursUntilDeparture) / 48.0);
            } else if (hoursUntilDeparture < 168) {
                // Within a week - increase price by up to 25%
                price *= (1 + (168.0 - hoursUntilDeparture) / 672.0);
            }
        }

        // Factor 2: Seat class multiplier
        switch (seat.getSeatClass().toLowerCase()) {
            case "premium economy":
                price *= 1.5;
                break;
            case "business":
                price *= 2.5;
                break;
            case "first class":
                price *= 4.0;
                break;
            default:
                // Economy - no multiplier
                break;
        }

        // Factor 3: Seat popularity (aisle/window preference)
        if ("A".equals(seat.getColumn()) || "F".equals(seat.getColumn())) {
            // Window seats - 10% premium
            price *= 1.1;
        } else if ("C".equals(seat.getColumn()) || "D".equals(seat.getColumn())) {
            // Aisle seats - 5% premium
            price *= 1.05;
        }

        // Factor 4: Random fluctuation (simulate market dynamics)
        double fluctuation = 0.95 + (random.nextDouble() * 0.1); // Between 0.95 and 1.05
        price *= fluctuation;

        // Ensure price doesn't go below base price
        return Math.max(price, seat.getBasePrice());
    }

    /**
     * Update all seat prices for a flight based on current conditions
     * @param flight The flight to update prices for
     */
    public void updateFlightPrices(Flight flight) {
        if (flight.getSeats() != null) {
            for (Seat seat : flight.getSeats()) {
                // Only update price for available seats
                if ("Available".equals(seat.getStatus())) {
                    seat.setCurrentPrice(calculateDynamicPrice(seat, flight));
                }
            }
        }
    }
}