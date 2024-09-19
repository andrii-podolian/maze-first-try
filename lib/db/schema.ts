import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  authorId: serial('author_id').references(() => authors.id),
})

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  bookId: serial('book_id').references(() => books.id),
})

// Define relationships (optional, but useful for type safety and querying)
export const authorRelations = relations(authors, ({ one }) => ({
  books: one(books, {
    fields: [authors.id],
    references: [books.authorId],
  }),
}))

export const bookRelations = relations(books, ({ one, many }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  quotes: many(quotes, {
    relationName: 'bookQuotes',
  }),
}))
