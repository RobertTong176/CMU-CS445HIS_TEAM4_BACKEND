// import { Server } from 'socket.io';
// import jwt from 'jsonwebtoken';

// const adminSockets = new Map(); // Use a Map to store admin sockets
// const userSockets = new Map(); // Use a Map to store user sockets
// let ioInstance;

// const setupSocketIo = (server) => {
//     const io = new Server(server, {
//         cors: {
//             origin: '*', // Allow all origins; you can restrict it to your client URL
//             methods: ['GET', 'POST'],
//             allowedHeaders: ['Authorization'],
//             credentials: true,
//         },
//     });

//     io.use((socket, next) => {
//         const token = socket.handshake.query.token;
//         if (!token) {
//             return next(new Error('Authentication error'));
//         }

//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//             if (err) {
//                 return next(new Error('Authentication error'));
//             }

//             // Assume admin info is stored in `decoded.isAdmin`
//             socket.id = decoded.id;
//             socket.isAdmin = decoded.isAdmin;

//             if (socket.isAdmin) {
//                 if (!adminSockets.has(decoded.id)) {
//                     adminSockets.set(decoded.id, new Set());
//                 }
//                 adminSockets.get(decoded.id).add(socket.id);
//             } else {
//                 if (!userSockets.has(decoded.id)) {
//                     userSockets.set(decoded.id, new Set());
//                 }
//                 userSockets.get(decoded.id).add(socket.id);
//             }

//             next();
//         });
//     });

//     io.on('connection', (socket) => {
//         console.log('New client connected', socket.id);
//         socket.on('disconnect', () => {
//             console.log('Client disconnected', socket.id);
//             if (socket.isAdmin) {
//                 const userSockets = adminSockets.get(socket.id);
//                 if (userSockets) {
//                     userSockets.delete(socket.id);
//                     if (userSockets.size === 0) {
//                         adminSockets.delete(socket.id);
//                     }
//                 }
//             } else {
//                 const userSockets = userSockets.get(socket.id);
//                 if (userSockets) {
//                     userSockets.delete(socket.id);
//                     if (userSockets.size === 0) {
//                         userSockets.delete(socket.id);
//                     }
//                 }
//             }
//         });
//     });

//     ioInstance = io;

//     return io;
// };

// const sendMessageToAdmins = (message) => {
//     if (!ioInstance) {
//         throw new Error('Socket.io is not initialized');
//     }

//     adminSockets.forEach((sockets) => {
//         sockets.forEach((socketId) => {
//             ioInstance.to(socketId).emit('adminNotification', message);
//         });
//     });
// };

// const sendMessage = (message) => {
//     if (!ioInstance) {
//         throw new Error('Socket.io is not initialized');
//     }

//     // Send message to all users
//     userSockets.forEach((sockets) => {
//         sockets.forEach((socketId) => {
//             ioInstance.to(socketId).emit('userNotification', message);
//         });
//     });

//     // Send message to all admins
//     adminSockets.forEach((sockets) => {
//         sockets.forEach((socketId) => {
//             ioInstance.to(socketId).emit('adminNotification', message);
//         });
//     });
// };

// export { setupSocketIo, sendMessageToAdmins, sendMessage };

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const adminSockets = new Map(); // Use a Map to store admin sockets
const userSockets = new Map(); // Use a Map to store user sockets
let ioInstance;

const setupSocketIo = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins; you can restrict it to your client URL
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }

            // Assume admin info is stored in `decoded.isAdmin`
            socket.userId = decoded.userId;
            socket.isAdmin = decoded.isAdmin;

            if (socket.isAdmin) {
                if (!adminSockets.has(decoded.userId)) {
                    adminSockets.set(decoded.userId, new Set());
                }
                adminSockets.get(decoded.userId).add(socket.id);
            } else {
                if (!userSockets.has(decoded.userId)) {
                    userSockets.set(decoded.userId, new Set());
                }
                userSockets.get(decoded.userId).add(socket.id);
            }

            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
            if (socket.isAdmin) {
                const userSockets = adminSockets.get(socket.userId);
                if (userSockets) {
                    userSockets.delete(socket.id);
                    if (userSockets.size === 0) {
                        adminSockets.delete(socket.userId);
                    }
                }
            } else {
                const userSockets2 = userSockets.get(socket.userId);
                if (userSockets2) {
                    userSockets2.delete(socket.id);
                    if (userSockets2.size === 0) {
                        userSockets2.delete(socket.userId);
                    }
                }
            }
        });
    });

    ioInstance = io;

    return io;
};

const sendMessageToAdmins = (message) => {
    if (!ioInstance) {
        throw new Error('Socket.io is not initialized');
    }

    adminSockets.forEach((sockets) => {
        sockets.forEach((socketId) => {
            ioInstance.to(socketId).emit('adminNotification', message);
        });
    });
};

const sendMessage = (message) => {
    if (!ioInstance) {
        throw new Error('Socket.io is not initialized');
    }

    // Send message to all users
    userSockets.forEach((sockets) => {
        sockets.forEach((socketId) => {
            ioInstance.to(socketId).emit('userNotification', message);
        });
    });

    // Send message to all admins
    adminSockets.forEach((sockets) => {
        sockets.forEach((socketId) => {
            ioInstance.to(socketId).emit('adminNotification', message);
        });
    });
};

export { setupSocketIo, sendMessageToAdmins, sendMessage };
