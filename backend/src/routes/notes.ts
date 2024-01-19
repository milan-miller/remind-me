import express from 'express';
import * as NotesController from '../controllers/notes';
const router = express();

router
	.route('/')
	.get(NotesController.getNotes)
	.post(NotesController.createNote);

router
	.route('/:id')
	.get(NotesController.getNote)
	.patch(NotesController.updateNote)
	.delete(NotesController.deleteNote);

export default router;
