import {
  getBookBySlug,
  getOtherBooksByCategory,
} from "@/app/services/api/books";
import { notFound } from "next/navigation";
import BookDetailClientSection from "@/app/components/BookDetailClientSection";
import BookListCarousel from "@/app/components/BookListCarousel";
import { Book } from "@/app/types/Book";

export default async function BookDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await getBookBySlug(params.slug);
  const book = res?.data?.data;

  if (!book) return notFound();

  const otherBooksRes = await getOtherBooksByCategory(params.slug);
  const otherBooks: Book[] = otherBooksRes?.data || [];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-4">Sách theo thể loại:</h1>
        <BookDetailClientSection book={book} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mt-8 mb-4">
          Có thể bạn cũng thích
        </h2>
        {/* <BookListClient books={otherBooks.slice(0, 8)} /> */}
        <BookListCarousel books={otherBooks.slice(0, 12)} />
      </div>
    </div>
  );
}
