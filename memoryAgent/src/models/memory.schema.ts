import { index, numeric, pgEnum, pgTable, text, timestamp, varchar, vector } from "drizzle-orm/pg-core";

export const memoryTypeEnum = pgEnum("memory_type", ["episodic", "behavioral", "semantic"]);
export const memoryStatusEnum = pgEnum("memory_status", ["active", "superseded"]);

export const memoryTable = pgTable("memory", {
    id: varchar("id", { length: 225 }).primaryKey(),
    userId: varchar("userId", { length: 225 }).notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    confidence: numeric("confidence").notNull(),
    memoryType: memoryTypeEnum().notNull(),
    status: memoryStatusEnum().default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdateFn(() => new Date()).notNull(),
}, (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
}));