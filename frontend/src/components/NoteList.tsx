import { ReactElement } from 'react';
import styles from '../styles/NoteList.module.css';

interface Props {
	children: ReactElement[];
}

const NoteList = ({ children }: Props) => {
	return (
		<div className={styles.noteList}>
			<div className={styles.noteListContainer}>{children}</div>
		</div>
	);
};

export default NoteList;
