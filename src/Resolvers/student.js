import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import User from "../database/Models/user";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";
import Student from "../database/Models/student";

// ============= Services ===============//
import { isAdmin, isStudent } from "./middleware";
import { pubsub } from "../subscription";
import UserTopics from "../subscription/events/user";

export default {
	Query: {
		students: combineResolvers(isAdmin, async () => {
			try {
				const students = await Student.find();

				if (!students) {
					throw new ApolloError("Students not found!");
				}

				return students;
			} catch (error) {
				throw error;
			}
		}),

		// Fetch logged in student profile
		student: combineResolvers(isStudent, async (_, __, { Id }) => {
			try {
				const student = await Student.findOne({ user: Id });

				if (!student) {
					throw new ApolloError("Student not found!");
				}

				return student;
			} catch (error) {
				throw error;
			}
		}),
	},

	Mutation: {
		createStudentProfile: async (_, { input }, { Id }) => {
			try {
				const student = await Student.findOne({ user: Id });

				if (student) {
					return {
						message: "Student profile already created",
						value: false,
					};
				}

				const newStudent = new Student({
					user: Id,
					state: input.state,
					school: input.school,
					faculty: input.faculty,
					dept: input.dept,
					level: input.level,
				});

				const result_student = await newStudent.save();

				await Level.findByIdAndUpdate(input.level, {
					$addToSet: { students: result_student._id },
				});

				return {
					message: "Profile created successfully",
					value: true,
					student: result_student,
				};
			} catch (error) {
				throw error;
			}
		},

		updateStudentProfile: combineResolvers(
			isStudent,
			async (_, args, { Id }) => {
				try {
					const student = await Student.findOneAndUpdate({ user: Id }, args, {
						new: true,
					});

					return {
						message: "Student updated successfully",
						value: true,
						student,
					};
				} catch (err) {
					throw err;
				}
			}
		),
	},

	Subscription: {
		levelCreated: {
			subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED),
		},
	},

	// Type relations to get data for other types when quering for students
	Student: {
		user: (_) => User.findById(_.user),
		school: (_) => School.findById(_.school),
		faculty: (_) => Faculty.findById(_.faculty),
		dept: (_) => Dept.findById(_.dept),
		level: (_) => Level.findById(_.level),
	},
};
