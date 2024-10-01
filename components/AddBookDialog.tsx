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
import { createBook } from '@/lib/actions'

export default function AddBookDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

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
      await createBook({ title, authorName, coverImage })
      form.reset()
      setOpen(false)
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
  )
}
