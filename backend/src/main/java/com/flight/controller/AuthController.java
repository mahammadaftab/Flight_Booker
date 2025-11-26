package com.flight.controller;

import com.flight.dto.JwtAuthResponse;
import com.flight.dto.LoginDto;
import com.flight.dto.RefreshTokenDto;
import com.flight.dto.SignUpDto;
import com.flight.entity.User;
import com.flight.security.AdminOnly;
import com.flight.service.AuthenticationService;
import com.flight.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto) {
        String accessToken = authenticationService.authenticateUser(loginDto.getEmail(), loginDto.getPassword());
        String refreshToken = authenticationService.generateRefreshToken(loginDto.getEmail());
        
        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(accessToken);
        jwtAuthResponse.setRefreshToken(refreshToken);
        
        return ResponseEntity.ok(jwtAuthResponse);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpDto signUpDto) {
        // Check if user already exists
        if (userService.existsByEmail(signUpDto.getEmail())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }
        
        // Create user
        User user = userService.createUser(
                signUpDto.getFirstName(),
                signUpDto.getLastName(),
                signUpDto.getEmail(),
                signUpDto.getPassword()
        );
        
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
    
    @AdminOnly
    @PostMapping("/admin/signup")
    public ResponseEntity<?> adminSignup(@RequestBody SignUpDto signUpDto) {
        // Check if user already exists
        if (userService.existsByEmail(signUpDto.getEmail())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }
        
        // Create admin user
        User user = userService.createAdminUser(
                signUpDto.getFirstName(),
                signUpDto.getLastName(),
                signUpDto.getEmail(),
                signUpDto.getPassword()
        );
        
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(@RequestBody RefreshTokenDto refreshTokenDto) {
        try {
            String accessToken = authenticationService.refreshAccessToken(refreshTokenDto.getRefreshToken());
            
            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(accessToken);
            jwtAuthResponse.setRefreshToken(refreshTokenDto.getRefreshToken());
            
            return ResponseEntity.ok(jwtAuthResponse);
        } catch (Exception e) {
            return new ResponseEntity<>(new JwtAuthResponse(""), HttpStatus.UNAUTHORIZED);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String refreshToken = authHeader.substring(7);
            authenticationService.logout(refreshToken);
        }
        return ResponseEntity.ok("Logged out successfully");
    }
}