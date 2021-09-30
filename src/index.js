import express from "express";
import cors from "cors";
import { config } from "dotenv";

import graphQlServer from "./server";

config();

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());
app.use(express.json());

graphQlServer(app, PORT).catch((err) => console.log(err));

export default app;
