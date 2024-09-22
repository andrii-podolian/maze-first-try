'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { Edit, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

import { createBook, updateBook, deleteBook } from '@/lib/actions'

interface BookType {
  id: number
  title: string
  author: { name: string }
  coverImage: string
}

export default function Page() {
  const [books, setBooks] = useState<BookType[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editingBook, setEditingBook] = useState<BookType | null>(null)
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
      const newBooks = await res.json()
      setBooks((prevBooks) => [...prevBooks, ...newBooks])
      setPage((prevPage) => prevPage + 1)
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

  const handleCreateBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const authorName = formData.get('author') as string
    const coverImage = formData.get('coverImage') as string

    if (!title || !authorName) {
      toast({
        title: 'Error',
        description: 'Title and author are required.',
        variant: 'destructive',
      })
      return
    }

    try {
      const newBook = await createBook({ title, authorName, coverImage })
      setBooks((prevBooks) => [newBook, ...prevBooks])
      form.reset()
      toast({
        title: 'Success',
        description: 'Book created successfully.',
      })
    } catch (error) {
      console.error('Error creating book:', error)
      toast({
        title: 'Error',
        description: 'Failed to create book. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingBook) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    const authorName = formData.get('author') as string
    const coverImage = formData.get('coverImage') as string

    if (!title || !authorName) {
      toast({
        title: 'Error',
        description: 'Title and author are required.',
        variant: 'destructive',
      })
      return
    }

    try {
      const updatedBook = await updateBook({
        id: editingBook.id,
        title,
        authorName,
        coverImage,
      })
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        )
      )
      setEditingBook(null)
      toast({
        title: 'Success',
        description: 'Book updated successfully.',
      })
    } catch (error) {
      console.error('Error updating book:', error)
      toast({
        title: 'Error',
        description: 'Failed to update book. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteBook = async (id: number) => {
    try {
      await deleteBook(id)
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
      toast({
        title: 'Success',
        description: 'Book deleted successfully.',
      })
    } catch (error) {
      console.error('Error deleting book:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete book. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Book Library</h1>
        </div>
      </header>
      <main>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='px-4 py-6 sm:px-0'>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='mb-4'>Add New Book</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateBook} className='space-y-4'>
                  <div>
                    <Label htmlFor='title'>Title</Label>
                    <Input id='title' name='title' required />
                  </div>
                  <div>
                    <Label htmlFor='author'>Author</Label>
                    <Input id='author' name='author' required />
                  </div>
                  <div>
                    <Label htmlFor='coverImage'>Cover Image URL</Label>
                    <Input id='coverImage' name='coverImage' />
                  </div>
                  <Button type='submit'>Create Book</Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent>
                      <Image
                        src={book.coverImage || '/placeholder.svg'}
                        alt={book.title}
                        width={300}
                        height={192}
                        className='w-full h-48 object-cover mb-4'
                      />
                      <h2 className='text-lg font-semibold'>{book.title}</h2>
                      <p className='text-sm text-gray-500'>
                        {book.author?.name}
                      </p>
                    </CardContent>
                    <CardFooter className='flex justify-between'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setEditingBook(book)}
                          >
                            <Edit className='w-4 h-4 mr-2' />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Book</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={handleUpdateBook}
                            className='space-y-4'
                          >
                            <div>
                              <Label htmlFor='edit-title'>Title</Label>
                              <Input
                                id='edit-title'
                                name='title'
                                defaultValue={editingBook?.title}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor='edit-author'>Author</Label>
                              <Input
                                id='edit-author'
                                name='author'
                                defaultValue={editingBook?.author?.name}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor='edit-coverImage'>
                                Cover Image URL
                              </Label>
                              <Input
                                id='edit-coverImage'
                                name='coverImage'
                                defaultValue={editingBook?.coverImage}
                              />
                            </div>
                            <Button type='submit'>Update Book</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className='w-4 h-4 mr-2' />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
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
