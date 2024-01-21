import { INote } from '../models/note';
import styles from '../styles/Note.module.css';

interface Props {
	note: INote;
}

const Note = ({ note }: Props) => {
	const { title, description, createdAt, updatedAt } = note;

	return (
		<div className={styles.card}>
			<p>{title}</p>
			<p>{description}</p>
			<p>{createdAt}</p>
			<p>{updatedAt}</p>
		</div>
	);
};

export default Note;
