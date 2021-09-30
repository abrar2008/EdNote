import { gql } from "apollo-server-express";

import userTypeDefs from "./user";
import schoolTypeDefs from "./school";
import facultyTypeDefs from "./faculty";
import deptTypeDefs from "./dept";
import levelTypeDefs from "./level";
import studentTypeDefs from "./student";
import newsTypeDefs from "./news";
import storyTypeDefs from "./edstory";
import genericTypeDefs from "./generic";
import courseTypeDefs from "./course";
import topicTypeDefs from "./course_topic";
import lectureTypeDefs from "./lecture_notes";
// import rewardTypeDefs from "./reward_point";

const typeDefs = gql`
	scalar Date
	scalar Upload

	type Query {
		_: String
	}
	type Mutation {
		_: String
	}
	type Subscription {
		_: String
	}
`;

export default [
	typeDefs,
	userTypeDefs,
	schoolTypeDefs,
	facultyTypeDefs,
	deptTypeDefs,
	levelTypeDefs,
	studentTypeDefs,
	newsTypeDefs,
	storyTypeDefs,
	genericTypeDefs,
	courseTypeDefs,
	topicTypeDefs,
	lectureTypeDefs,
	// rewardTypeDefs,
];
