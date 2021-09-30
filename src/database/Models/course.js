import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
	school: {
		type: Schema.Types.ObjectId,
		ref: "School",
	},
	faculty: {
		type: Schema.Types.ObjectId,
		ref: "Faculty",
	},
	dept: {
		type: Schema.Types.ObjectId,
		ref: "Dept",
	},
	level: {
		type: Schema.Types.ObjectId,
		ref: "Level",
	},
	courseTopics: [
		{
			type: Schema.Types.ObjectId,
			ref: "CourseTopic",
		},
	],
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	semester: {
		type: String,
		enum: ["first", "second"],
	},
});

export default mongoose.model("Course", courseSchema);
