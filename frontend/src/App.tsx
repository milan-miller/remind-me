import AuthScreen from './components/AuthScreen';
import { User } from './models/user';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import './App.css';
import * as UsersApi from './network/users_api';
import { Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	const [authenticatedUser, setAutheticatedUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		async function fetchLoggedInUser() {
			try {
				const user = await UsersApi.getLoggedInUser();
				setAutheticatedUser(user);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
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
			<Routes>
				<Route
					path='/notes'
					element={
						<ProtectedRoute user={authenticatedUser}>
							<NotesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/'
					element={
						<AuthScreen
							isLoading={isLoading}
							user={authenticatedUser}
							registerMode={false}
							onSuccessfulAuthentication={(user) => setAutheticatedUser(user)}
						/>
					}
				/>
				<Route
					path='/register'
					element={
						<AuthScreen
							isLoading={isLoading}
							user={authenticatedUser}
							registerMode={true}
							onSuccessfulAuthentication={(user) => setAutheticatedUser(user)}
						/>
					}
				/>
				<Route path='/*' element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
