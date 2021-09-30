import mongoose, { Schema } from "mongoose";

const challengeSchema = new Schema(
	{
		value: {
			type: String,
			required: true,
		},

		category: {
			type: String,
			// to be used for tests to when it created
			enum: ["challenge", "test"],
			required: true,
		},
		// add test for test later, check use catgeory type
		challenge: {
			type: Schema.Types.ObjectId,
			ref: "Challenge",
		},
		answers: [
			{
				type: Schema.Types.ObjectId,
				ref: "Answer",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Question", challengeSchema);
