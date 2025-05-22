import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
  }

  connect(onConnect, onError) {
    const socket = new SockJS("http://localhost:8080/ws");
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log("Connected to WebSocket");
      if (onConnect) onConnect(frame);
    };

    this.stompClient.onStompError = (frame) => {
      console.error("STOMP error", frame);
      if (onError) onError(frame);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  subscribeToBroadcastNotifications(callback) {
    if (!this.stompClient || !this.stompClient.connected) {
      throw new Error("WebSocket is not connected");
    }

    const subscription = this.stompClient.subscribe(
      "/topic/notifications",
      (message) => {
        const notification = JSON.parse(message.body);
        callback(notification);
      }
    );

    this.subscriptions.set("broadcast", subscription);
  }

  subscribeToPersonalNotifications(username, callback) {
    if (!this.stompClient || !this.stompClient.connected) {
      throw new Error("WebSocket is not connected");
    }

    const subscription = this.stompClient.subscribe(
      `/user/${username}/queue/notifications`,
      (message) => {
        const notification = JSON.parse(message.body);
        callback(notification);
      }
    );

    this.subscriptions.set("personal", subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  sendTestMessage(username) {
    if (!this.stompClient || !this.stompClient.connected) {
      throw new Error("WebSocket is not connected");
    }

    this.stompClient.publish({
      destination: "/app/test-connect",
      body: JSON.stringify({
        sender: username,
        content: "Test connection",
      }),
    });
  }

  sendNotification(notification) {
    if (!this.stompClient || !this.stompClient.connected) {
      throw new Error("WebSocket is not connected");
    }

    this.stompClient.publish({
      destination: "/app/notifications",
      body: JSON.stringify(notification),
    });
  }
}

export const websocketService = new WebSocketService();
