import { useEffect, useState } from 'react';
import { INote } from './models/note';
import Note from './components/Note';
import './App.css';
import NoteList from './components/NoteList';
import * as NotesApi from './network/notes_api';
import logo from './assets/remind-me-logo.png';
import AddEditNoteModal from './components/AddEditNoteModal';
import { ReactComponent as Plus } from './assets/plus.svg';

function App() {
	const [notes, setNotes] = useState<INote[]>([]);
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

	useEffect(() => {
		const getNotes = async () => {
			try {
				const notes = await NotesApi.fetchNotes();

				setNotes(notes);
			} catch (error) {
				console.error(error);
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
		<div className='App'>
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

			<img src={logo} alt='logo' className='logo' />
			<button
				className='button'
				onClick={() => setShowAddNoteModal(!showAddNoteModal)}
			>
				<Plus className='plus' />
				Add Note
			</button>
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
		</div>
	);
}

export default App;
