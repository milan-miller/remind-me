import logo from '../assets/remind-me-logo.png';
import { User } from '../models/user';
import styles from '../styles/NavBar.module.css';
import { ReactComponent as Logout } from '../assets/log-out.svg';
import * as UsersApi from '../network/users_api';
import { useNavigate } from 'react-router-dom';

interface Props {
	user: User | null;
	unauthenticateUser: () => void;
}

const NavBar = ({ user, unauthenticateUser }: Props) => {
	const navigate = useNavigate();

	const logoutUser = async () => {
		try {
			await UsersApi.logout();
			unauthenticateUser();
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.navBar}>
			<img src={logo} alt='logo' className={styles.navBarLogo} />
			{user && (
				<Logout
					onClick={logoutUser}
					className={styles.navBarLogoutButton}
					title='logout'
				/>
			)}
		</div>
	);
};

export default NavBar;
