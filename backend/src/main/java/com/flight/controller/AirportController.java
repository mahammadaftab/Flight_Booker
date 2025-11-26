package com.flight.controller;

import com.flight.entity.Airport;
import com.flight.entity.Country;
import com.flight.entity.State;
import com.flight.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "*")
public class AirportController {
    
    @Autowired
    private AirportService airportService;
    
    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        return ResponseEntity.ok(airportService.getAllCountries());
    }
    
    @GetMapping("/countries/{countryId}/states")
    public ResponseEntity<List<State>> getStatesByCountry(@PathVariable String countryId) {
        return ResponseEntity.ok(airportService.getStatesByCountry(countryId));
    }
    
    @GetMapping("/countries/{countryId}/airports")
    public ResponseEntity<List<Airport>> getAirportsByCountry(@PathVariable String countryId) {
        return ResponseEntity.ok(airportService.getAirportsByCountry(countryId));
    }
    
    @GetMapping("/states/{stateId}/airports")
    public ResponseEntity<List<Airport>> getAirportsByState(@PathVariable String stateId) {
        return ResponseEntity.ok(airportService.getAirportsByState(stateId));
    }
    
    @GetMapping("/search/name")
    public ResponseEntity<List<Airport>> searchAirportsByName(@RequestParam String name) {
        return ResponseEntity.ok(airportService.searchAirportsByName(name));
    }
    
    @GetMapping("/search/city")
    public ResponseEntity<List<Airport>> searchAirportsByCity(@RequestParam String city) {
        return ResponseEntity.ok(airportService.searchAirportsByCity(city));
    }
    
    @GetMapping("/search/iata")
    public ResponseEntity<List<Airport>> searchAirportsByIataCode(@RequestParam String iataCode) {
        Airport airport = airportService.getAirportByIataCode(iataCode);
        if (airport != null) {
            return ResponseEntity.ok(List.of(airport));
        } else {
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/iata/{iataCode}")
    public ResponseEntity<Airport> getAirportByIataCode(@PathVariable String iataCode) {
        Airport airport = airportService.getAirportByIataCode(iataCode);
        if (airport != null) {
            return ResponseEntity.ok(airport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}