import { RequestHandler } from 'express';
import NoteModel from '../models/note';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assertIsDefined';

export const getNotes: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;

	try {
		assertIsDefined(authenticatedUserId);
		const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
		res.status(200).json(notes);
	} catch (error) {
		next(error);
	}
};

export const getNote: RequestHandler = async (req, res, next) => {
	const id = req.params.id;
	const authenticatedUserId = req.session.userId;

	try {
		assertIsDefined(authenticatedUserId);
		if (!mongoose.isValidObjectId(id)) {
			throw createHttpError(400, 'Invalid note id');
		}

		const note = await NoteModel.findById(id);

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		if (!note.userId.equals(authenticatedUserId)) {
			throw createHttpError(401, 'You cannot access this note');
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
	const authenticatedUserId = req.session.userId;

	try {
		assertIsDefined(authenticatedUserId);
		if (!title || !description) {
			throw createHttpError(400, 'Title and description are required.');
		}

		const note = await NoteModel.create({
			userId: authenticatedUserId,
			title,
			description,
		});

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
	const authenticatedUserId = req.session.userId;

	try {
		assertIsDefined(authenticatedUserId);
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

		if (!note.userId.equals(authenticatedUserId)) {
			throw createHttpError(401, 'You can only update your own notes');
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
	const authenticatedUserId = req.session.userId;

	try {
		assertIsDefined(authenticatedUserId);

		if (!mongoose.isValidObjectId(id)) {
			throw createHttpError(400, 'Invalid note id');
		}

		const note = await NoteModel.findById(id).exec();

		if (!note) {
			throw createHttpError(404, 'Note not found');
		}

		if (!note.userId.equals(authenticatedUserId)) {
			throw createHttpError(401, 'You can only delete your own notes');
		}

		await note.deleteOne();

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
