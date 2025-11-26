package com.flight.scheduler;

import com.flight.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SeatLockScheduler {
    
    @Autowired
    private FlightService flightService;
    
    // Run every minute to release expired seat locks
    @Scheduled(fixedRate = 60000)
    public void releaseExpiredSeatLocks() {
        flightService.releaseExpiredLocks();
    }
}