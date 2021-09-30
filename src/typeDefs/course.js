import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		"""
		Fetch single course
		"""
		get_single_course(courseId: ID!): DataStatus
		get_all_courses(cursor: String, limit: Int): CourseConnection
		get_user_courses(cursor: String, limit: Int): CourseConnection
	}

	extend type Mutation {
		createCourse(
			school: ID

			faculty: ID

			dept: ID

			level: ID

			name: String

			description: String

			semester: String
		): DataStatus

		editCourse(
			courseId: ID!
			name: String
			description: String
			semester: String
		): DataStatus

		"""
		"At no point is the deleted news data returned in this request
		"""
		deleteCourse(courseId: ID!): DataStatus
	}

	type Course {
		_id: ID!

		school: School

		faculty: Faculty

		dept: Dept

		level: Level

		name: String

		description: String

		semester: String

		courseTopics: [Topic]
	}

	type CourseConnection {
		edges: [Course]
		pageInfo: PageInfo
	}
`;
