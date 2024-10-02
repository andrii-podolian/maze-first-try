'use client'

import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
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

export default function BookCard({
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
      <CardContent>
        <Image
          src={book.coverImage || '/placeholder.svg'}
          alt={book.title}
          width={300}
          height={192}
          className='w-full h-48 object-cover mb-4'
        />
        <h2 className='text-lg font-semibold'>{book.title}</h2>
        <p className='text-sm text-gray-500'>{book.author?.name}</p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <EditBookDialog book={book} onBookUpdated={onBookUpdated} />
        <Button variant='destructive' size='sm' onClick={handleDeleteBook}>
          <Trash2 className='w-4 h-4 mr-2' />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
