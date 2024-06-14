import { Server } from "socket.io";
const messages = [];

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", (socket) => {
        console.log("Socket connected");

        socket.on("refresh-data", (data) => {
            const { user, message } = data;

            messages.push({ user, message });

            serverSocket.emit("message-logs", { messages });
        });
    });
    return serverSocket;
};

export default {
    config,
};