import { useState, useEffect, useRef } from 'react';
import webSocketService from '../services/websocket';

// Custom hook for WebSocket connection management
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionsRef = useRef(new Map());

  useEffect(() => {
    // Connect to WebSocket
    webSocketService.connect(
      (frame) => {
        console.log('Connected to WebSocket:', frame);
        setConnected(true);
        setError(null);
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        setError(error);
      }
    );

    // Cleanup function
    return () => {
      // Unsubscribe from all subscriptions
      subscriptionsRef.current.forEach((subscription, key) => {
        webSocketService.unsubscribe(key);
      });
      subscriptionsRef.current.clear();
      
      // Disconnect from WebSocket
      webSocketService.disconnect();
    };
  }, []);

  const subscribeToSeatUpdates = (flightId, callback) => {
    if (!connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscriptionKey = `seat-updates-${flightId}`;
    const subscription = webSocketService.subscribeToSeatUpdates(flightId, callback);
    
    // Store subscription for later cleanup
    subscriptionsRef.current.set(subscriptionKey, subscription);
    
    return subscription;
  };

  const subscribeToFlightStatusUpdates = (flightId, callback) => {
    if (!connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscriptionKey = `flight-status-updates-${flightId}`;
    const subscription = webSocketService.subscribeToFlightStatusUpdates(flightId, callback);
    
    // Store subscription for later cleanup
    subscriptionsRef.current.set(subscriptionKey, subscription);
    
    return subscription;
  };

  const subscribeToFlightPriceUpdates = (flightId, callback) => {
    if (!connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscriptionKey = `flight-price-updates-${flightId}`;
    const subscription = webSocketService.subscribeToFlightPriceUpdates(flightId, callback);
    
    // Store subscription for later cleanup
    subscriptionsRef.current.set(subscriptionKey, subscription);
    
    return subscription;
  };

  const subscribeToBookingConfirmations = (userId, callback) => {
    if (!connected) {
      console.error('WebSocket not connected');
      return;
    }

    const subscriptionKey = `booking-confirmations-${userId}`;
    const subscription = webSocketService.subscribeToBookingConfirmations(userId, callback);
    
    // Store subscription for later cleanup
    subscriptionsRef.current.set(subscriptionKey, subscription);
    
    return subscription;
  };

  const unsubscribe = (subscriptionKey) => {
    if (subscriptionsRef.current.has(subscriptionKey)) {
      webSocketService.unsubscribe(subscriptionKey);
      subscriptionsRef.current.delete(subscriptionKey);
    }
  };

  return {
    connected,
    error,
    subscribeToSeatUpdates,
    subscribeToFlightStatusUpdates,
    subscribeToFlightPriceUpdates,
    subscribeToBookingConfirmations,
    unsubscribe
  };
};

export default useWebSocket;