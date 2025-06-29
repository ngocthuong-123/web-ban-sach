// 'use client';

// import dynamic from 'next/dynamic';
// import { Book } from '@/app/types/Book';
// import Image from 'next/image';
// import Link from 'next/link';
// import { getImageURL } from '../config';

// // dynamic import OwlCarousel vì nó dùng jQuery
// const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
//   ssr: false,
// });

// export default function BookListCarousel({ books }: { books: Book[] }) {
//   const options = {
//     loop: true,
//     margin: 10,
//     nav: true,
//     responsive: {
//       0: { items: 2 },
//       600: { items: 3 },
//       1000: { items: 5 },
//     },
//   };

//   return (
//     <OwlCarousel className="owl-theme" {...options}>
//       {books.map((book) => (
//         <div key={book.id} className="item">
//           <Link href={`/books/${book.id}`}>
//             <div className="p-2 bg-white rounded shadow hover:shadow-md transition">
//               <Image
//                 src={getImageURL(book.thumbnail || "")}
//                 alt={book.title}
//                 width={120}
//                 height={160}
//                 className="mx-auto"
//               />
//               <h3 className="text-sm font-semibold mt-2 text-center line-clamp-2">{book.title}</h3>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </OwlCarousel>
//   );
// }
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { Book } from '@/app/types/Book';
import Image from 'next/image';
import Link from 'next/link';
import { getImageURL } from '../config';

export default function BookListCarousel({ books }: { books: Book[] }) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      slidesPerView={5}
      breakpoints={{
        0: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
      className="py-2"
    >
      {books.map((book) => (
        <SwiperSlide key={book.id}>
          <Link href={`/books/${book.slug}`}>
            <div className="p-2 bg-white rounded shadow hover:shadow-md transition">
              <Image
                src={getImageURL(book.thumbnail || "")}
                alt={book.title}
                width={120}
                height={160}
                className="mx-auto"
              />
              <h3 className="text-sm font-semibold mt-2 text-center line-clamp-2">{book.title}</h3>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
