import { INote } from '../models/note';
import styles from '../styles/Note.module.css';
import { formatDate } from '../utils/fortmatDate';
import { ReactComponent as TrashCan } from '../assets/trashcan.svg';
import { ReactComponent as Pencil } from '../assets/pencil.svg';

interface Props {
	note: INote;
	onDeleteNoteClicked: (note: INote) => void;
	showAddNoteModal: () => void;
	setNoteToEdit: (note: INote) => void;
}

const Note = ({
	note,
	showAddNoteModal,
	onDeleteNoteClicked,
	setNoteToEdit,
}: Props) => {
	const { title, description, createdAt, updatedAt } = note;

	let noteDate =
		updatedAt > createdAt
			? `Updated: ${formatDate(updatedAt)}`
			: `Created: ${formatDate(createdAt)}`;

	return (
		<div className={styles.card}>
			<div className={styles.cardFunctions}>
				<Pencil
					className={styles.cardPencil}
					onClick={(e) => {
						setNoteToEdit(note);
						showAddNoteModal();
					}}
					title='edit'
				/>
				<TrashCan
					className={styles.cardTrashcan}
					onClick={(e) => {
						onDeleteNoteClicked(note);
						e.stopPropagation();
					}}
					title='delete'
				/>
			</div>
			<div className={styles.cardBody}>
				<p>{title}</p>
				<p>{description}</p>
			</div>
			<p>{noteDate}</p>
		</div>
	);
};

export default Note;
