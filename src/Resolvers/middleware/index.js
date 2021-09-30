import { AuthenticationError } from "apollo-server-express";
import { combineResolvers, skip } from "graphql-resolvers";

// Protection for all logged in users
export const isAuthenticated = (_, __, { logged_in_user }) =>
	// add verified here
	logged_in_user
		? skip
		: new AuthenticationError("Access Denied! Please login to continue");

// Protection for regular users
export const isUser = combineResolvers(isAuthenticated, (_, __, { userType }) =>
	userType === "user" || userType === "admin"
		? skip
		: new AuthenticationError("Not Authorized to perform this action")
);

// Protection for students
export const isStudent = combineResolvers(
	isAuthenticated,
	(_, __, { userType }) =>
		userType === "student"
			? skip
			: new AuthenticationError("Not Authorized to perform this action")
);

// Protection for Admin previlages
export const isAdmin = combineResolvers(
	isAuthenticated,
	(_, __, { userType }) =>
		userType === "admin"
			? skip
			: new AuthenticationError("Not Authorized to perform this action")
);

// Protection for Super Admin previlages
export const isSuperAdmin = combineResolvers(
	isAuthenticated,
	(_, __, { userType }) =>
		userType === "super_admin"
			? skip
			: new AuthenticationError("Not Authorized to perform this action")
);

// module.exports.isTaskOwner = async (_,{ id }, {loggedInUserId}) => {
//     try {
//         if(!isValidObjectId(id)){
//             throw new Error('Invalid Task id')
//         }
//         const task = await Task.findById(id)
// if (!task){
//     throw new Error('Task not found')
// }else if (task.user.toString() !== loggedInUserId){
//     throw new Error('Not authorized as task owner')
// }
// return skip
//     } catch (error) {
//         console.log(error)
//         throw error
//     }

// }
