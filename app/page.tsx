'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useToast } from '@/hooks/use-toast'
import Header from './Header'
import BookList from './BookList'
import AddBookDialog from './AddBookDialog'
import { BookType } from './types'

export default function Page() {
  const [books, setBooks] = useState<BookType[]>([])
  const [page, setPage] = useState(1)
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
      const res = await fetch(`/api/books?page=${page}`)
      const data = await res.json()
      const newBooks = Array.isArray(data) ? data : []
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
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <main>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='px-4 py-6 sm:px-0'>
            <AddBookDialog setBooks={setBooks} />
            <BookList books={books} setBooks={setBooks} />
            {loading && (
              <p className='text-center mt-4'>Loading more books...</p>
            )}
            <div ref={ref} style={{ height: '20px' }} />
          </div>
        </div>
      </main>
    </div>
  )
}
