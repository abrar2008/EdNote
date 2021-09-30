import jwt from "jsonwebtoken";
import config from "../config";
const { JWT_SECRET_KEY } = config;

// Auth function to verify logged in user
export const verifyUser = async (req_header) => {
	try {
		if (req_header) {
			const token = req_header.split(" ")[1];

			if (token) {
				const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
				return decodedToken;
			}
			return null;
		}
		return null;
	} catch (err) {
		return null;
	}
};
