import { Suspense } from 'react'
import BookList from '@/components/BookList'
import Header from '@/components/Header'
import { getBooks } from '@/lib/actions'

export const revalidate = 3600 // Revalidate every hour

export default async function Page() {
  const initialBooks = await getBooks(1)

  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <main>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='px-4 py-6 sm:px-0'>
            <Suspense fallback={<div>Loading books...</div>}>
              <BookList initialBooks={initialBooks} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
