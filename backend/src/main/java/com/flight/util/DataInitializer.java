// backend/src/main/java/com/flight/util/DataInitializer.java
package com.flight.util;

import com.flight.entity.*;
import com.flight.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing database with sample data...");
        
        // Initialize countries and states first
        initializeCountriesAndStates();
        
        // Initialize airports
        initializeAirports();
        
        // Initialize flights
        initializeFlights();
        
        // Initialize users
        initializeUsers();
        
        logger.info("Database initialization completed");
    }
    
    private void initializeCountriesAndStates() {
        // Check if countries already exist
        if (countryRepository.count() == 0) {
            logger.info("Initializing countries and states...");
            
            // Create countries
            List<Country> countries = new ArrayList<>();
            Country us = new Country();
            us.setName("United States");
            us.setCode("US");
            
            Country india = new Country();
            india.setName("India");
            india.setCode("IN");
            
            Country uk = new Country();
            uk.setName("United Kingdom");
            uk.setCode("GB");
            
            Country canada = new Country();
            canada.setName("Canada");
            canada.setCode("CA");
            
            countries.add(us);
            countries.add(india);
            countries.add(uk);
            countries.add(canada);
            
            for (Country country : countries) {
                country.setCreatedAt(LocalDateTime.now());
                country.setUpdatedAt(LocalDateTime.now());
            }
            
            countryRepository.saveAll(countries);
            logger.info("Initialized {} countries", countries.size());
        }
        
        // Check if states already exist
        if (stateRepository.count() == 0) {
            List<Country> allCountries = countryRepository.findAll();
            Map<String, String> countryMap = allCountries.stream()
                .collect(Collectors.toMap(Country::getName, Country::getId));
            
            List<State> states = new ArrayList<>();
            State california = new State();
            california.setName("California");
            california.setCountryId(countryMap.get("United States"));
            california.setCode("CA");
            
            State newYork = new State();
            newYork.setName("New York");
            newYork.setCountryId(countryMap.get("United States"));
            newYork.setCode("NY");
            
            State delhi = new State();
            delhi.setName("Delhi");
            delhi.setCountryId(countryMap.get("India"));
            delhi.setCode("DL");
            
            State maharashtra = new State();
            maharashtra.setName("Maharashtra");
            maharashtra.setCountryId(countryMap.get("India"));
            maharashtra.setCode("MH");
            
            State karnataka = new State();
            karnataka.setName("Karnataka");
            karnataka.setCountryId(countryMap.get("India"));
            karnataka.setCode("KA");
            
            states.add(california);
            states.add(newYork);
            states.add(delhi);
            states.add(maharashtra);
            states.add(karnataka);
            
            for (State state : states) {
                state.setCreatedAt(LocalDateTime.now());
                state.setUpdatedAt(LocalDateTime.now());
            }
            
            stateRepository.saveAll(states);
            logger.info("Initialized {} states", states.size());
        }
    }
    
    private void initializeAirports() {
        // Check if airports already exist
        if (airportRepository.count() == 0) {
            logger.info("Initializing airports...");
            
            List<Country> countries = countryRepository.findAll();
            Map<String, String> countryMap = countries.stream()
                .collect(Collectors.toMap(Country::getName, Country::getId));
            
            List<State> states = stateRepository.findAll();
            Map<String, String> stateMap = states.stream()
                .collect(Collectors.toMap(State::getName, State::getId));
            
            List<Airport> airports = Arrays.asList(
                // US Airports
                new Airport("JFK", "JFK", "John F Kennedy International Airport", "New York", 
                           countryMap.get("United States"), stateMap.get("New York"), 
                           40.6397, -73.7789, "America/New_York", "International"),
                new Airport("LAX", "LAX", "Los Angeles International Airport", "Los Angeles", 
                           countryMap.get("United States"), stateMap.get("California"), 
                           33.9425, -118.4081, "America/Los_Angeles", "International"),
                new Airport("ORD", "ORD", "O'Hare International Airport", "Chicago", 
                           countryMap.get("United States"), null, 
                           41.9786, -87.9048, "America/Chicago", "International"),

                // Indian Airports
                new Airport("DEL", "VIDP", "Indira Gandhi International Airport", "New Delhi", 
                           countryMap.get("India"), stateMap.get("Delhi"), 
                           28.5562, 77.1000, "Asia/Kolkata", "International"),
                new Airport("BOM", "VABB", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", 
                           countryMap.get("India"), stateMap.get("Maharashtra"), 
                           19.0886, 72.8679, "Asia/Kolkata", "International"),
                new Airport("BLR", "VOBL", "Kempegowda International Airport", "Bangalore", 
                           countryMap.get("India"), stateMap.get("Karnataka"), 
                           13.1986, 77.7066, "Asia/Kolkata", "International"),

                // UK Airports
                new Airport("LHR", "EGLL", "London Heathrow Airport", "London", 
                           countryMap.get("United Kingdom"), null, 
                           51.4700, -0.4543, "Europe/London", "International"),
                new Airport("MAN", "EGCC", "Manchester Airport", "Manchester", 
                           countryMap.get("United Kingdom"), null, 
                           53.3537, -2.2749, "Europe/London", "International"),

                // Canadian Airports
                new Airport("YYZ", "CYYZ", "Toronto Pearson International Airport", "Toronto", 
                           countryMap.get("Canada"), null, 
                           43.6777, -79.6248, "America/Toronto", "International"),
                new Airport("YVR", "CYVR", "Vancouver International Airport", "Vancouver", 
                           countryMap.get("Canada"), null, 
                           49.1947, -123.1840, "America/Vancouver", "International")
            );

            for (Airport airport : airports) {
                airport.setCreatedAt(LocalDateTime.now());
                airport.setUpdatedAt(LocalDateTime.now());
            }

            airportRepository.saveAll(airports);
            logger.info("Initialized {} airports", airports.size());
        }
    }
    
    private void initializeFlights() {
        // Check if flights already exist
        if (flightRepository.count() == 0) {
            logger.info("Initializing flights...");
            
            // Get some airports
            Optional<Airport> delhiAirport = airportRepository.findByIataCode("DEL");
            Optional<Airport> mumbaiAirport = airportRepository.findByIataCode("BOM");
            Optional<Airport> bangaloreAirport = airportRepository.findByIataCode("BLR");
            Optional<Airport> jfkAirport = airportRepository.findByIataCode("JFK");
            Optional<Airport> laxAirport = airportRepository.findByIataCode("LAX");

            if (delhiAirport.isPresent() && mumbaiAirport.isPresent() && bangaloreAirport.isPresent()) {
                List<Flight> flights = Arrays.asList(
                        createFlight("AI101", "Air India", delhiAirport.get().getId(), mumbaiAirport.get().getId(),
                                   LocalDateTime.now().plusDays(1).withHour(8).withMinute(0),
                                   LocalDateTime.now().plusDays(1).withHour(10).withMinute(30),
                                   150, "Boeing 737", 200.0, 180, 180, "On-time", "Direct"),
                        createFlight("SG202", "SpiceJet", mumbaiAirport.get().getId(), bangaloreAirport.get().getId(),
                                   LocalDateTime.now().plusDays(1).withHour(14).withMinute(30),
                                   LocalDateTime.now().plusDays(1).withHour(16).withMinute(0),
                                   90, "Airbus A320", 150.0, 180, 180, "On-time", "Direct"),
                        createFlight("AI201", "Air India", jfkAirport.get().getId(), laxAirport.get().getId(),
                                   LocalDateTime.now().plusDays(1).withHour(12).withMinute(0),
                                   LocalDateTime.now().plusDays(1).withHour(15).withMinute(0),
                                   180, "Boeing 777", 400.0, 200, 200, "On-time", "Direct"),
                        createFlight("DL101", "Delta Airlines", laxAirport.get().getId(), delhiAirport.get().getId(),
                                   LocalDateTime.now().plusDays(2).withHour(20).withMinute(0),
                                   LocalDateTime.now().plusDays(3).withHour(18).withMinute(30),
                                   1350, "Boeing 787", 800.0, 250, 250, "On-time", "Connecting")
                );

                flightRepository.saveAll(flights);
                logger.info("Initialized {} flights", flights.size());
            }
        }
    }
    
    private Flight createFlight(String flightNumber, String airline, String originAirportId, String destinationAirportId,
                                LocalDateTime departureTime, LocalDateTime arrivalTime,
                                int durationMinutes, String aircraftId, double price,
                                int availableSeats, int totalSeats, String status, String flightType) {
        Flight flight = new Flight();
        flight.setFlightNumber(flightNumber);
        flight.setAirline(airline);
        flight.setOriginAirportId(originAirportId);
        flight.setDestinationAirportId(destinationAirportId);
        flight.setDepartureTime(departureTime);
        flight.setArrivalTime(arrivalTime);
        flight.setDurationMinutes(durationMinutes);
        flight.setAircraftId(aircraftId);
        flight.setPrice(price);
        flight.setAvailableSeats(availableSeats);
        flight.setTotalSeats(totalSeats);
        flight.setStatus(status);
        flight.setFlightType(flightType);
        flight.setCreatedAt(LocalDateTime.now());
        flight.setUpdatedAt(LocalDateTime.now());
        
        // Create seats for the flight
        List<Seat> seats = createSeatsForFlight(totalSeats);
        flight.setSeats(seats);
        
        return flight;
    }
    
    private List<Seat> createSeatsForFlight(int totalSeats) {
        List<Seat> seats = new ArrayList<>();
        
        // Define seat configuration
        // Assume a typical aircraft layout:
        // Rows 1-5: First Class (2 seats per row)
        // Rows 6-15: Business Class (4 seats per row)
        // Rows 16-30: Premium Economy (6 seats per row)
        // Rows 31-50: Economy (6 seats per row)
        
        int seatCounter = 1;
        
        // First Class (Rows 1-5)
        for (int row = 1; row <= 5; row++) {
            for (char col = 'A'; col <= 'B'; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + String.valueOf(col));
                seat.setSeatClass("First Class");
                seat.setBasePrice(1000.0);
                seat.setCurrentPrice(1000.0);
                seat.setStatus("Available");
                seat.setRow(row);
                seat.setColumn(String.valueOf(col));
                seats.add(seat);
                seatCounter++;
            }
        }
        
        // Business Class (Rows 6-15)
        for (int row = 6; row <= 15; row++) {
            for (char col = 'A'; col <= 'D'; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + String.valueOf(col));
                seat.setSeatClass("Business");
                seat.setBasePrice(600.0);
                seat.setCurrentPrice(600.0);
                seat.setStatus("Available");
                seat.setRow(row);
                seat.setColumn(String.valueOf(col));
                seats.add(seat);
                seatCounter++;
            }
        }
        
        // Premium Economy (Rows 16-30)
        for (int row = 16; row <= 30; row++) {
            for (char col = 'A'; col <= 'F'; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + String.valueOf(col));
                seat.setSeatClass("Premium Economy");
                seat.setBasePrice(400.0);
                seat.setCurrentPrice(400.0);
                seat.setStatus("Available");
                seat.setRow(row);
                seat.setColumn(String.valueOf(col));
                seats.add(seat);
                seatCounter++;
            }
        }
        
        // Economy (Rows 31-50)
        for (int row = 31; row <= 50; row++) {
            for (char col = 'A'; col <= 'F'; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + String.valueOf(col));
                seat.setSeatClass("Economy");
                seat.setBasePrice(200.0);
                seat.setCurrentPrice(200.0);
                seat.setStatus("Available");
                seat.setRow(row);
                seat.setColumn(String.valueOf(col));
                seats.add(seat);
                seatCounter++;
            }
        }
        
        return seats;
    }

    private void initializeUsers() {
        // Check if users already exist
        if (userRepository.count() == 0) {
            logger.info("Initializing users...");
            
            List<User> users = Arrays.asList(
                createUser("admin", "admin@example.com", "admin123", "ADMIN"),
                createUser("user", "user@example.com", "user123", "USER")
            );
            
            userRepository.saveAll(users);
            logger.info("Initialized {} users", users.size());
        }
    }
    
    private User createUser(String username, String email, String password, String role) {
        User user = new User();
        // Split username into first and last name
        String[] nameParts = username.split(" ", 2);
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        user.setEmail(email);
        user.setPassword(password); // In real implementation, this should be hashed
        Set<String> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        user.setIsEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
}