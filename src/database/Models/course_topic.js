import mongoose, { Schema } from "mongoose";

const courseTopicSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
	},
	lectureNotes: [
		{
			type: Schema.Types.ObjectId,
			ref: "LectureNote",
		},
	],
});

export default mongoose.model("CourseTopic", courseTopicSchema);
