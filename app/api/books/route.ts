import { NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { books, authors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10
  const offset = (page - 1) * limit

  try {
    const allBooks = await db
      .select()
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
      .limit(limit)
      .offset(offset)
    return NextResponse.json(allBooks)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, authorName, coverImage } = body

  if (!title || !authorName) {
    return NextResponse.json(
      { error: 'Title and author are required' },
      { status: 400 }
    )
  }

  try {
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
    return NextResponse.json(newBook[0])
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, title, authorName, coverImage } = body

  if (!id || !title || !authorName) {
    return NextResponse.json(
      { error: 'ID, title, and author are required' },
      { status: 400 }
    )
  }

  try {
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
    return NextResponse.json(updatedBook[0])
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
  }

  try {
    await db.delete(books).where(eq(books.id, parseInt(id, 10)))
    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
