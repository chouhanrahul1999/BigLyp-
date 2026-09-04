import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import auth from "./routes/auth";

export type Env = {
    DB: D1Database;
    JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", secureHeaders());
app.use("*", cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (c) => c.json({ message: "Task Manager API" }));
app.route("/api/auth", auth);

export default app;

