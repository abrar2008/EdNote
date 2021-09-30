import mongoose, { Schema } from "mongoose";

const settingsSchema = new Schema({
	hours_spent: {
		type: Schema.Types.Number,
		default: 0,
	},
	test_challenges: {
		type: Schema.Types.Number,
		default: 0,
	},
	refferal: {
		type: Schema.Types.Number,
		default: 0,
	},
	subscription: {
		type: Schema.Types.Number,
		default: 1000,
	},
});

export default mongoose.model("Settings", settingsSchema);
