import { FormEvent, useRef, useState } from 'react';
import styles from '../styles/AddNoteModal.module.css';
import * as NotesApi from '../network/notes_api';
import { INote } from '../models/note';

interface Props {
	cancelModal: () => void;
	setNotes: (note: INote) => void;
}

const AddNoteModal = ({ cancelModal, setNotes }: Props) => {
	const modalBackground = useRef<HTMLDivElement>(null);
	const titleInput = useRef<HTMLInputElement>(null);
	const descriptionInput = useRef<HTMLTextAreaElement>(null);
	const [inputError, setInputError] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const closeDownModal = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (event.target === modalBackground.current) {
			cancelModal();
		}
	};

	const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (!titleInput.current?.value || !descriptionInput.current?.value) {
				setInputError(true);
				return;
			}

			setIsFetching(true);

			const note = {
				title: titleInput.current.value,
				description: descriptionInput.current.value,
			};

			const newNote = (await NotesApi.createNote(note)) as INote;
			cancelModal();

			setNotes(newNote);
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
				<h2>Add Note</h2>
				<label htmlFor='title'>Title: </label>
				<input
					ref={titleInput}
					className={styles.modalInput}
					id='title'
					type='text'
					placeholder='Title'
				/>
				<label htmlFor='description'>Description: </label>
				<textarea
					ref={descriptionInput}
					className={styles.modalInput}
					id='description'
					placeholder='Description'
				/>
				<div className={styles.modalButtons}>
					<button className={styles.modalCancelButton} onClick={cancelModal}>
						CANCEL
					</button>
					<button
						className={styles.modalAddButton}
						type='submit'
						form='noteForm'
						disabled={isFetching}
					>
						{isFetching ? '...' : 'ADD'}
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

export default AddNoteModal;
