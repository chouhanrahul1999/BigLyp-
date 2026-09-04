import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("created_at").notNull().$defaultFn(() => Math.floor(Date.now() / 1000))
})

export const tasks = sqliteTable("tasks", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum : ["todo", "in-progress", "done"] }).notNull().default("todo"),
    createdAt: integer("created_at").notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
    dueDate: integer("due_date"),
    updatedAt: integer("updated_at").notNull().$defaultFn(() => Math.floor(Date.now() / 1000))
});

export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
