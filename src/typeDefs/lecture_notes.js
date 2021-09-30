import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		get_single_note(noteId: ID!): LectureNoteStatus

		"""
		Get notes belonging to a coursetopic
		"""
		get_topic_notes(
			cursor: String
			limit: Int
			topicId: ID!
		): LectureNoteConnection
	}

	extend type Mutation {
		createLectureNote(
			course: ID!

			courseTopic: ID!

			name: String

			text: String
		): LectureNoteStatus

		updateNote(noteId: ID!, text: String, name: String): LectureNoteStatus

		"""
		Add attachments (Pdf/Video) to a lecture note...The lecture note must have been created
		first..
		"""
		uploadNoteAttachments(lectureNoteId: ID!, file: Upload!): LectureNoteStatus

		deleteNote(noteId: ID!): LectureNoteStatus

		test(file: Upload): Boolean
	}

	type LectureNote {
		_id: ID!

		course: Course!

		courseTopic: Topic!

		name: String!

		text: String!

		noteAttachments: [FileType!]
	}

	type LectureNoteStatus {
		message: String!
		value: Boolean!
		note: LectureNote
	}

	type LectureNoteConnection {
		edges: [LectureNote!]!
		pageInfo: PageInfo
	}
`;
