import { INote } from '../models/note';
import styles from '../styles/Note.module.css';
import { formatDate } from '../utils/fortmatDate';

interface Props {
	note: INote;
}

const Note = ({ note }: Props) => {
	const { title, description, createdAt, updatedAt } = note;

	let noteDate =
		updatedAt > createdAt
			? `Updated: ${formatDate(updatedAt)}`
			: `Created: ${formatDate(createdAt)}`;

	console.log(noteDate);
	return (
		<div className={styles.card}>
			<div className={styles.cardBody}>
				<p>{title}</p>
				<p>{description}</p>
			</div>
			<p>{noteDate}</p>
		</div>
	);
};

export default Note;
