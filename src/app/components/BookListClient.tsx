// 'use client';

// import React from 'react';
// import { Book } from '@/app/types/Book';
// import BookCard from '@/app/components/BookCard';

// interface BookListClientProps {
//   books: Book[];
// }

// export default function BookListClient({ books }: BookListClientProps) {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//       {books.map((book) => (
//         <BookCard key={book.id} book={book} />
//       ))}
//     </div>
//   );
// }
'use client';

import React from 'react';
import { Book } from '@/app/types/Book';
import BookCard from '@/app/components/BookCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface BookListClientProps {
  books: Book[];
}

export default function BookListClient({ books }: BookListClientProps) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
    >
      {books.map((book) => (
        <SwiperSlide key={book.id} className="h-full">
          <BookCard book={book}  />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
