import mongoose from "mongoose";
import config from "../../helper/config";
const { MONGO_DB_URI } = config;

mongoose.Promise = global.Promise; // To Use Promises With Mongoose

export const connection = () => {
	try {
		mongoose.connect(MONGO_DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		// Message if Successfully Connected to DB
		mongoose.connection.on("connected", () => {
			console.log(`Connected to database ${MONGO_DB_URI}`);
		});

		// Message if There is an error in database Connection
		mongoose.connection.on("error", (err) => {
			throw err;
		});

		// To Remove moongoose depreciation warnings
		mongoose.set("useFindAndModify", false);
		mongoose.set("useCreateIndex", true);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const isValidObjectId = (id) => {
	return mongoose.Types.ObjectId.isValid(id);
};
