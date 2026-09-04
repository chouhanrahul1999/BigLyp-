import { Hono } from "hono";

export type Env = {
    DB: D1Database;
    JWT_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => c.json({ message: "Task Manager API" }));

export default app;
