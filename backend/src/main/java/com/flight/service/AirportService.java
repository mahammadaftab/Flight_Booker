package com.flight.service;

import com.flight.entity.Airport;
import com.flight.entity.Country;
import com.flight.entity.State;
import com.flight.repository.AirportRepository;
import com.flight.repository.CountryRepository;
import com.flight.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportService {
    
    @Autowired
    private AirportRepository airportRepository;
    
    @Autowired
    private CountryRepository countryRepository;
    
    @Autowired
    private StateRepository stateRepository;
    
    public List<Airport> getAirportsByCountry(String countryId) {
        try {
            return airportRepository.findByCountryId(countryId);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<Airport> mockAirports = new ArrayList<>();
            
            // Add some mock airports based on country
            if ("country-1".equals(countryId)) { // United States
                Airport lax = new Airport();
                lax.setId("airport-1");
                lax.setName("Los Angeles International Airport");
                lax.setIataCode("LAX");
                lax.setCity("Los Angeles");
                lax.setCountryId("country-1");
                mockAirports.add(lax);
                
                Airport jfk = new Airport();
                jfk.setId("airport-2");
                jfk.setName("John F. Kennedy International Airport");
                jfk.setIataCode("JFK");
                jfk.setCity("New York");
                jfk.setCountryId("country-1");
                mockAirports.add(jfk);
                
                Airport dfw = new Airport();
                dfw.setId("airport-3");
                dfw.setName("Dallas/Fort Worth International Airport");
                dfw.setIataCode("DFW");
                dfw.setCity("Dallas");
                dfw.setCountryId("country-1");
                mockAirports.add(dfw);
            } else if ("country-2".equals(countryId)) { // United Kingdom
                Airport lhr = new Airport();
                lhr.setId("airport-4");
                lhr.setName("London Heathrow Airport");
                lhr.setIataCode("LHR");
                lhr.setCity("London");
                lhr.setCountryId("country-2");
                mockAirports.add(lhr);
            } else if ("country-3".equals(countryId)) { // France
                Airport cdg = new Airport();
                cdg.setId("airport-5");
                cdg.setName("Charles de Gaulle Airport");
                cdg.setIataCode("CDG");
                cdg.setCity("Paris");
                cdg.setCountryId("country-3");
                mockAirports.add(cdg);
            } else if ("country-8".equals(countryId)) { // India
                Airport bom = new Airport();
                bom.setId("airport-6");
                bom.setName("Chhatrapati Shivaji Maharaj International Airport");
                bom.setIataCode("BOM");
                bom.setCity("Mumbai");
                bom.setCountryId("country-8");
                mockAirports.add(bom);
                
                Airport blr = new Airport();
                blr.setId("airport-7");
                blr.setName("Kempegowda International Airport");
                blr.setIataCode("BLR");
                blr.setCity("Bangalore");
                blr.setCountryId("country-8");
                mockAirports.add(blr);
            }
            
            return mockAirports;
        }
    }
    
    public List<Airport> getAirportsByState(String stateId) {
        try {
            return airportRepository.findByStateId(stateId);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<Airport> mockAirports = new ArrayList<>();
            
            // Add some mock airports based on state
            if ("state-1".equals(stateId)) { // California
                Airport lax = new Airport();
                lax.setId("airport-1");
                lax.setName("Los Angeles International Airport");
                lax.setIataCode("LAX");
                lax.setCity("Los Angeles");
                lax.setStateId("state-1");
                lax.setCountryId("country-1");
                mockAirports.add(lax);
                
                Airport sfo = new Airport();
                sfo.setId("airport-8");
                sfo.setName("San Francisco International Airport");
                sfo.setIataCode("SFO");
                sfo.setCity("San Francisco");
                sfo.setStateId("state-1");
                sfo.setCountryId("country-1");
                mockAirports.add(sfo);
            } else if ("state-2".equals(stateId)) { // New York
                Airport jfk = new Airport();
                jfk.setId("airport-2");
                jfk.setName("John F. Kennedy International Airport");
                jfk.setIataCode("JFK");
                jfk.setCity("New York");
                jfk.setStateId("state-2");
                jfk.setCountryId("country-1");
                mockAirports.add(jfk);
                
                Airport lga = new Airport();
                lga.setId("airport-9");
                lga.setName("LaGuardia Airport");
                lga.setIataCode("LGA");
                lga.setCity("New York");
                lga.setStateId("state-2");
                lga.setCountryId("country-1");
                mockAirports.add(lga);
            } else if ("state-7".equals(stateId)) { // Maharashtra
                Airport bom = new Airport();
                bom.setId("airport-6");
                bom.setName("Chhatrapati Shivaji Maharaj International Airport");
                bom.setIataCode("BOM");
                bom.setCity("Mumbai");
                bom.setStateId("state-7");
                bom.setCountryId("country-8");
                mockAirports.add(bom);
            } else if ("state-8".equals(stateId)) { // Karnataka
                Airport blr = new Airport();
                blr.setId("airport-7");
                blr.setName("Kempegowda International Airport");
                blr.setIataCode("BLR");
                blr.setCity("Bangalore");
                blr.setStateId("state-8");
                blr.setCountryId("country-8");
                mockAirports.add(blr);
            }
            
            return mockAirports;
        }
    }
    
    public List<Airport> searchAirportsByName(String name) {
        try {
            return airportRepository.findByNameContainingIgnoreCase(name);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<Airport> mockAirports = new ArrayList<>();
            
            // Add some mock airports for search
            Airport lax = new Airport();
            lax.setId("airport-1");
            lax.setName("Los Angeles International Airport");
            lax.setIataCode("LAX");
            lax.setCity("Los Angeles");
            lax.setCountryId("country-1");
            mockAirports.add(lax);
            
            Airport jfk = new Airport();
            jfk.setId("airport-2");
            jfk.setName("John F. Kennedy International Airport");
            jfk.setIataCode("JFK");
            jfk.setCity("New York");
            jfk.setCountryId("country-1");
            mockAirports.add(jfk);
            
            Airport lhr = new Airport();
            lhr.setId("airport-4");
            lhr.setName("London Heathrow Airport");
            lhr.setIataCode("LHR");
            lhr.setCity("London");
            lhr.setCountryId("country-2");
            mockAirports.add(lhr);
            
            Airport cdg = new Airport();
            cdg.setId("airport-5");
            cdg.setName("Charles de Gaulle Airport");
            cdg.setIataCode("CDG");
            cdg.setCity("Paris");
            cdg.setCountryId("country-3");
            mockAirports.add(cdg);
            
            Airport bom = new Airport();
            bom.setId("airport-6");
            bom.setName("Chhatrapati Shivaji Maharaj International Airport");
            bom.setIataCode("BOM");
            bom.setCity("Mumbai");
            bom.setCountryId("country-8");
            mockAirports.add(bom);
            
            // Filter based on search term
            return mockAirports.stream()
                .filter(airport -> airport.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
        }
    }
    
    public List<Airport> searchAirportsByCity(String city) {
        try {
            return airportRepository.findByCityContainingIgnoreCase(city);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<Airport> mockAirports = new ArrayList<>();
            
            // Add some mock airports for search
            Airport lax = new Airport();
            lax.setId("airport-1");
            lax.setName("Los Angeles International Airport");
            lax.setIataCode("LAX");
            lax.setCity("Los Angeles");
            lax.setCountryId("country-1");
            mockAirports.add(lax);
            
            Airport jfk = new Airport();
            jfk.setId("airport-2");
            jfk.setName("John F. Kennedy International Airport");
            jfk.setIataCode("JFK");
            jfk.setCity("New York");
            jfk.setCountryId("country-1");
            mockAirports.add(jfk);
            
            Airport lhr = new Airport();
            lhr.setId("airport-4");
            lhr.setName("London Heathrow Airport");
            lhr.setIataCode("LHR");
            lhr.setCity("London");
            lhr.setCountryId("country-2");
            mockAirports.add(lhr);
            
            Airport cdg = new Airport();
            cdg.setId("airport-5");
            cdg.setName("Charles de Gaulle Airport");
            cdg.setIataCode("CDG");
            cdg.setCity("Paris");
            cdg.setCountryId("country-3");
            mockAirports.add(cdg);
            
            Airport bom = new Airport();
            bom.setId("airport-6");
            bom.setName("Chhatrapati Shivaji Maharaj International Airport");
            bom.setIataCode("BOM");
            bom.setCity("Mumbai");
            bom.setCountryId("country-8");
            mockAirports.add(bom);
            
            Airport blr = new Airport();
            blr.setId("airport-7");
            blr.setName("Kempegowda International Airport");
            blr.setIataCode("BLR");
            blr.setCity("Bangalore");
            blr.setCountryId("country-8");
            mockAirports.add(blr);
            
            // Filter based on search term
            return mockAirports.stream()
                .filter(airport -> airport.getCity().toLowerCase().contains(city.toLowerCase()))
                .collect(Collectors.toList());
        }
    }
    
    public Airport getAirportByIataCode(String iataCode) {
        try {
            return airportRepository.findByIataCode(iataCode).orElse(null);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            // Create mock airports based on IATA code
            switch (iataCode.toUpperCase()) {
                case "LAX":
                    Airport lax = new Airport();
                    lax.setId("airport-1");
                    lax.setName("Los Angeles International Airport");
                    lax.setIataCode("LAX");
                    lax.setCity("Los Angeles");
                    lax.setCountryId("country-1");
                    return lax;
                case "JFK":
                    Airport jfk = new Airport();
                    jfk.setId("airport-2");
                    jfk.setName("John F. Kennedy International Airport");
                    jfk.setIataCode("JFK");
                    jfk.setCity("New York");
                    jfk.setCountryId("country-1");
                    return jfk;
                case "LHR":
                    Airport lhr = new Airport();
                    lhr.setId("airport-4");
                    lhr.setName("London Heathrow Airport");
                    lhr.setIataCode("LHR");
                    lhr.setCity("London");
                    lhr.setCountryId("country-2");
                    return lhr;
                case "CDG":
                    Airport cdg = new Airport();
                    cdg.setId("airport-5");
                    cdg.setName("Charles de Gaulle Airport");
                    cdg.setIataCode("CDG");
                    cdg.setCity("Paris");
                    cdg.setCountryId("country-3");
                    return cdg;
                case "BOM":
                    Airport bom = new Airport();
                    bom.setId("airport-6");
                    bom.setName("Chhatrapati Shivaji Maharaj International Airport");
                    bom.setIataCode("BOM");
                    bom.setCity("Mumbai");
                    bom.setCountryId("country-8");
                    return bom;
                case "BLR":
                    Airport blr = new Airport();
                    blr.setId("airport-7");
                    blr.setName("Kempegowda International Airport");
                    blr.setIataCode("BLR");
                    blr.setCity("Bangalore");
                    blr.setCountryId("country-8");
                    return blr;
                default:
                    return null;
            }
        }
    }
    
    public Country getCountryById(String countryId) {
        try {
            return countryRepository.findById(countryId).orElse(null);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            return null;
        }
    }
    
    public State getStateById(String stateId) {
        try {
            return stateRepository.findById(stateId).orElse(null);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            return null;
        }
    }
    
    public List<State> getStatesByCountry(String countryId) {
        try {
            return stateRepository.findByCountryId(countryId);
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<State> mockStates = new ArrayList<>();
            
            // Add some mock states based on country
            if ("country-1".equals(countryId)) { // United States
                State california = new State();
                california.setId("state-1");
                california.setName("California");
                california.setCountryId("country-1");
                mockStates.add(california);
                
                State newYork = new State();
                newYork.setId("state-2");
                newYork.setName("New York");
                newYork.setCountryId("country-1");
                mockStates.add(newYork);
                
                State texas = new State();
                texas.setId("state-3");
                texas.setName("Texas");
                texas.setCountryId("country-1");
                mockStates.add(texas);
            } else if ("country-2".equals(countryId)) { // United Kingdom
                State england = new State();
                england.setId("state-4");
                england.setName("England");
                england.setCountryId("country-2");
                mockStates.add(england);
                
                State scotland = new State();
                scotland.setId("state-5");
                scotland.setName("Scotland");
                scotland.setCountryId("country-2");
                mockStates.add(scotland);
            } else if ("country-3".equals(countryId)) { // France
                State ileDeFrance = new State();
                ileDeFrance.setId("state-6");
                ileDeFrance.setName("Île-de-France");
                ileDeFrance.setCountryId("country-3");
                mockStates.add(ileDeFrance);
            } else if ("country-8".equals(countryId)) { // India
                State maharashtra = new State();
                maharashtra.setId("state-7");
                maharashtra.setName("Maharashtra");
                maharashtra.setCountryId("country-8");
                mockStates.add(maharashtra);
                
                State karnataka = new State();
                karnataka.setId("state-8");
                karnataka.setName("Karnataka");
                karnataka.setCountryId("country-8");
                mockStates.add(karnataka);
            }
            
            return mockStates;
        }
    }
    
    public List<Country> getAllCountries() {
        try {
            return countryRepository.findAll();
        } catch (DataAccessResourceFailureException e) {
            // Return mock data when database is not available
            List<Country> mockCountries = new ArrayList<>();
            
            // Add some mock countries for development
            Country usa = new Country();
            usa.setId("country-1");
            usa.setName("United States");
            usa.setCode("US");
            mockCountries.add(usa);
            
            Country uk = new Country();
            uk.setId("country-2");
            uk.setName("United Kingdom");
            uk.setCode("GB");
            mockCountries.add(uk);
            
            Country france = new Country();
            france.setId("country-3");
            france.setName("France");
            france.setCode("FR");
            mockCountries.add(france);
            
            Country germany = new Country();
            germany.setId("country-4");
            germany.setName("Germany");
            germany.setCode("DE");
            mockCountries.add(germany);
            
            Country japan = new Country();
            japan.setId("country-5");
            japan.setName("Japan");
            japan.setCode("JP");
            mockCountries.add(japan);
            
            Country canada = new Country();
            canada.setId("country-6");
            canada.setName("Canada");
            canada.setCode("CA");
            mockCountries.add(canada);
            
            Country australia = new Country();
            australia.setId("country-7");
            australia.setName("Australia");
            australia.setCode("AU");
            mockCountries.add(australia);
            
            Country india = new Country();
            india.setId("country-8");
            india.setName("India");
            india.setCode("IN");
            mockCountries.add(india);
            
            return mockCountries;
        }
    }
}