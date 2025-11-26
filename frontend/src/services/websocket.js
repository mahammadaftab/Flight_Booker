import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(onConnectCallback, onErrorCallback) {
    if (this.connected) {
      return;
    }

    // Create STOMP client
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // Update with your backend WebSocket URL
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.connected = true;
      if (onConnectCallback) {
        onConnectCallback(frame);
      }
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      this.connected = false;
      if (onErrorCallback) {
        onErrorCallback(frame);
      }
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  subscribeToSeatUpdates(flightId, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/seat-updates/${flightId}`,
      (message) => {
        if (message.body) {
          try {
            const seatUpdate = JSON.parse(message.body);
            callback(seatUpdate);
          } catch (error) {
            console.error('Error parsing seat update:', error);
          }
        }
      }
    );

    // Store subscription for later cleanup
    this.subscriptions.set(`seat-updates-${flightId}`, subscription);
    return subscription;
  }

  subscribeToFlightStatusUpdates(flightId, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/flight-status-updates/${flightId}`,
      (message) => {
        if (message.body) {
          try {
            const statusUpdate = JSON.parse(message.body);
            callback(statusUpdate);
          } catch (error) {
            console.error('Error parsing flight status update:', error);
          }
        }
      }
    );

    // Store subscription for later cleanup
    this.subscriptions.set(`flight-status-updates-${flightId}`, subscription);
    return subscription;
  }

  subscribeToFlightPriceUpdates(flightId, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/flight-price-updates/${flightId}`,
      (message) => {
        if (message.body) {
          try {
            const priceUpdate = JSON.parse(message.body);
            callback(priceUpdate);
          } catch (error) {
            console.error('Error parsing flight price update:', error);
          }
        }
      }
    );

    // Store subscription for later cleanup
    this.subscriptions.set(`flight-price-updates-${flightId}`, subscription);
    return subscription;
  }

  subscribeToBookingConfirmations(userId, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/booking-confirmations/${userId}`,
      (message) => {
        if (message.body) {
          try {
            const bookingConfirmation = JSON.parse(message.body);
            callback(bookingConfirmation);
          } catch (error) {
            console.error('Error parsing booking confirmation:', error);
          }
        }
      }
    );

    // Store subscription for later cleanup
    this.subscriptions.set(`booking-confirmations-${userId}`, subscription);
    return subscription;
  }

  unsubscribe(subscriptionKey) {
    if (this.subscriptions.has(subscriptionKey)) {
      const subscription = this.subscriptions.get(subscriptionKey);
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  sendSeatUpdate(flightId, seat) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    // Send message in the format expected by the backend
    const message = {
      flightId: flightId,
      seat: seat
    };

    this.client.publish({
      destination: '/app/seat-update',
      body: JSON.stringify(message),
    });
  }

  sendFlightStatusUpdate(flightId, status) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    // Send message in the format expected by the backend
    const message = {
      flightId: flightId,
      status: status
    };

    this.client.publish({
      destination: '/app/flight-status-update',
      body: JSON.stringify(message),
    });
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;