import { io, type Socket } from "socket.io-client";

// Sans URL, socket.io-client se connecte à la même origine que la page,
// sur le chemin /socket.io/ :
//   - en prod : https://localhost/socket.io/ → nginx → backend:3000
//   - en dev  : http://localhost:5173/socket.io/ → proxy Vite → localhost:3000
// Il passe tout seul en wss:// quand la page est en https://.
export const socket: Socket = io({ autoConnect: false });
