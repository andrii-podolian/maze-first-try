'use client'

import Image from 'next/image'
import { Edit, Trash2, Book } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EditBookDialog from './EditBookDialog'
import { BookType } from '@/lib/types'
import { deleteBook } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'

interface BookCardProps {
  book: BookType
  onBookUpdated: (book: BookType) => void
  onBookRemoved: (id: number) => void
}

export default function BookCardComponent({
  book,
  onBookUpdated,
  onBookRemoved,
}: BookCardProps) {
  const { toast } = useToast()

  const handleDeleteBook = async () => {
    try {
      await deleteBook(book.id)
      onBookRemoved(book.id)
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
    <Card>
      <CardContent className='p-4'>
        <div className='relative w-full h-48 mb-4'>
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-md'
            />
          ) : (
            <div className='w-full h-full bg-gray-200 rounded-md flex items-center justify-center'>
              <Book className='w-16 h-16 text-gray-400' />
            </div>
          )}
        </div>
        <h2 className='text-lg font-semibold line-clamp-1'>{book.title}</h2>
        <p className='text-sm text-gray-500 line-clamp-1'>
          {book.author?.name}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between p-4'>
        <EditBookDialog book={book} onBookUpdated={onBookUpdated} />
        <Button variant='destructive' size='sm' onClick={handleDeleteBook}>
          <Trash2 className='w-4 h-4 mr-2' />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
