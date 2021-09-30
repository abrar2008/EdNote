import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Course from "../database/Models/course";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";
import Student from "../database/Models/student";
import CourseTopic from "../database/Models/course_topic";

export default {
	Query: {
		get_user_courses: combineResolvers(
			isAuthenticated,
			async (_, { cursor, limit }, { Id }) => {
				try {
					let courses;
					const student = await Student.findOne({ user: Id });

					if (!student) {
						throw new ApolloError("You are yet to set your profile !");
					}

					const where = {
						department: student.department,
						level: student.level,
					};

					if (cursor) {
						courses = await Course.find({
							...where,
							createdAt: { $lt: cursor },
						})
							.limit(limit + 1)
							.sort({ createdAt: -1 });

						if (courses.length === 0) {
							return {
								edges: courses,
							};
						} else if (courses.length > 0) {
							const hasNextPage = courses.length > limit;
							const edges = hasNextPage ? courses.slice(0, -1) : courses;

							return {
								edges,
								pageInfo: {
									hasNextPage,
									endCursor: edges[edges.length - 1].createdAt,
								},
							};
						}
					} else {
						courses = await Course.find(where)
							.limit(limit + 1)
							.sort({ createdAt: -1 });

						if (courses.length === 0) {
							return {
								edges: courses,
							};
						} else if (courses.length > 0) {
							const hasNextPage = courses.length > limit;
							const edges = hasNextPage ? courses.slice(0, -1) : courses;

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
						"Something went wrong while trying to fetch courses"
					);
				} catch (error) {
					throw error;
				}
			}
		),
		get_all_courses: combineResolvers(isAdmin, async (_, { cursor, limit }) => {
			try {
				let courses;

				if (cursor) {
					courses = await Course.find({
						createdAt: { $lt: cursor },
					})
						.limit(limit + 1)
						.sort({ createdAt: -1 });

					if (courses.length === 0) {
						return {
							edges: courses,
						};
					} else if (courses.length > 0) {
						const hasNextPage = courses.length > limit;
						const edges = hasNextPage ? courses.slice(0, -1) : courses;

						return {
							edges,
							pageInfo: {
								hasNextPage,
								endCursor: edges[edges.length - 1].createdAt,
							},
						};
					}
				} else {
					courses = await Course.find()
						.limit(limit + 1)
						.sort({ createdAt: -1 });

					if (courses.length === 0) {
						return {
							edges: courses,
						};
					} else if (courses.length > 0) {
						const hasNextPage = courses.length > limit;
						const edges = hasNextPage ? courses.slice(0, -1) : courses;

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
					"Something went wrong while trying to fetch courses"
				);
			} catch (error) {
				throw error;
			}
		}),

		get_single_course: combineResolvers(isAdmin, async (_, { courseId }) => {
			try {
				const course = await Course.findById(courseId);

				if (!course) {
					return {
						message: "Course not found",
						value: false,
					};
				}

				return {
					message: "Data found",
					value: true,
					course,
				};
			} catch (error) {
				throw error;
			}
		}),
	},

	Mutation: {
		createCourse: combineResolvers(isAdmin, async (_, args) => {
			try {
				const newCourse = new Course({
					...args,
				});

				const savedCourse = await newCourse.save();

				return {
					message: "Course created successfully",
					value: true,
					data: savedCourse,
				};
			} catch (error) {
				throw error;
			}
		}),

		editCourse: combineResolvers(isAdmin, async (_, args) => {
			try {
				const updateCourse = await Course.findByIdAndUpdate(
					args.courseId,
					args,
					{
						new: true,
					}
				);

				return {
					message: "Course updated successfully",
					value: true,
					data: updateCourse,
				};
			} catch (error) {
				throw error;
			}
		}),

		deleteCourse: combineResolvers(isAdmin, async (_, { courseId }) => {
			try {
				await Course.findByIdAndRemove(courseId);

				return {
					message: "Course deleted successfully",
					value: true,
				};
			} catch (error) {
				throw error;
			}
		}),
	},

	// Type relations to get data for other types when quering for course--
	Course: {
		school: (_) => School.findById(_.school),
		faculty: (_) => Faculty.findById(_.faculty),
		dept: (_) => Dept.findById(_.dept),
		level: (_) => Level.findById(_.level),
		courseTopics: (_) => CourseTopic.find({ _id: _.courseTopics }),
	},
};
