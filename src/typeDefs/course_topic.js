import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		get_single_topic(topicId: ID!): TopicStatus

		"""
		Get topics belonging to a course
		"""
		get_course_topics(
			cursor: String
			limit: Int
			courseId: ID!
		): TopicConnection
	}

	extend type Mutation {
		createTopic(
			course: ID!

			name: String!

			description: String!
		): TopicStatus

		editTopic(topicId: ID!, name: String, description: String): TopicStatus

		"""
		"At no point is the deleted news data returned in this request
		"""
		deleteTopic(topicId: ID!): TopicStatus
	}

	type Topic {
		_id: ID!

		course: Course!

		name: String!

		description: String!

		lectureNotes: [LectureNote]
	}

	type TopicStatus {
		message: String!
		value: Boolean!
		course_topic: Topic
	}

	type TopicConnection {
		edges: [Topic!]!
		pageInfo: PageInfo
	}
`;
