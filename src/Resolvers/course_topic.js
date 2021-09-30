import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import CourseTopic from "../database/Models/course_topic";
import Course from "../database/Models/course";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";
import LectureNote from "../database/Models/lecture_notes";

export default {
	Query: {
		get_course_topics: combineResolvers(
			isAuthenticated,
			async (_, { cursor, limit, courseId }) => {
				try {
					let topics;

					if (cursor) {
						topics = await CourseTopic.find({
							course: courseId,
							createdAt: { $lt: cursor },
						})
							.limit(limit + 1)
							.sort({ createdAt: -1 });

						if (topics.length === 0) {
							return {
								edges: topics,
							};
						} else if (topics.length > 0) {
							const hasNextPage = topics.length > limit;
							const edges = hasNextPage ? topics.slice(0, -1) : topics;

							return {
								edges,
								pageInfo: {
									hasNextPage,
									endCursor: edges[edges.length - 1].createdAt,
								},
							};
						}
					} else {
						topics = await CourseTopic.find({ course: courseId })
							.limit(limit + 1)
							.sort({ createdAt: -1 });

						if (topics.length === 0) {
							return {
								edges: topics,
							};
						} else if (topics.length > 0) {
							const hasNextPage = topics.length > limit;
							const edges = hasNextPage ? topics.slice(0, -1) : topics;
							return {
								edges,
								pageInfo: {
									hasNextPage,
									endCursor: edges[edges.length - 1].createdAt,
								},
							};
						}
					}
					throw new ApolloError(
						"Something went wrong while trying to fetch topics"
					);
				} catch (error) {
					throw error;
				}
			}
		),

		get_single_topic: combineResolvers(
			isAuthenticated,
			async (_, { topicId }) => {
				try {
					const course = await CourseTopic.findById(topicId).populate("course");

					if (!course) {
						return {
							message: "Topic not found",
							value: false,
						};
					}

					return {
						message: "Data found",
						value: true,
						course_topic: course,
					};
				} catch (error) {
					throw error;
				}
			}
		),
	},

	Mutation: {
		createTopic: combineResolvers(isAdmin, async (_, args) => {
			try {
				const newTopic = new CourseTopic({
					...args,
				});
				await Course.findByIdAndUpdate(newTopic.course, {
					$addToSet: { courseTopics: newTopic._id },
				});
				const savedCourse = await newTopic.save();

				return {
					message: "Topic created successfully",
					value: true,
					course_topic: savedCourse,
				};
			} catch (error) {
				throw error;
			}
		}),

		editTopic: combineResolvers(isAdmin, async (_, args) => {
			try {
				const updateTopic = await CourseTopic.findByIdAndUpdate(
					args.topicId,
					args,
					{
						new: true,
					}
				);

				return {
					message: "Topic updated successfully",
					value: true,
					course_topic: updateTopic,
				};
			} catch (error) {
				throw error;
			}
		}),

		deleteTopic: combineResolvers(isAdmin, async (_, { topicId }) => {
			try {
				await CourseTopic.findByIdAndRemove(topicId);

				return {
					message: "Topic deleted successfully",
					value: true,
				};
			} catch (error) {
				throw error;
			}
		}),
	},

	// Type relations to get data for other types when quering for course topics
	Topic: {
		course: (_) => Course.findById(_.course),
		lectureNotes: (_) => LectureNote.find({ _id: _.lectureNotes }),
	},
};
