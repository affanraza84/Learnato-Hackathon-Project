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
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/learnato_forum';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const io = new Server(server, {
    cors: { origin: CORS_ORIGIN, methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

const postsRouterFactory = require('./routes/posts');
app.use('/api/posts', postsRouterFactory(io));

app.get('/', (req, res) => res.send({ ok: true, message: 'Learnato Forum API' }));

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Connected to mongoDB successfully`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });
