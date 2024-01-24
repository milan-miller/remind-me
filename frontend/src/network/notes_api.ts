import { INote } from '../models/note';
import { fetchData } from './api';

export async function fetchNotes(): Promise<INote[]> {
	const response = await fetchData('/api/notes', {
		method: 'GET',
	});

	return await response.json();
}

export interface NoteInput {
	title: string;
	description: string;
}

export async function createNote(note: NoteInput): Promise<INote> {
	const response = await fetchData('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});

	return await response.json();
}

export async function updateNote(
	noteId: string,
	note: NoteInput
): Promise<INote> {
	const response = await fetchData('/api/notes/' + noteId, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	});

	return response.json();
}

export async function deleteNote(noteId: string) {
	await fetchData('/api/notes/' + noteId, {
		method: 'DELETE',
	});
}
