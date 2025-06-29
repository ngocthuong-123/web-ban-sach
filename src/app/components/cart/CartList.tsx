import CartItem from './CartItem';

interface Props {
  items: CartItemType[];
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onToggleStatus: (id: number, status: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
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
export default function CartList({
  items,
  onQuantityChange,
  onRemove,
  onToggleStatus,
  onSelectAll,
  onDeselectAll,
}: Props) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md md:col-span-2 space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-custom">
      
      {items.length > 0 && (
  <>
    <div className="grid grid-cols-[40px_1fr_100px_120px_80px] gap-4 text-sm font-semibold text-gray-600 px-2">
      <span></span>
      <span>Sản phẩm</span>
      <span>Đơn giá</span>
      <span>Số lượng</span>
      <span>Thao tác</span>
    </div>

    {/* <div className="flex items-center justify-end gap-2 mb-2 mt-1">
      <input
        type="checkbox"
        checked={items.every((item) => item.status === 1)}
        onChange={(e) => (e.target.checked ? onSelectAll() : onDeselectAll())}
      />
      <label className="text-sm">Chọn tất cả</label>
    </div> */}
  </>
)}

      {items.length > 0 && (
        <div className="flex items-center justify-end gap-2 mb-2 text-gray-700">
          <input
            type="checkbox"
            checked={items.every((item) => item.status === 1)}
            onChange={(e) => (e.target.checked ? onSelectAll() : onDeselectAll())}
          />
          <label className=" text-xs">Chọn tất cả</label>
        </div>
      )}

      {items.length === 0 ? (
        <p>Chưa có sản phẩm trong giỏ hàng.</p>
      ) : (
        items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onToggleStatus={onToggleStatus}
          />
        ))
      )}
    </div>
  );
}
