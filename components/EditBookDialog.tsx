'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { updateBook } from '@/lib/actions'
import { BookType } from '@/lib/types'
import { Edit } from 'lucide-react'

interface EditBookDialogProps {
  book: BookType
  onBookUpdated: (book: BookType) => void
}

export default function EditBookDialog({
  book,
  onBookUpdated,
}: EditBookDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleUpdateBook = async (event: React.FormEvent<HTMLFormElement>) => {
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
      const updatedBook = await updateBook({
        id: book.id,
        title,
        authorName,
        coverImage: coverImage || undefined,
      })
      onBookUpdated(updatedBook)
      setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Edit className='w-4 h-4 mr-2' />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateBook} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-title'>Title</Label>
            <Input
              id='edit-title'
              name='title'
              defaultValue={book.title}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='edit-author'>Author</Label>
            <Input
              id='edit-author'
              name='author'
              defaultValue={book.author?.name ?? ''}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='edit-coverImage'>Cover Image URL (optional)</Label>
            <Input
              id='edit-coverImage'
              name='coverImage'
              defaultValue={book.coverImage || ''}
            />
          </div>
          <Button type='submit'>Update Book</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
