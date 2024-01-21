import { useEffect, useState } from 'react';
import { INote } from './models/note';
import Note from './components/Note';
import './App.css';
import NoteList from './components/NoteList';

function App() {
	const [notes, setNotes] = useState<INote[]>([]);

	useEffect(() => {
		const getNotes = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/notes', {
					method: 'GET',
				});

				const notes = await response.json();

				setNotes(notes);
			} catch (error) {
				console.error(error);
			}
		};

		getNotes();
	}, []);

	return (
		<div className='App'>
			<NoteList>
				{notes.map((note) => (
					<Note key={note._id} note={note} />
				))}
			</NoteList>
		</div>
	);
}

export default App;
