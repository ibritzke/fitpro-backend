import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://fitpro-frontend-6t6x4jnrc-ibritzkes-projects.vercel.app",
    "https://fitpro-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// app.options("*", cors(corsOptions)); // Removido: app.use(cors()) já trata OPTIONS no Express 5


app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(routes);

export default app;