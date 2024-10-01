import { motion } from 'framer-motion'
import BookCard from './BookCard'
import { BookType } from './types'

interface BookListProps {
  books: BookType[]
  setBooks: React.Dispatch<React.SetStateAction<BookType[]>>
}

export default function BookList({ books, setBooks }: BookListProps) {
  return (
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
  )
}
