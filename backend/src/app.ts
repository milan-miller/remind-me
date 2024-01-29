import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import notesRoutes from './routes/notes';
import usersRoutes from './routes/users';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import env from './utils/validate_env';
import MongoStore from 'connect-mongo';
import { isAuth } from './middleware/auth';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(
	cors({
		origin: ['http://localhost:3000', 'https://remind-me-lilac.vercel.app'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
);

app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 1000 * 24 * 7,
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		},
		rolling: true,
		store: MongoStore.create({
			mongoUrl: env.MONGO_CONNECTION_STRING,
		}),
	})
);

app.use('/api/users', usersRoutes);
app.use('/api/notes', isAuth, notesRoutes);

app.use((req, res, next) => {
	next(createHttpError(404, 'Endpoint not found'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	let errorMessage = 'An unknown error occured';

	let statusCode = 500;

	if (isHttpError(error)) {
		statusCode = error.status;
		errorMessage = error.message;
	}

	res.status(statusCode).json({ error: errorMessage });
	next();
});

export default app;
