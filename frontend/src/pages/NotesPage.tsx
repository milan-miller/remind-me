import LoggedInView from '../components/LoggedInView';
import styles from '../styles/NotesPage.module.css';

const NotesPage = () => {
	return (
		<div className={styles.notesPage}>
			<LoggedInView />
		</div>
	);
};
export default NotesPage;
