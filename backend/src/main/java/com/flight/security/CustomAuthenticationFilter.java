package com.flight.security;

import com.flight.service.LoginAttemptService;
import com.flight.util.HttpRequestUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    
    @Autowired
    private LoginAttemptService loginAttemptService;
    
    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        setAuthenticationManager(authenticationManager);
    }
    
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) 
            throws AuthenticationException {
        
        String username = obtainUsername(request);
        String password = obtainPassword(request);
        String ipAddress = HttpRequestUtil.getClientIpAddress(request);
        
        // Check if user/IP is blocked
        if (loginAttemptService.isBlocked(ipAddress, username) || loginAttemptService.isIpAddressBlocked(ipAddress)) {
            throw new RuntimeException("Account is temporarily blocked due to multiple failed login attempts");
        }
        
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);
        return getAuthenticationManager().authenticate(authToken);
    }
    
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, 
                                          FilterChain chain, Authentication authResult) throws IOException, ServletException {
        
        String username = authResult.getName();
        String ipAddress = HttpRequestUtil.getClientIpAddress(request);
        
        // Reset login attempts on successful login
        loginAttemptService.loginSucceeded(ipAddress, username);
        
        super.successfulAuthentication(request, response, chain, authResult);
    }
    
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, 
                                            AuthenticationException failed) throws IOException, ServletException {
        
        String username = obtainUsername(request);
        String ipAddress = HttpRequestUtil.getClientIpAddress(request);
        
        // Record failed login attempt
        loginAttemptService.loginFailed(ipAddress, username);
        
        super.unsuccessfulAuthentication(request, response, failed);
    }
}