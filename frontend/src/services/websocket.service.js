import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const websocketService = {
  connect: (onConnected, onError) => {
    const socket = new SockJS(
      "https://dormitory-management-backend.onrender.com/ws"
    );
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: onConnected,
      onStompError: onError,
    });

    stompClient.activate();
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate();
    }
  },

  subscribeToBroadcastNotifications: (callback) => {
    if (stompClient) {
      stompClient.subscribe("/topic/notifications", (message) => {
        const notification = JSON.parse(message.body);
        callback(notification);
      });
    }
  },

  subscribeToPersonalNotifications: (username, callback) => {
    if (stompClient) {
      stompClient.subscribe(
        `/user/${username}/queue/notifications`,
        (message) => {
          const notification = JSON.parse(message.body);
          callback(notification);
        }
      );
    }
  },

  sendTestMessage: (username) => {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/test",
        body: JSON.stringify({ username }),
      });
    }
  },
};
