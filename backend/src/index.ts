import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import auth from "./routes/auth";
import tasksRoute from "./routes/tasks";

export type Env = {
    DB: D1Database;
    JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", secureHeaders());
app.use("*", cors({
  origin: [
    "http://localhost:3000",
    "https://e85c1e4b.task-manager-frontend-an3.pages.dev",
    "https://83ab1ced.task-manager-frontend-an3.pages.dev",
    "https://6beebbdb.task-manager-frontend-an3.pages.dev",
    "https://task-manager-frontend-an3.pages.dev",
  ],
  allowMethods: ["GET", "POST", "PATCH", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (c) => c.json({ message: "Task Manager API" }));
app.route("/api/auth", auth);
app.route("/api/tasks", tasksRoute);

export default app;

