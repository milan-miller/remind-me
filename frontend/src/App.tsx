import AuthScreen from './components/AuthScreen';
import { User } from './models/user';
import NavBar from './components/NavBar';
import { useState } from 'react';
import './App.css';
import LoggedInView from './components/LoggedInView';

function App() {
	const [authenticatedUser, setAutheticatedUser] = useState<User | null>(null);

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
					register={true}
					onSuccessfulAuthentication={(user) => setAutheticatedUser(user)}
				/>
			)}
		</div>
	);
}

export default App;
