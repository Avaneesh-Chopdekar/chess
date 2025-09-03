/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'dotenv/config';
import express from 'express';
import * as path from 'path';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { GameManager } from './game/manager';
import userRouter from './user/user.router';
import connectDB from './db';

const app = express();

connectDB();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

app.use(cors());

app.use('/api/v1/user', userRouter);

app.get('/api/v1/health-check', (req, res) => {
  res.send({ status: 'healthy' });
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/v1`);
});

const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);

  ws.on('close', () => {
    gameManager.removeUser(ws);
  });
});

server.on('error', console.error);
