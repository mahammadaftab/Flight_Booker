package com.flight.config;

import com.flight.entity.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;

@Configuration
public class MongoConfig {

    @Autowired
    private MongoTemplate mongoTemplate;

    @EventListener(ContextRefreshedEvent.class)
    public void initIndicesAfterStartup() {
        // Create index for User email (unique)
        mongoTemplate.indexOps(User.class)
                .ensureIndex(new Index()
                        .on("email", Sort.Direction.ASC)
                        .unique());

        // Create index for Booking PNR
        mongoTemplate.indexOps(Booking.class)
                .ensureIndex(new Index()
                        .on("pnr", Sort.Direction.ASC)
                        .unique());

        // Create index for Flight search (origin, destination, departure date)
        mongoTemplate.indexOps(Flight.class)
                .ensureIndex(new Index()
                        .on("originAirportId", Sort.Direction.ASC)
                        .on("destinationAirportId", Sort.Direction.ASC)
                        .on("departureTime", Sort.Direction.ASC));

        // Create index for SeatLock (flightId, seatNumber)
        mongoTemplate.indexOps(SeatLock.class)
                .ensureIndex(new Index()
                        .on("flightId", Sort.Direction.ASC)
                        .on("seatNumber", Sort.Direction.ASC));

        // Create text index for Airport search (name, city, iataCode)
        TextIndexDefinition textIndex = TextIndexDefinition.builder()
                .onField("name")
                .onField("city")
                .onField("iataCode")
                .build();
        mongoTemplate.indexOps(Airport.class).ensureIndex(textIndex);
    }
}