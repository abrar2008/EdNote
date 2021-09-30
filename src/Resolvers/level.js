import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Level from "../database/Models/level";
import User from "../database/Models/user";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";
// import { pubsub } from "../subscription";
// import { UserTopics } from "../subscription/events/user";

export default {
	Query: {
		levels: combineResolvers(isAuthenticated, async () => {
			try {
				const levels = await Level.find();
				if (!levels) {
					throw new ApolloError("Levels not found!");
				}
				return levels;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),

		level: combineResolvers(isAuthenticated, async (_, { id }) => {
			try {
				const level = await Level.findById(id);
				if (!level) {
					throw new ApolloError("Level not found!");
				}
				console.log(level);
				return level;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),
	},

	Mutation: {
		createLevel: combineResolvers(isAdmin, async (_, { input }) => {
			try {
				const level = new Level({ ...input });
				const result = await level.save();

				await School.findByIdAndUpdate(input.school, {
					$addToSet: { levels: result._id },
				});

				return result;
			} catch (error) {
				throw error;
			}
		}),
	},

	// Subscription: {
	//   levelCreated: {
	//     subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
	//   }
	// },

	// Type relations to get data for other types when quering for levels
	Level: {
		school: (_) => School.findById(_.school),
		faculty: (_) => Faculty.findById(_.faculty),
		dept: (_) => Dept.findById(_.dept),
		students: (_) => User.find({ _id: _.students }),
	},
};
