import { io } from "socket.io-client";

const URL = "https://server-discord-clone.adaptable.app/socket/message";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});
