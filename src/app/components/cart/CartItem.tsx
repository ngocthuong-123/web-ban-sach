import Image from 'next/image';
import { getImageURL } from '../../config';
interface Props {
  item: CartItemType;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onToggleStatus: (id: number, status: number) => void;
}
interface CartItemType {
  id: number;
  book: Book;
  quantity: number;
  status: number; // 1 = selected, 0 = unselected
}
interface Book {
  id: number;
  name: string;
  thumbnail: string;
  price: number;
}
export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
  onToggleStatus,
}: Props) {
  return (
    <div className="bg-[#F6F1EB] grid items-center grid-cols-[40px_1fr_100px_120px_80px] gap-4 rounded-lg p-4 shadow-sm">
  <input
    type="checkbox"
    checked={item.status === 1}
    onChange={(e) => onToggleStatus(item.id, e.target.checked ? 1 : 0)}
  />

  {/* Sản phẩm (ảnh + tên) */}
  <div className="flex items-center gap-4">
    <Image
      src={getImageURL(item.book.thumbnail)}
      alt={item.book.name || 'Ảnh sản phẩm'}
      width={80}
      height={100}
      className="object-cover rounded-md"
    />
    <div>
      <h3 className="font-semibold">{item.book.name}</h3>
    </div>
  </div>

  {/* Giá */}
  <div className="text-gray-700 font-medium">
    {item.book.price.toLocaleString()}₫
  </div>

  {/* Số lượng */}
  <div className="text-gray-700 flex items-center space-x-2">
    <button
      onClick={() => onQuantityChange(item.id, item.quantity - 1)}
      disabled={item.quantity <= 1}
      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-300"
    >
      -
    </button>
    <span>{item.quantity}</span>
    <button
      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
      className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-300"
    >
      +
    </button>
  </div>

  {/* Xóa */}
  <button
    onClick={() => onRemove(item.id)}
    className="text-orange-800 hover:underline"
  >
    Xóa
  </button>
</div>

  );
}
