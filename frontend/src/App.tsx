import { useEffect, useState } from 'react';
import { INote } from './models/note';
import Note from './components/Note';
import './App.css';
import NoteList from './components/NoteList';
import * as NotesApi from './network/notes_api';
import AddNoteModal from './components/AddNoteModal';
import logo from './assets/remind-me-logo.png';

function App() {
	const [notes, setNotes] = useState<INote[]>([]);
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);

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

	useEffect(() => {
		if (showAddNoteModal) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = 'scroll';
			};
		}
	}, [showAddNoteModal]);

	return (
		<div className='App'>
			{showAddNoteModal && (
				<AddNoteModal
					setNotes={(note) => setNotes([...notes, note])}
					cancelModal={() => setShowAddNoteModal(false)}
				/>
			)}
			<img src={logo} alt='logo' className='logo' />
			<button
				className='button'
				onClick={() => setShowAddNoteModal(!showAddNoteModal)}
			>
				Add Note
			</button>
			<NoteList>
				{notes.map((note) => (
					<Note key={note._id} note={note} />
				))}
			</NoteList>
		</div>
	);
}

export default App;
