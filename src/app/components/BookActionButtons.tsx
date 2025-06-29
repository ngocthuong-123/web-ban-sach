// 'use client';

// import { useEffect, useState } from 'react';
// import { FaShoppingCart } from 'react-icons/fa';
// import { addToCartGuest, addToCartBuyNow } from '@/app/services/api/cart';
// import { useRouter } from 'next/navigation';
// import { getSessionId } from '../utils/storage'; // helper
// import { showError, showSuccess, showInfo, showWarning } from "../utils/toast";

// export default function BookActionButtons({ bookId }: { bookId: number }) {
//   const router = useRouter();
//   const [sessionId, setSessionId] = useState('');

//   useEffect(() => {
//     setSessionId(getSessionId());
//   }, []);

//   const handleAddToCart = async () => {
//     try {
//       await addToCartGuest(bookId, 1, sessionId);
//       showSuccess('Đã thêm vào giỏ hàng!');
//     } catch (err) {
//       console.error(err);
//       showError('Lỗi khi thêm vào giỏ hàng');
//     }
//   };

//   const handleBuyNow = async () => {
//     try {
//       await addToCartBuyNow(bookId, 1, sessionId);
//       router.push('/cart');
//     } catch (err) {
//       console.error(err);
//       showError('Lỗi khi mua ngay');
//     }
//   };

//   return (
//     <div className="flex gap-4 mt-4">
//       <button
//         className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
//         onClick={handleBuyNow}
//       >
//         <FaShoppingCart /> Mua ngay
//       </button>
//       <button
//         className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
//         onClick={handleAddToCart}
//       >
//         <FaShoppingCart /> Thêm vào giỏ
//       </button>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getSessionId, getToken } from '../utils/storage';
import { showError, showSuccess } from "../utils/toast";
import {
  addToCartGuest,
  addToCartBuyNow,
  addToCart,
  buyNowUser,
} from '@/app/services/api/cart';

export default function BookActionButtons({ bookId }: { bookId: number }) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(getSessionId());
    setToken(localStorage.getItem("access_token")); // hoặc getToken() nếu bạn có helper
  }, []);

  const handleAddToCart = async () => {
    try {
      if (token) {
        await addToCart(bookId, 1); // user có token
      } else {
        await addToCartGuest(bookId, 1, sessionId); // guest
      }
      showSuccess('✅ Đã thêm vào giỏ hàng!');
    } catch (err) {
      console.error(err);
      showError('❌ Lỗi khi thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (token) {
        await buyNowUser(bookId, 1); // user có token
      } else {
        await addToCartBuyNow(bookId, 1, sessionId); // guest
      }
      router.push('/cart'); // điều hướng tới giỏ hàng
    } catch (err) {
      console.error(err);
      showError('❌ Lỗi khi mua ngay');
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
        onClick={handleBuyNow}
      >
        <FaShoppingCart /> Mua ngay
      </button>
      <button
        className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all"
        onClick={handleAddToCart}
      >
        <FaShoppingCart /> Thêm vào giỏ
      </button>
    </div>
  );
}
