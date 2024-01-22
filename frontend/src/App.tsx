import { useEffect, useState } from 'react';
import { INote } from './models/note';
import Note from './components/Note';
import './App.css';
import NoteList from './components/NoteList';
import * as NotesApi from './network/notes_api';
import AddNoteModal from './components/AddNoteModal';

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

	return (
		<div className='App'>
			{showAddNoteModal && (
				<AddNoteModal
					setNotes={(note) => setNotes([...notes, note])}
					cancelModal={() => setShowAddNoteModal(false)}
				/>
			)}
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
