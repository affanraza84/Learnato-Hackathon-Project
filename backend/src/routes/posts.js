require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log('Websocket connected -> ID:', socket.id);

    socket.on('disconnect', () => {
        console.log('Websocket disconnected -> ID:', socket.id);
    });
});

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

const postsRouterFactory = require('./routes/posts');
app.use('/api/posts', postsRouterFactory(io));

app.get('/health', (req, res) => res.send("OK"));
app.get('/', (req, res) => res.send({ ok: true, message: 'Learnato Forum API' }));

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
            console.log(`Allowed Origin: ${FRONTEND_URL}`);
            console.log(`MongoDB Connected Successfully`);
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });
