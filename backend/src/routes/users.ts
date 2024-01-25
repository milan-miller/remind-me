import express from 'express';
import * as UserController from '../controllers/users';
import { isAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', isAuth, UserController.getAuthenticatedUser);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default router;
