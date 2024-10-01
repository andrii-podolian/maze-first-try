'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import BookCard from './BookCard'
import { BookType } from '@/lib/types'
import { getBooks } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'

interface BookListProps {
  initialBooks: BookType[]
}

export default function BookList({ initialBooks }: BookListProps) {
  const [books, setBooks] = useState<BookType[]>(initialBooks)
  const [page, setPage] = useState(2) // Start from page 2 as we already have page 1
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      loadMoreBooks()
    }
  }, [inView])

  const loadMoreBooks = async () => {
    if (loading) return
    setLoading(true)
    try {
      const newBooks = await getBooks(page)
      if (newBooks.length > 0) {
        setBooks((prevBooks) => [...prevBooks, ...newBooks])
        setPage((prevPage) => prevPage + 1)
      } else {
        toast({
          title: 'No more books',
          description: 'You have reached the end of the book list.',
          variant: 'default',
        })
      }
    } catch (error) {
      console.error('Error loading books:', error)
      toast({
        title: 'Error',
        description: 'Failed to load books. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {books.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BookCard book={book} setBooks={setBooks} />
          </motion.div>
        ))}
      </div>
      {loading && <p className='text-center mt-4'>Loading more books...</p>}
      <div ref={ref} style={{ height: '20px' }} />
    </>
  )
}
