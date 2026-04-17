import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fitpro-frontend-6t6x4jnrc-ibritzkes-projects.vercel.app",
    "https://fitpro-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Servir imagens publicamente
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(routes);

export default app;