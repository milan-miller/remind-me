import { useEffect, useState } from 'react';
import { Note } from '../models/note';
import './App.css';

function App() {
	const [notes, setNotes] = useState<Note[]>([]);

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
			<ul>
				{notes &&
					notes.map((note) => <li key={note._id}>{note.description}</li>)}
			</ul>
		</div>
	);
}

export default App;
