/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from "./auth";

const app = express();

app.all("/api/auth/*", toNodeHandler(auth));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,  
}))

app.get('/api/v1/health-check', (req, res) => {
  res.send({ status: 'healthy' });
});

 
app.get("/api/v1/auth/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/v1`);
});
server.on('error', console.error);
