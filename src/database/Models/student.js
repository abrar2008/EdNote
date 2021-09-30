import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		state: {
			type: String,
		},
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
	},
	{ timestamps: true }
);

export default mongoose.model("Student", studentSchema);
