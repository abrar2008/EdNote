import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Faculty from "../database/Models/faculty";
import School from "../database/Models/school";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";
// import { pubsub } from "../subscription";
// import { UserTopics } from "../subscription/events/user";

export default {
	Query: {
		faculties: combineResolvers(isAuthenticated, async () => {
			try {
				const faculties = await Faculty.find();
				if (!faculties) {
					throw new ApolloError("Schools not found!");
				}
				return faculties;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),

		faculty: combineResolvers(isAuthenticated, async (_, { id }) => {
			try {
				const faculty = await Faculty.findById(id);
				if (!faculty) {
					throw new ApolloError("Faculty not found!");
				}
				return faculty;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),
	},

	Mutation: {
		createFaculty: combineResolvers(isAdmin, async (_, { input }) => {
			try {
				const faculty = new Faculty({ ...input });
				const result = await faculty.save();

				await School.findByIdAndUpdate(input.school, {
					$addToSet: { faculties: result._id },
				});

				return result;
			} catch (error) {
				console.log(error);
				throw error;
			}
		}),
	},

	// Subscription: {
	//   userCreated: {
	//     subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
	//   }
	// },

	// Type relations to get data for other types when quering for faculties
	Faculty: {
		school: (_) => School.findById(_.school),
	},
};
