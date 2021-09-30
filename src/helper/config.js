import { config } from "dotenv";

config();
// destructure to make any new dev be able to picture all the env var used all at once
const {
	EMAIL_SECRET,
	JWT_SECRET_KEY,
	NODE_ENV,
	MONGO_DB_URI,
	CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	MG_API_KEY,
	MG_DOMAIN,
	TOTP_KEY,
} = process.env;

export default {
	EMAIL_SECRET,
	JWT_SECRET_KEY,
	NODE_ENV,
	MONGO_DB_URI,
	CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	MG_API_KEY,
	MG_DOMAIN,
	TOTP_KEY,
};
