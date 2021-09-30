import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Settings from "../database/Models/settings";

// ============= Services ===============//
import { isAdmin } from "./middleware";

export default {
	Query: {
		get_settings: combineResolvers(isAdmin, async () => {
			try {
				const settings = await Settings.findOne();
				if (!settings) throw new ApolloError("Reward points not found!");
				return settings;
			} catch (error) {
				throw error;
			}
		}),
	},

	Mutation: {
		editSettings: combineResolvers(isAdmin, async (_, { type, value }) => {
			try {
				const updatedSettings = await Settings.findOneAndUpdate(
					{},
					{ [type]: value },
					{ new: true }
				);

				return {
					message: "Settings updated successfully",
					value: true,
					settings: updatedSettings,
				};
			} catch (error) {
				throw error;
			}
		}),
	},
};
