import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		//    in hours
		expired_at: {
			type: Date,
			required: true,
		},
		//    in minutes
		duration: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			enum: ["schools", "deptartments", "faculties", "all"],
		},
		// Any of the below values can be null depending on the category
		schools: [
			{
				type: Schema.Types.ObjectId,
				ref: "School",
			},
		],
		faculties: {
			type: Schema.Types.ObjectId,
			ref: "Faculty",
		},
		departments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Dept",
			},
		],
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: "Question",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
