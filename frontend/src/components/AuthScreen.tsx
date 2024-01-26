import { useEffect, useState } from 'react';
import * as UsersApi from '../network/users_api';
import { User } from '../models/user';
import styles from '../styles/AuthScreen.module.css';
import { ReactComponent as Eye } from '../assets/eye.svg';
import { isValidEmail } from '../utils/isValidEmail';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
	onSuccessfulAuthentication: (user: User) => void;
	registerMode: boolean;
	user: User | null;
	isLoading: boolean;
}

const initialInputStates = {
	username: '',
	email: '',
	password: '',
};

const initialInputErrors = {
	username: false,
	email: false,
	password: false,
};

const AuthScreen = ({
	onSuccessfulAuthentication,
	registerMode,
	user,
	isLoading,
}: Props) => {
	const [inputStates, setInputStates] = useState(initialInputStates);
	const [inputErrors, setInputErrors] = useState(initialInputErrors);
	const [revealPassword, setRevealPassword] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('/notes');
		}
	}, [navigate, user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!inputStates.username) {
			setInputErrors((prevState) => ({ ...prevState, username: true }));
		}

		if (!inputStates.password) {
			setInputErrors((prevState) => ({ ...prevState, password: true }));
		}

		setIsFetching(true);
		try {
			if (registerMode) {
				if (!isValidEmail(inputStates.email)) {
					setInputErrors((prevState) => ({ ...prevState, email: true }));
					return;
				}
				if (!inputStates.username || !inputStates.password) return;
				const user = await UsersApi.register(inputStates);

				onSuccessfulAuthentication(user);
				navigate('/notes');
			} else {
				if (!inputStates.username || !inputStates.password) return;
				const user = await UsersApi.login(inputStates);
				onSuccessfulAuthentication(user);
				navigate('/notes');
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetching(false);
		}
	};

	const resetAllInputState = () => {
		setInputStates(initialInputStates);
		setInputErrors(initialInputErrors);
	};

	// Avoid flickering when refreshing
	if (isLoading) return null;

	return (
		<>
			<form className={styles.authScreen} onSubmit={(e) => handleSubmit(e)}>
				<h2 className={styles.authScreenHeader}>
					{registerMode ? 'Register' : 'Login'}
				</h2>
				<div className={styles.authScreenInput}>
					<label htmlFor='username'>Username:</label>
					<input
						className={styles.authScreenInput}
						value={inputStates.username}
						type='text'
						id='username'
						onChange={(e) => {
							setInputErrors((prevState) => ({
								...prevState,
								username: false,
							}));
							setInputStates((prevState) => ({
								...prevState,
								username: e.target.value,
							}));
						}}
					/>
					{inputErrors.username && (
						<p className={styles.authScreenEmailError}>Invalid username</p>
					)}
				</div>
				{registerMode && (
					<div className={styles.authScreenInput}>
						<label htmlFor='email'>Email:</label>
						<input
							className={styles.authScreenInput}
							value={inputStates.email}
							type='text'
							id='email'
							onChange={(e) => {
								setInputErrors((prevState) => ({
									...prevState,
									email: false,
								}));
								setInputStates((prevState) => ({
									...prevState,
									email: e.target.value,
								}));
							}}
						/>
						{inputErrors.email && (
							<p className={styles.authScreenEmailError}>Invalid email</p>
						)}
					</div>
				)}
				<div className={styles.authScreenInput}>
					<label htmlFor='password'>Password:</label>
					<input
						className={styles.authScreenInput}
						value={inputStates.password}
						type={revealPassword ? 'text' : 'password'}
						id='password'
						onChange={(e) => {
							setInputErrors((prevState) => ({
								...prevState,
								password: false,
							}));
							setInputStates((prevState) => ({
								...prevState,
								password: e.target.value,
							}));
						}}
					/>
					<Eye
						className={styles.authScreenEye}
						title='reveal password'
						onMouseDown={() => setRevealPassword(true)}
						onMouseUp={() => setRevealPassword(false)}
						onTouchStart={() => setRevealPassword(true)}
						onTouchEnd={() => setRevealPassword(false)}
					/>
					{inputErrors.password && (
						<p className={styles.authScreenEmailError}>Invalid password</p>
					)}
				</div>
				<button
					disabled={isFetching ? true : false}
					className={styles.authScreenButton}
					type='submit'
				>
					{isFetching ? '...' : registerMode ? 'Register' : 'Login'}
				</button>
			</form>
			<Link
				to={registerMode ? '/' : '/register'}
				className={styles.authScreenLink}
				onClick={() => resetAllInputState()}
			>
				{registerMode ? 'Already have an account?' : `Don't have an account?`}
			</Link>
		</>
	);
};

export default AuthScreen;
