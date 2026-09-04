
import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createDb } from "../db";
import { tasks } from "../db/schema";
import { authMiddleware } from "../middleware/auth";
import { createTaskSchema, updateTaskSchema, taskStatusFilterSchema } from "../db/validators";
import type { Env } from "../index";
import type { JwtPayload } from "../middleware/auth";

const tasksRoute = new Hono<{ Bindings: Env; Variables: { user: JwtPayload } }>();

tasksRoute.use("*", authMiddleware);

tasksRoute.get("/", async (c) => {
    const user = c.get("user");
    const query = taskStatusFilterSchema.safeParse({ status: c.req.query("status") });
    const db = createDb(c.env.DB);

    const allTasks = await db
        .select()
        .from(tasks)
        .where(
            query.success && query.data.status ? and(eq(tasks.userId, user.sub), eq(tasks.status, query.data.status)) : eq(tasks.userId, user.sub)
        )
        .all();

    return c.json(allTasks);
})

tasksRoute.post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: "Invalid request body" }, 400);
    }

    const user = c.get("user");
    const db = createDb(c.env.DB);
    const id: string = uuidv4();
    const now = Math.floor(Date.now() / 1000);

    await db.insert(tasks).values({
        id,
        userId: user.sub,
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate,
        createdAt: now,
        updatedAt: now,
    });

    const task = await db.select().from(tasks).where(eq(tasks.id, id)).get();

    return c.json(task, 201);
})

tasksRoute.get("/:id", async (c) => {
    const user = c.get("user");
    const db = createDb(c.env.DB);

    const task = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, c.req.param("id")), eq(tasks.userId, user.sub)))
        .get();

    if (!task) {
        return c.json({ error: "Task not found" }, 404);
    }

    return c.json(task);
});

tasksRoute.patch("/:id", async (c) => {
    const body = await c.req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.flatten() }, 400);
    }

    const user = c.get("user");
    const db = createDb(c.env.DB);

    const existing = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, c.req.param("id")), eq(tasks.userId, user.sub)))
        .get();

    if (!existing) {
        return c.json({ error: "Task not found" }, 404);
    }

    const updated = await db
        .update(tasks)
        .set({ ...parsed.data, updatedAt: Math.floor(Date.now() / 1000) })
        .where(and(eq(tasks.id, c.req.param("id")), eq(tasks.userId, user.sub)))
        .returning()
        .get();

    return c.json(updated);
})

tasksRoute.delete("/:id", async (c) => {
  const user = c.get("user");
  const db = createDb(c.env.DB);

  const existing = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, c.req.param("id")), eq(tasks.userId, user.sub)))
    .get();

  if (!existing) {
    return c.json({ error: "Task not found" }, 404);
  }

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, c.req.param("id")), eq(tasks.userId, user.sub)));

  return c.json({ message: "Task deleted" });
});

export default tasksRoute;
