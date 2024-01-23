import { InferSchemaType, Schema, model } from 'mongoose';

const userSchema = new Schema({
	username: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true, select: false },
	password: { type: String, required: true, select: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>('User', userSchema);
