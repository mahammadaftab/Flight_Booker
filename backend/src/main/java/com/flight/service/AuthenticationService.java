package com.flight.service;

import com.flight.entity.RefreshToken;
import com.flight.entity.User;
import com.flight.repository.RefreshTokenRepository;
import com.flight.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    
    public String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        return jwtTokenProvider.generateToken(authentication);
    }
    
    public String generateRefreshToken(String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Delete existing refresh token for this user
        refreshTokenRepository.deleteByUserId(user.getId());
        
        // Generate new refresh token
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null);
        String refreshTokenString = jwtTokenProvider.generateRefreshToken(authentication);
        
        // Save refresh token to database
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setToken(refreshTokenString);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7)); // 7 days expiry
        
        refreshTokenRepository.save(refreshToken);
        
        return refreshTokenString;
    }
    
    public String refreshAccessToken(String refreshTokenString) {
        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshTokenString)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        // Get username from refresh token
        String username = jwtTokenProvider.getUsername(refreshTokenString);
        
        // Check if refresh token exists in database
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByToken(refreshTokenString);
        if (!refreshTokenOpt.isPresent()) {
            throw new RuntimeException("Refresh token not found");
        }
        
        RefreshToken refreshToken = refreshTokenOpt.get();
        
        // Check if refresh token is expired
        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }
        
        // Generate new access token
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null);
        return jwtTokenProvider.generateToken(authentication);
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }
    
    public void logout(String refreshTokenString) {
        // Delete refresh token from database
        refreshTokenRepository.findByToken(refreshTokenString)
                .ifPresent(refreshTokenRepository::delete);
    }
}