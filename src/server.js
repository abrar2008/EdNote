import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";

import { connection } from "./database/util";
import { verifyUser } from "./helper/context";
import { agenda } from "./services/agenda";
import resolvers from "./Resolvers";
import typeDefs from "./typeDefs";
import config from "./helper/config";
const { NODE_ENV } = config;

const graphQlServer = async (app, PORT) => {
	// Connect to database
	connection();

	agenda;

	const server = new ApolloServer({
		introspection: true, // Change to false in production
		playground: true,
		uploads: false,
		typeDefs,
		resolvers,
		context: async ({ req, connection }) => {
			// Check for either a http request or a subscription
			if (connection) {
				return connection.context;
			} else {
				// Http request
				// get the request header
				const header = req.headers.authorization || "";

				const user = await verifyUser(header);
				if (!user) {
					return {
						logged_in_user: false,
						Id: null,
						userType: null,
					};
				} else {
					return {
						logged_in_user: true,
						Id: user.userId,
						userType: user.userType,
					};
				}
			}
		},
		formatError: (error) => {
			const env = NODE_ENV !== "production" ? error : error.message;
			return {
				message: env,
			};
		},
	});

	app.use(graphqlUploadExpress({ maxFileSize: 400000000, maxFiles: 10 }));
	server.applyMiddleware({ app, path: "/graphql" });

	const httpServer = app.listen(PORT, () => {
		console.log(`Server listening on PORT: ${PORT}`);
		console.log(`Graphql Endpoint: ${server.graphqlPath}`);
	});

	server.installSubscriptionHandlers(httpServer);
};

export default graphQlServer;
