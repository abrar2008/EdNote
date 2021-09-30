import cloudinary from "cloudinary";
import config from "./config";
const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = config;

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

// File upload to cloudinary
export const processUpload = async (file) => {
	const { filename, createReadStream } = await file;

	try {
		const result = await new Promise((resolve, reject) => {
			console.log("Promise called");
			createReadStream().pipe(
				cloudinary.v2.uploader.upload_stream(
					{ resource_type: "auto" },
					(error, result) => {
						if (error) {
							console.log("where error fails", error);
							reject(error);
						}

						resolve(result);
					}
				)
			);
		});

		const newPhoto = { filename, path: result.secure_url };

		return newPhoto;
	} catch (err) {
		throw err;
	}
};
