
import { getBooksByCategory, getOtherBooksByCategory } from '@/app/services/api/books';
import { Book } from '@/app/types/Book';
import { notFound } from 'next/navigation';
import BookListClient from '../../../components/BookListClient';
import BookListCarousel from '@/app/components/BookListCarousel';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryRes = await getBooksByCategory(params.slug, 1, 10);
const books: Book[] = categoryRes?.data?.data || [];
  const categoryName = categoryRes?.data?.data?.category?.name || params.slug;

  if (!books.length) return notFound();

  const otherBooksRes = await getOtherBooksByCategory(params.slug);
  const otherBooks: Book[] = otherBooksRes?.data || [];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-4">Sách theo thể loại:</h1>
        <BookListClient books={books} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-8 mb-4">Có thể bạn cũng thích</h2>
        {/* <BookListClient books={otherBooks.slice(0, 8)} /> */}
        <BookListCarousel books={otherBooks.slice(0, 12)} />
      </div>
    </div>
  );
}
