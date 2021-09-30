import Agenda from "agenda";

import config from "../helper/config";

// ============= CRON FUNCTIONS ===============//
import { deleteStory } from "./jobs";
const { MONGO_DB_URI } = config;

const agenda = new Agenda({
	db: {
		address: MONGO_DB_URI,
		collection: "AgendaJobs",
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},
});

agenda.start();

// ============ Job definitions ============//
agenda.define("delete stories", async (job) => {
	const {
		attrs: { data },
	} = job;

	await deleteStory(data.id);
});

export { agenda };
