import { InferSchemaType, Schema, model } from 'mongoose';

const noteSchema = new Schema(
	{
		title: { type: String, require: true },
		description: { type: String, require: true },
	},
	{ timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>('Note', noteSchema);
