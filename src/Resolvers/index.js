import { GraphQLDateTime } from "graphql-iso-date";
import { GraphQLUpload } from "graphql-upload";

// ========= Resolvers ========//
import userResolver from "./user";
import schoolResolver from "./school";
import facultyResolver from "./faculty";
import deptResolver from "./dept";
import levelResolver from "./level";
import studentResolver from "./student";
import newsResolver from "./news";
import storyResolver from "./edstory";
import courseResolver from "./course";
import topicResolver from "./course_topic";
import lectureNoteResolver from "./lecture_note";
// import rewardPointResolver from "./reward_point";

const customDateScalarResolver = {
	Date: GraphQLDateTime,
};

const customFileUploadResolver = {
	Upload: GraphQLUpload,
};

export default [
	userResolver,
	schoolResolver,
	facultyResolver,
	deptResolver,
	levelResolver,
	studentResolver,
	newsResolver,
	storyResolver,
	courseResolver,
	topicResolver,
	lectureNoteResolver,
	customDateScalarResolver,
	customFileUploadResolver,
	// rewardPointResolver,
];
