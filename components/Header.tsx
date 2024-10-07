import Link from 'next/link'

export default function Header() {
  return (
    <header className='bg-white shadow'>
      <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-gray-900'>Book Library</h1>
          <Link href='/login' className='text-black-600 hover:text-blue-800'>
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
