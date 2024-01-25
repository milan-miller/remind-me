import { INote } from '../models/note';
import { MutatingDots } from 'react-loader-spinner';
import { ReactComponent as Plus } from '../assets/plus.svg';
import { useEffect, useState } from 'react';
import * as NotesApi from '../network/notes_api';
import AddEditNoteModal from '../components/AddEditNoteModal';
import Note from '../components/Note';
import NoteList from '../components/NoteList';
import styles from '../styles/LoggedInView.module.css';

const LoggedInView = () => {
	const [notes, setNotes] = useState<INote[]>([]);
	const [notesLoading, setNotesLoading] = useState(true);
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

	useEffect(() => {
		const getNotes = async () => {
			try {
				setNotesLoading(true);
				setShowNotesLoadingError(false);
				const notes = await NotesApi.fetchNotes();

				setNotes(notes);
			} catch (error) {
				console.error(error);
				setShowNotesLoadingError(true);
			} finally {
				setNotesLoading(false);
			}
		};

		getNotes();
	}, []);

	const deleteNote = async (note: INote) => {
		try {
			await NotesApi.deleteNote(note._id);
			setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{showAddNoteModal && noteToEdit === null && (
				<AddEditNoteModal
					setNotes={(note) => setNotes([...notes, note])}
					cancelModal={() => setShowAddNoteModal(false)}
					setNoteToEdit={() => setNoteToEdit(null)}
				/>
			)}
			{showAddNoteModal && noteToEdit && (
				<AddEditNoteModal
					setNotes={(note) => {
						setNotes(
							notes.map((existingNote) =>
								existingNote._id === note._id ? note : existingNote
							)
						);
					}}
					cancelModal={() => setShowAddNoteModal(false)}
					noteToEdit={noteToEdit}
					setNoteToEdit={() => setNoteToEdit(null)}
				/>
			)}
			<button
				className={styles.loggedInViewButton}
				onClick={() => setShowAddNoteModal(!showAddNoteModal)}
			>
				<Plus className='plus' />
				Add Note
			</button>
			{notesLoading && (
				<MutatingDots
					visible={true}
					height='100'
					width='100'
					color='#bf5f8d'
					secondaryColor='#bf5f8d'
					radius='12.5'
					ariaLabel='mutating-dots-loading'
					wrapperStyle={{}}
					wrapperClass=''
				/>
			)}
			{showNotesLoadingError && <p>Something went wrong!</p>}
			{!notesLoading && !showNotesLoadingError && (
				<NoteList>
					{notes.map((note) => (
						<Note
							key={note._id}
							note={note}
							onDeleteNoteClicked={deleteNote}
							setNoteToEdit={(note: INote) => setNoteToEdit(note)}
							showAddNoteModal={() => setShowAddNoteModal(true)}
						/>
					))}
				</NoteList>
			)}
		</>
	);
};

export default LoggedInView;
