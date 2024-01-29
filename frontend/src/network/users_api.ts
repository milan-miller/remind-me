import { User } from '../models/user';
import { fetchData } from './api';

export async function getLoggedInUser(): Promise<User> {
	const response = await fetchData('/api/users', {
		method: 'GET',
	});

	return response.json();
}

export interface RegisterCredentials {
	username: string;
	email: string;
	password: string;
}

export async function register(
	credentials: RegisterCredentials
): Promise<User> {
	const response = await fetchData('/api/users/register', {
		method: 'POST',

		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	});
	return response.json();
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
	const response = await fetchData('/api/users/login', {
		method: 'POST',

		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	});
	return response.json();
}

export async function logout() {
	await fetchData('/api/users/logout', {
		method: 'POST',
	});
}
