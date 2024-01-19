import { RequestHandler } from 'express';
import NoteModel from '../models/note';

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
		const note = await NoteModel.findById(id);

		res.status(200).json(note);
	} catch (error) {
		next(error);
	}
};

export const createNote: RequestHandler = async (req, res, next) => {
	const { title, description } = req.body;

	try {
		if (!title || !description) {
			return res
				.status(400)
				.json({ error: 'Title and description are required.' });
		}

		const note = await NoteModel.create({ title, description });

		res.status(201).json(note);
	} catch (error) {
		next(error);
	}
};
