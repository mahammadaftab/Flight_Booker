package com.flight.service;

import com.flight.entity.User;
import com.flight.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(String firstName, String lastName, String email, String password) {
        return createUser(firstName, lastName, email, password, false);
    }
    
    public User createAdminUser(String firstName, String lastName, String email, String password) {
        return createUser(firstName, lastName, email, password, true);
    }
    
    private User createUser(String firstName, String lastName, String email, String password, boolean isAdmin) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        Set<String> roles = new HashSet<>();
        if (isAdmin) {
            roles.add("ADMIN");
        } else {
            roles.add("USER");
        }
        user.setRoles(roles);
        
        return userRepository.save(user);
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}