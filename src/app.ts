import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir imagens publicamente
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(routes);

export default app;