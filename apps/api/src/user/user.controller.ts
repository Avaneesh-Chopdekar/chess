import 'dotenv/config';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || randomUUID();

// TODO: Add zod validation for request bodies

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.json(user).status(201);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await verify(user.password, password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  });

  return res.json({ accessToken, refreshToken, userId: user.id }).status(200);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '15m',
    });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
      },
      data: {
        token: newRefreshToken,
      },
    });

    return res
      .json({ accessToken, refreshToken: newRefreshToken, userId: user.id })
      .status(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body || req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });

  return res.status(200).json({ message: 'Logout successful' });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json(user).status(200);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
