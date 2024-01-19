import app from './app';
import env from './utils/validate_env';
import mongoose from 'mongoose';

const PORT = env.PORT;

mongoose
	.connect(env.MONGO_CONNECTION_STRING!)
	.then(() => {
		console.log('Mongoose connected');
		app.listen(PORT, () => {
			console.log('Listening on port: ' + PORT);
		});
	})
	.catch(console.error);
