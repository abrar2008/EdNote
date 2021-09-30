import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
	{
		value: {
			type: String,
			required: true,
		},
		is_answer: {
			type: Boolean,
			required: true,
			default: false,
		},

		question: {
			type: Schema.Types.ObjectId,
			ref: "Question",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Answer", challengeSchema);
