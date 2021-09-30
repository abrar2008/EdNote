import { gql } from "apollo-server-express";
// let challenges has cursor too, study this codebase
export default gql`
	extend type Query {
		get_single_challenge(challengeId: ID!): ChallengeStatus

		get_challenges: ChallengeConnection!
	}

	extend type Mutation {
		createStory(level: ID): StoryStatus

		deleteStory(storyId: ID!): StoryStatus
	}

	type StoryStatus {
		message: String!
		value: Boolean!
		story: Story
	}

	type Story {
		_id: ID!
		text: String
		image: String
		"""
		this value is either 'school', 'dept', 'faculty', 'level' depending on who the news
		was created for
		"""
		category: String!
		creator: User!
		"""
		this value can be null if the value of the category field is not 'school'
		"""
		school: School
		"""
		this value can be null if the value of the category field is not 'faculty'
		"""
		faculty: Faculty
		"""
		this value can be null if the value of the category field is not 'dept'
		"""
		dept: Dept
		"""
		this value can be null if the value of the category field is not 'level'
		"""
		level: Level
	}

	type StoryConnection {
		edges: [Story!]!
		pageInfo: PageInfo
	}
`;
