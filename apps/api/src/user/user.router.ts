import { Router } from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getCurrentUser,
  deleteUser,
} from './user.controller';

const userRouter: Router = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/refresh', refresh);
userRouter.get('/me', getCurrentUser);
userRouter.delete('/me', deleteUser);

export default userRouter;
