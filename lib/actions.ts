'use server'

import { db } from '@/lib/db/drizzle'
import { books, authors } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { BookType } from '@/lib/types'

export async function createBook({
  title,
  authorName,
  coverImage,
}: {
  title: string
  authorName: string
  coverImage?: string
}): Promise<BookType> {
  const author = await db
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
}): Promise<BookType> {
  const author = await db
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

export async function deleteBook(id: number): Promise<void> {
  await db.delete(books).where(eq(books.id, id))
}

export async function getBooks(
  page: number,
  limit: number = 10
): Promise<BookType[]> {
  const offset = (page - 1) * limit
  const fetchedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      coverImage: books.coverImage,
      authorId: books.authorId,
      authorName: authors.name,
    })
    .from(books)
    .leftJoin(authors, eq(books.authorId, authors.id))
    .orderBy(desc(books.id))
    .limit(limit)
    .offset(offset)

  return fetchedBooks.map((book) => ({
    id: book.id,
    title: book.title,
    coverImage: book.coverImage,
    author: { name: book.authorName },
  }))
}
