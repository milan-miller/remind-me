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

const AuthScreen = ({
	onSuccessfulAuthentication,
	registerMode,
	user,
	isLoading,
}: Props) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [revealPassword, setRevealPassword] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [invalidEmailError, setInvalidEmailError] = useState(false);
	const [invalidUsernameError, setInvalidUsernameError] = useState(false);
	const [invalidPasswordError, setInvalidPasswordError] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('/notes');
		}
	}, [navigate, user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!username) {
			setInvalidUsernameError(true);
		}

		if (!password) {
			setInvalidPasswordError(true);
		}

		setIsFetching(true);
		try {
			if (registerMode) {
				if (!isValidEmail(email)) {
					setInvalidEmailError(true);
					return;
				}
				if (!username || !password) return;
				const user = await UsersApi.register({ username, email, password });

				onSuccessfulAuthentication(user);
				navigate('/notes');
			} else {
				if (!username || !password) return;
				const user = await UsersApi.login({ username, password });
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
		setUsername('');
		setInvalidUsernameError(false);
		setEmail('');
		setInvalidEmailError(false);
		setPassword('');
		setInvalidPasswordError(false);
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
						value={username}
						type='text'
						id='username'
						onChange={(e) => {
							setInvalidUsernameError(false);
							setUsername(e.target.value);
						}}
					/>
					{invalidUsernameError && (
						<p className={styles.authScreenEmailError}>Invalid username</p>
					)}
				</div>
				{registerMode && (
					<div className={styles.authScreenInput}>
						<label htmlFor='email'>Email:</label>
						<input
							className={styles.authScreenInput}
							value={email}
							type='text'
							id='email'
							onChange={(e) => {
								setEmail(e.target.value);
								setInvalidEmailError(false);
							}}
						/>
						{invalidEmailError && (
							<p className={styles.authScreenEmailError}>Invalid email</p>
						)}
					</div>
				)}
				<div className={styles.authScreenInput}>
					<label htmlFor='password'>Password:</label>
					<input
						className={styles.authScreenInput}
						value={password}
						type={revealPassword ? 'text' : 'password'}
						id='password'
						onChange={(e) => {
							setInvalidPasswordError(false);
							setPassword(e.target.value);
						}}
					/>
					<Eye
						className={styles.authScreenEye}
						title='reveal password'
						onMouseDown={() => setRevealPassword(true)}
						onMouseUp={() => setRevealPassword(false)}
					/>
					{invalidPasswordError && (
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
