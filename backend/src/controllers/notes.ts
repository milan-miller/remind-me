import { RequestHandler } from 'express';
import NoteModel from '../models/note';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getNotes: RequestHandler = async (req, res, next) => {
	try {
		const notes = await NoteModel.find();
		res.status(200).json(notes);
	} catch (error) {
		next(error);
	}
};

export const getNote: RequestHandler = async (req, res, next) => {
	const id = req.params.id;

	try {
		if (!mongoose.isValidObjectId(id)) {
			throw createHttpError(400, 'Invalid note id');
		}

		const note = await NoteModel.findById(id);

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		res.status(200).json(note);
	} catch (error) {
		next(error);
	}
};

interface NoteBody {
	title: string;
	description: string;
}

export const createNote: RequestHandler<
	unknown,
	unknown,
	NoteBody,
	unknown
> = async (req, res, next) => {
	const { title, description } = req.body;

	try {
		if (!title || !description) {
			throw createHttpError(400, 'Title and description are required.');
		}

		const note = await NoteModel.create({ title, description });

		res.status(201).json(note);
	} catch (error) {
		next(error);
	}
};

interface UpdateNoteParams {
	id: string;
}

export const updateNote: RequestHandler<
	UpdateNoteParams,
	unknown,
	NoteBody,
	unknown
> = async (req, res, next) => {
	const id = req.params.id;
	const { title: newTitle, description: newDescription } = req.body;

	try {
		if (!mongoose.isValidObjectId(id)) {
			throw createHttpError(400, 'Invalid note id');
		}

		if (!newTitle || !newDescription) {
			throw createHttpError(400, 'Title and description are required.');
		}

		const note = await NoteModel.findById(id);

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		note.title = newTitle;
		note.description = newDescription;

		const updatedNote = await note.save();

		res.status(200).json(updatedNote);
	} catch (error) {
		next(error);
	}
};

export const deleteNote: RequestHandler = async (req, res, next) => {
	const id = req.params.id;

	try {
		if (!mongoose.isValidObjectId(id)) {
			throw createHttpError(400, 'Invalid note id');
		}

		const deletedNote = await NoteModel.findByIdAndDelete(id);

		if (!deletedNote) {
			throw createHttpError(404, 'Note not found');
		}

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
