import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

const rooms = new Map();
const starterCode = `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const needed = target - nums[i];

    if (seen.has(needed)) {
      return [seen.get(needed), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}`;

const getRoom = (roomId, password = '') => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            code: starterCode,
            language: 'javascript',
            password,
            users: new Map(),
        });
    }

    return rooms.get(roomId);
};

const getUsers = (room) => Array.from(room.users.values());

io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, userName, password }) => {
        if (!roomId) return;

        const normalizedRoomId = roomId.trim().toUpperCase();
        const roomPassword = password?.trim() || '';
        const existingRoom = rooms.get(normalizedRoomId);

        if (existingRoom?.password && existingRoom.password !== roomPassword) {
            socket.emit('join-error', 'Invalid room password.');
            return;
        }

        const room = getRoom(normalizedRoomId, roomPassword);
        const displayName = userName?.trim() || 'Guest';

        socket.join(normalizedRoomId);
        socket.data.roomId = normalizedRoomId;
        socket.data.userName = displayName;

        room.users.set(socket.id, {
            id: socket.id,
            name: displayName,
        });

        socket.emit('room-state', {
            code: room.code,
            language: room.language,
            users: getUsers(room),
        });

        socket.to(normalizedRoomId).emit('users-update', getUsers(room));
    });

    socket.on('code-change', ({ roomId, code }) => {
        const room = rooms.get(roomId);
        if (!room || typeof code !== 'string') return;

        room.code = code;
        socket.to(roomId).emit('code-update', code);
    });

    socket.on('language-change', ({ roomId, language }) => {
        const room = rooms.get(roomId);
        if (!room || typeof language !== 'string') return;

        room.language = language;
        socket.to(roomId).emit('language-update', language);
    });

    socket.on('disconnect', () => {
        const { roomId } = socket.data;
        const room = rooms.get(roomId);

        if (!room) return;

        room.users.delete(socket.id);

        if (room.users.size === 0) {
            rooms.delete(roomId);
            return;
        }

        socket.to(roomId).emit('users-update', getUsers(room));
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, console.log(`Server running on port ${PORT}`));
