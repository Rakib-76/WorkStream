// "use client";
// import { io } from "socket.io-client";
// import { useEffect, useState, createContext, useContext } from "react";

// const SocketContext = createContext();

// export const SocketProvider = ({ children }) => {
//     const [socket, setSocket] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         const newSocket = io("http://localhost:3000", { path: "/api/socket" });
//         setSocket(newSocket);

//         // ✅ Listen for messages
//         newSocket.on("receive-message", (data) => {
//             setMessages((prev) => [...prev, data]);
//         });

//         // ✅ Listen for notifications
//         newSocket.on("receive-notification", (notif) => {
//             setNotifications((prev) => [...prev, notif]);
//         });

//         return () => newSocket.disconnect();
//     }, []);

//     return (
//         <SocketContext.Provider value={{ socket, messages, notifications }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSocket = () => useContext(SocketContext);


"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", { path: "/api/socket" });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
