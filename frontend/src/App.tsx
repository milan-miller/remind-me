import AuthScreen from './components/AuthScreen';
import { User } from './models/user';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import './App.css';
import LoggedInView from './components/LoggedInView';
import * as UsersApi from './network/users_api';

function App() {
	const [authenticatedUser, setAutheticatedUser] = useState<User | null>(null);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await UsersApi.getLoggedInUser();

				setAutheticatedUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<div className='App'>
			<NavBar
				unauthenticateUser={() => setAutheticatedUser(null)}
				user={authenticatedUser}
			/>
			{authenticatedUser ? (
				<LoggedInView />
			) : (
				<AuthScreen
					onSuccessfulAuthentication={(user) => setAutheticatedUser(user)}
				/>
			)}
		</div>
	);
}

export default App;
