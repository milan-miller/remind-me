import { Navigate } from 'react-router-dom';
import { User } from '../models/user';
import { ReactNode } from 'react';

interface Props {
	user: User | null;
	children: ReactNode;
}

const ProtectedRoute = ({ user, children }: Props) => {
	if (!user) {
		return <Navigate to='/' replace />;
	}
	return <div>{children}</div>;
};

export default ProtectedRoute;
