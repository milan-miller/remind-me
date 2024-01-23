import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;

	try {
		if (!authenticatedUserId) {
			throw createHttpError(401, 'User not authenticated');
		}

		const user = await UserModel.findById(authenticatedUserId)
			.select('+email')
			.exec();

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

interface RegisterBody {
	username?: string;
	email?: string;
	password?: string;
}

export const register: RequestHandler<
	unknown,
	unknown,
	RegisterBody,
	unknown
> = async (req, res, next) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) {
			throw createHttpError(400, 'Please enter all fields');
		}

		const user = await UserModel.findOne({ username }).exec();

		if (user) {
			if (user.username === username || user.email === email) {
				throw createHttpError(409, 'The username or email is already taken');
			}
		}

		const hashedPwd = await bcrypt.hash(password, 12);

		const newUser = await UserModel.create({
			username,
			email,
			password: hashedPwd,
		});

		req.session.userId = newUser._id;

		return res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};

interface LoginBody {
	username?: string;
	password?: string;
}

export const login: RequestHandler<
	unknown,
	unknown,
	LoginBody,
	unknown
> = async (req, res, next) => {
	const { username, password } = req.body;

	try {
		if (!username || !password) {
			throw createHttpError(400, 'Please enter your username and password');
		}

		const user = await UserModel.findOne({ username })
			.select('+password +email')
			.exec();

		if (!user) {
			throw createHttpError(401, 'Invalid credentials');
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);

		if (!passwordIsValid) {
			throw createHttpError(401, 'Invalid credentials');
		}

		req.session.userId = user._id;

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const logout: RequestHandler = (req, res, next) => {
	req.session.destroy((error) => {
		if (error) {
			next(error);
		} else {
			res.sendStatus(200);
		}
	});
};
