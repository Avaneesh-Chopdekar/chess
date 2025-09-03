import 'dotenv/config';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { User } from './user.model';

const JWT_SECRET = process.env.JWT_SECRET || randomUUID().toString();

// TODO: Add zod validation for request bodies

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hash(password);

    const user = new User({
      name: name || 'Anonymous',
      email: email,
      password: hashedPassword,
    });
    await user.save();

    console.log(`User registered: ${user}`);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

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

  await User.updateOne(
    { _id: user.id },
    { $push: { refreshTokens: { token: refreshToken } } },
  );

  return res.status(200).json({ accessToken, refreshToken, userId: user.id });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userWithToken = await User.findOne({
    'refreshTokens.token': refreshToken,
  });
  const storedToken = userWithToken
    ? userWithToken.refreshTokens.find((t) => t.token === refreshToken)
    : null;

  if (!storedToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { userId } = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: string;
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '15m',
    });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await User.updateOne(
      { 'refreshTokens.token': refreshToken },
      { $set: { 'refreshTokens.$.token': newRefreshToken } },
    );

    return res
      .status(200)
      .json({ accessToken, refreshToken: newRefreshToken, userId: user.id });
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

  await User.updateOne(
    { 'refreshTokens.token': refreshToken },
    { $pull: { refreshTokens: { token: refreshToken } } },
  );

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

    const user = await User.findById(userId).select('-password -refreshTokens');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json(user);
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await User.deleteOne({ _id: userId });
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
