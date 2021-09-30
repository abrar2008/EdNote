import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		"""
		only by an admin
		"""
		get_settings: Settings!
	}
	"""
	only by an admin
	"""
	extend type Mutation {
		editSettings(type: String, point: Int!): SettingStatus!
	}

	type Settings {
		_id: ID!
		hours_spent: Int!
		test_challenges: Int!
		refferal: Int!
		subscription: Int!
	}

	type SettingStatus {
		message: String!
		value: Boolean!
		settings: Settings
	}
`;
