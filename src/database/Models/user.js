import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../helper/config";
const { EMAIL_SECRET, JWT_SECRET_KEY } = config;
const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		userType: {
			type: String,
			enum: ["user", "admin", "super_admin", "student"],
		},
	},
	{
		timestamps: true,
	}
);

// Hash password before save to DB
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await this.hashPass(this.password);
	}

	next();
});

userSchema.methods = {
	// Sign token for email verification
	emailToken: function () {
		return jwt.sign(
			{ userId: this._id, userType: this.userType },
			EMAIL_SECRET,
			{
				expiresIn: "7d",
			}
		);
	},

	// Sign token for user authorization
	jwtToken: function () {
		return jwt.sign(
			{ userId: this._id, userType: this.userType },
			JWT_SECRET_KEY,
			{
				expiresIn: "30d",
			}
		);
	},

	// Sign token for forgot password
	passwordToken: function () {
		return jwt.sign({ userId: this._id }, JWT_SECRET_KEY, {
			expiresIn: "30m",
		});
	},

	// Hash Password
	hashPass: async function (password) {
		return await bcrypt.hash(password, 12);
	},

	// Verify user password
	verifyPass: async function (password) {
		const cp = await bcrypt.compare(password, this.password);

		return cp;
	},
};

export default mongoose.model("User", userSchema);
