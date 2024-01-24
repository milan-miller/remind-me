import { useState } from 'react';
import * as UsersApi from '../network/users_api';
import { User } from '../models/user';
import styles from '../styles/AuthScreen.module.css';
import { ReactComponent as Eye } from '../assets/eye.svg';
import { isValidEmail } from '../utils/isValidEmail';

interface Props {
	register: boolean;
	onSuccessfulAuthentication: (user: User) => void;
}

const AuthModal = ({ register, onSuccessfulAuthentication }: Props) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [revealPassword, setRevealPassword] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [invalidEmailError, setInvalidEmailError] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsFetching(true);
		try {
			if (register) {
				if (!isValidEmail(email)) {
					setInvalidEmailError(true);
					return;
				}

				const user = await UsersApi.register({ username, email, password });

				onSuccessfulAuthentication(user);
			} else {
				const user = await UsersApi.login({ username, password });
				onSuccessfulAuthentication(user);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<form className={styles.authScreen} onSubmit={(e) => handleSubmit(e)}>
			<h2 className={styles.authScreenHeader}>
				{register ? 'Register' : 'Login'}
			</h2>
			<div className={styles.authScreenInput}>
				<label htmlFor='username'>Username:</label>
				<input
					className={styles.authScreenInput}
					value={username}
					type='text'
					id='username'
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			{register && (
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
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Eye
					className={styles.authScreenEye}
					title='reveal password'
					onMouseDown={() => setRevealPassword(true)}
					onMouseUp={() => setRevealPassword(false)}
				/>
			</div>
			<button
				disabled={isFetching ? true : false}
				className={styles.authScreenButton}
				type='submit'
			>
				{isFetching ? '...' : register ? 'Register' : 'Login'}
			</button>
		</form>
	);
};
export default AuthModal;
