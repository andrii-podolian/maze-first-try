'use server'

import { db } from '@/lib/db/drizzle'
import { books, authors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function createBook({
  title,
  authorName,
  coverImage,
}: {
  title: string
  authorName: string
  coverImage?: string
}) {
  let author = await db
    .select()
    .from(authors)
    .where(eq(authors.name, authorName))
    .limit(1)
  let authorId

  if (author.length === 0) {
    const newAuthor = await db
      .insert(authors)
      .values({ name: authorName })
      .returning({ id: authors.id })
    authorId = newAuthor[0].id
  } else {
    authorId = author[0].id
  }

  const newBook = await db
    .insert(books)
    .values({ title, authorId, coverImage })
    .returning()
  return { ...newBook[0], author: { name: authorName } }
}

export async function updateBook({
  id,
  title,
  authorName,
  coverImage,
}: {
  id: number
  title: string
  authorName: string
  coverImage?: string
}) {
  let author = await db
    .select()
    .from(authors)
    .where(eq(authors.name, authorName))
    .limit(1)
  let authorId

  if (author.length === 0) {
    const newAuthor = await db
      .insert(authors)
      .values({ name: authorName })
      .returning({ id: authors.id })
    authorId = newAuthor[0].id
  } else {
    authorId = author[0].id
  }

  const updatedBook = await db
    .update(books)
    .set({ title, authorId, coverImage })
    .where(eq(books.id, id))
    .returning()
  return { ...updatedBook[0], author: { name: authorName } }
}

export async function deleteBook(id: number) {
  await db.delete(books).where(eq(books.id, id))
}
