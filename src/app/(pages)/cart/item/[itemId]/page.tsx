'use client';

import React, { useEffect, useState } from 'react';
import { getImageURL, formatPrice } from '../../../../config'; 
import { useParams } from 'next/navigation';
import { fetchCartItem } from '../../../../services/api/cart';
import { useRouter } from 'next/navigation';
import { checkUserDetail } from '../../../../services/api/orders';


interface Book {
  id: number;
  title: string;
  slug: string;
  sku: string;
  barcode: string;
  thumbnail: string;
  price: number;
  pricesale: number;
  category?: { name: string };
  author?: { name: string };
  publisher?: { name: string };
}

interface CartItem {
  id: number;
  quantity: number;
  book: Book;
}

export default function CartItemDetailPage() {
  const [item, setItem] = useState<CartItem | null>(null);
  const { itemId } = useParams();
  const router = useRouter();


  useEffect(() => {
    const loadItemDetail = async () => {
      try {
        if (!itemId) return;

        const id = Number(itemId);
        if (isNaN(id)) {
          console.error('ID không hợp lệ');
          return;
        }

        const itemDetail = await fetchCartItem(id);
        setItem(itemDetail);
      } catch (error) {
        console.error('Lỗi khi load chi tiết mục giỏ hàng:', error);
      }
    };

    loadItemDetail();
  }, [itemId]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🛒 Chi tiết sản phẩm trong giỏ hàng</h1>

      {!item ? (
        <p>đang tải...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 p-4 rounded-lg shadow bg-white">
          {/* Hình ảnh */}
          <div className="w-full md:w-1/3 flex items-center justify-center bg-gray-100 rounded-lg p-2 hover:scale-[1.01]">
            <img
              src={getImageURL(item.book.thumbnail)}
              alt={item.book.title}
              className="h-[300px] object-contain rounded"
            />
          </div>

          {/* Thông tin sách */}
          <div className="flex-1 bg-yellow-100 rounded-lg p-4 shadow-inner transition-transform duration-200">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Cột trái */}
              <div className="space-y-1">
                <h2 className="text-xl font-semibold mb-2">{item.book.title}</h2>
                <div className="grid grid-cols-[130px_1fr] gap-y-1 text-[16px]">
                  <div><strong>ID:</strong></div>
                  <div>{item.book.id}</div>

                  <div><strong>Tác giả:</strong></div>
                  <div>{item.book.author?.name || 'Không rõ'}</div>

                  <div><strong>Nhà xuất bản:</strong></div>
                  <div>{item.book.publisher?.name || 'Không rõ'}</div>

                  <div><strong>Danh mục:</strong></div>
                  <div>{item.book.category?.name || 'Không rõ'}</div>

                  <div><strong>SKU:</strong></div>
                  <div>{item.book.sku}</div>

                  <div><strong>Barcode:</strong></div>
                  <div>{item.book.barcode}</div>

                  <div><strong>Giá gốc:</strong></div>
                  <div>{formatPrice(item.book.price)}</div>

                  <div><strong>Giá khuyến mãi:</strong></div>
                  <div>{item.book.pricesale > 0 ? formatPrice(item.book.pricesale) : 'Không có'}</div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-3 text-sm">
                <p><strong>⭐ Review:</strong> (Chưa có)</p>
                <p><strong>❤️ Wishlist:</strong> (Chưa có)</p>
                <p><strong>💬 Bình luận:</strong> (Chưa có)</p>
                <p><strong>📈 Đã bán:</strong> 0</p>

                {/* Tăng giảm số lượng */}
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                  <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
                </div>
<button
  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  onClick={async () => {
    try {
      const userDetail = await checkUserDetail();

      // Nếu thiếu thông tin liên hệ, chuyển đến trang nhập
      if (!userDetail || !userDetail.phone || !userDetail.address) {
        router.push('/lien-he');
        return;
      }

      // Nếu đã có đủ thông tin
     router.push('/dat-hang');
      // Hoặc chuyển hướng: router.push('/thanh-toan');
    } catch (err) {
      console.error('Lỗi khi kiểm tra thông tin người dùng:', err);
    }
  }}
>
  Đặt hàng
</button>


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
