import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";

import config from "../helper/config";

// ========== Models ==============//
import User from "../database/Models/user";

// ============= Services ===============//
import { isAuthenticated, isAdmin, isUser, isSuperAdmin } from "./middleware";
import { pubsub } from "../subscription";
import UserTopics from "../subscription/events/user";
import { htmlToSend, sendMail } from "../services/email_service";

const { JWT_SECRET_KEY } = config;
export default {
	Query: {
		users: combineResolvers(isAuthenticated, isAdmin, async () => {
			try {
				const users = await User.find();

				if (!users) {
					throw new ApolloError("User not found!");
				}

				return users;
			} catch (error) {
				throw error;
			}
		}),

		// Logged in user profile
		user: combineResolvers(isUser, async (_, __, { Id }) => {
			try {
				// console.log(Id)
				const user = await User.findById(Id);

				if (!user) {
					throw new ApolloError("User not found!");
				}

				return user;
			} catch (error) {
				throw error;
			}
		}),
	},

	Mutation: {
		signup: async (_, { input }) => {
			try {
				const lowercase = input.email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (user) {
					return {
						message: "User with this email already exists",
						value: false,
					};
				}

				const newUser = new User({
					email: lowercase,
					userType: "user",
					...input,
				});
				const result = await newUser.save();

				pubsub.publish(UserTopics.USER_CREATED, {
					[UserTopics.USER_CREATED]: result,
				});

				const token = result.emailToken();
				const subject = "Email Confirmation";
				const url = "localhost";
				const links = `http://${url}/confirmation/${result.email}/${token.token}`;
				const text = "";

				const html = `
          Hello ${result.name}, <br /> Please verify your account by clicking the link: <a href="${links}"> </a>
          <br /> Thank You!
        `;
				sendMail(result.email, subject, text, htmlToSend(html));

				return {
					message: "Account created successfully, check your email for code",
					value: true,
					user: result,
				};
			} catch (error) {
				throw error;
			}
		},

		createSuperAdmin: async (_, { input }) => {
			try {
				const lowercase = input.email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (user) {
					return {
						message: "User with this email already exists",
						value: false,
					};
				}

				const newUser = new User({
					email: lowercase,
					userType: "super_admin",
					isVerified: true,
					...input,
				});

				const result = await newUser.save();

				pubsub.publish(UserTopics.USER_CREATED, {
					[UserTopics.USER_CREATED]: result,
				});

				return {
					message: "Account created successfully",
					value: true,
					user: result,
				};
			} catch (error) {
				throw error;
			}
		},

		createAdmin: async (_, { input }) => {
			try {
				const lowercase = input.email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (user) {
					return {
						message: "User with this email already exists",
						value: false,
					};
				}

				const newUser = new User({
					email: lowercase,
					userType: "admin",
					isVerified: true,
					...input,
				});

				const result = await newUser.save();

				pubsub.publish(UserTopics.USER_CREATED, {
					[UserTopics.USER_CREATED]: result,
				});

				return {
					message: "Account created successfully",
					value: true,
					user: result,
				};
			} catch (error) {
				throw error;
			}
		},

		login: async (_, { input }) => {
			try {
				const lowercase = input.email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (!user) {
					return {
						message: "Incorrect login details",
						value: false,
					};
				}
				// added await, probably what is breaking ayo fetaure
				const isPasswordValid = await user.verifyPass(input.password);

				if (!isPasswordValid) {
					return {
						message: "Incorrect login details",
						value: false,
					};
				}

				const token = user.jwtToken();

				return {
					message: token,
					value: true,
					user,
				};
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		// @TODO: This should be a Rest API Endpoint Instead
		confirmEmail: async (_, { token }) => {
			try {
				jwt.verify(token, JWT_SECRET_KEY);

				return true;
			} catch (error) {
				return false;
			}
		},

		// User initiates change of password from forgot password
		forgotPassword: async (_, { email }) => {
			try {
				const lowercase = email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (!user) {
					return {
						message: "User not found",
						value: false,
					};
				}

				const token = user.passwordToken();
				const subject = "Password Reset";
				const url = "localhost";
				const text = "";

				const links = `http://${url}/confirmation/${user.email}/${token.token}`;
				const html = `
          Hello ${user.name}, <br /> You are getting this mail because you have requested for a 
          password reset. This password reset window is limited to twenty minutes. 
          If you do not reset your password within twenty minutes, you will need to submit a new 
          request. <br /> Please click on the link to Complete this process. 
          <a href="${links}"> </a>
          <br /> Thank You!
        `;

				sendMail(user.email, subject, text, html);

				return {
					message: "Please check your email to complete this process",
					value: true,
				};
			} catch (error) {
				throw error;
			}
		},

		// Change password from forgot password...(Public route)
		changePassword: async (
			_,
			{ pass_token, email, new_password, confirm_password }
		) => {
			try {
				const lowercase = email.toLowerCase();
				const user = await User.findOne({ email: lowercase });

				if (!user) {
					return {
						message: "User not found",
						value: false,
					};
				}

				const verify = jwt.verify(pass_token, JWT_SECRET_KEY);

				if (!verify) {
					return {
						message: "Password reset expired",
						value: false,
					};
				}

				if (new_password !== confirm_password) {
					return {
						message: "Passwords do not seem to match",
						value: false,
					};
				}

				const hashedPassword = await user.hashPass(new_password);

				const updatedUser = await User.findByIdAndUpdate(
					user._id,
					{ $set: { password: hashedPassword } },
					{ new: true }
				);

				const token = user.jwtToken();

				return {
					message: token,
					value: true,
					user: updatedUser,
				};
			} catch (err) {
				throw err;
			}
		},

		// User Change password from in app...For all user types
		resetPassword: combineResolvers(
			isAuthenticated,
			async (_, { old_password, new_password }, { Id }) => {
				try {
					const user = await User.findById(Id);

					if (!user) {
						return {
							message: "User not found",
							value: false,
						};
					}

					// Verify old password
					const isMatch = await user.verifyPass(old_password);

					if (!isMatch) {
						return {
							message: "Old password is not correct",
							value: false,
						};
					}

					const hashedPassword = await user.hashPass(new_password);

					await User.findByIdAndUpdate(
						Id,
						{ $set: { password: hashedPassword } },
						{ new: true }
					);

					return {
						message: "Password reset successful",
						value: true,
					};
				} catch (error) {
					throw error;
				}
			}
		),

		editUser: combineResolvers(isAuthenticated, async (_, args, { Id }) => {
			try {
				const user = await User.findByIdAndUpdate(Id, args, {
					new: true,
				});

				return {
					message: "User updated successfully",
					value: true,
					user,
				};
			} catch (error) {
				throw error;
			}
		}),

		makeSuperAdmin: combineResolvers(isSuperAdmin, async (_, { userId }) => {
			try {
				const admin = { userType: "super_admin" };

				const updatedUser = await User.findByIdAndUpdate(userId, admin, {
					new: true,
				});

				return {
					message: "User is now and admin",
					value: true,
					updatedUser,
				};
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),
	},

	Subscription: {
		userCreated: {
			subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED),
		},
	},
	// User: {
	//   tasks: async ({ id }) => {
	//     try {
	//        const tasks = await Task.find({ user: id})
	//        return tasks
	//     } catch (error) {
	//       console.log(error)
	//       throw error
	//     }

	//   }

	// }
};
