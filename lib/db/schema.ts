import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authorId: serial('author_id').references(() => authors.id),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
}));