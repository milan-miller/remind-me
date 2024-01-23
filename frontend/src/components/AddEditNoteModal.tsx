import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from '../styles/AddNoteModal.module.css';
import * as NotesApi from '../network/notes_api';
import { INote } from '../models/note';

interface Props {
	noteToEdit?: INote;
	cancelModal: () => void;
	setNotes: (note: INote) => void;
	setNoteToEdit: () => void;
}

const AddEditNoteModal = ({
	noteToEdit,
	cancelModal,
	setNotes,
	setNoteToEdit,
}: Props) => {
	const modalBackground = useRef<HTMLDivElement>(null);
	const [inputError, setInputError] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const closeDownModal = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (event.target === modalBackground.current) {
			cancelModal();
			setNoteToEdit();
		}
	};

	useEffect(() => {
		if (noteToEdit) {
			setTitle(noteToEdit.title);
			setDescription(noteToEdit.description);
		}
	}, [noteToEdit]);

	const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			let noteResponse: INote;
			setIsFetching(true);

			if (noteToEdit) {
				if (!title || !description) {
					setInputError(true);
					return;
				}

				noteResponse = await NotesApi.updateNote(noteToEdit._id, {
					title,
					description,
				});

				cancelModal();
				setNotes(noteResponse);
				setNoteToEdit();
			} else {
				if (!title || !description) {
					setInputError(true);
					return;
				}

				const note = {
					title,
					description,
				};

				noteResponse = (await NotesApi.createNote(note)) as INote;
				setNotes(noteResponse);
				cancelModal();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div
			ref={modalBackground}
			className={styles.modal}
			onClick={closeDownModal}
		>
			<form
				id='noteForm'
				className={styles.modalForm}
				onSubmit={onSubmitHandler}
			>
				<h2>{noteToEdit ? 'Edit Note' : 'Add Note'}</h2>
				<label htmlFor='title'>Title: </label>
				<input
					value={title}
					className={styles.modalInput}
					id='title'
					type='text'
					placeholder='Title'
					onChange={(e) => setTitle(e.target.value)}
				/>
				<label htmlFor='description'>Description: </label>
				<textarea
					value={description}
					className={styles.modalInput}
					id='description'
					placeholder='Description'
					onChange={(e) => setDescription(e.target.value)}
				/>
				<div className={styles.modalButtons}>
					<button
						className={styles.modalCancelButton}
						onClick={() => {
							cancelModal();
							setNoteToEdit();
						}}
					>
						CANCEL
					</button>

					<button
						className={styles.modalAddButton}
						type='submit'
						form='noteForm'
						disabled={isFetching}
						style={{ backgroundColor: noteToEdit && '#7cfc00' }}
					>
						{isFetching ? '...' : noteToEdit ? 'EDIT' : 'ADD'}
					</button>
				</div>
				{inputError && (
					<p className={styles.modalInputError}>
						Enter a title and description
					</p>
				)}
			</form>
		</div>
	);
};

export default AddEditNoteModal;
