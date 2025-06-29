import { getToken } from "@/app/utils/storage";
import { Book } from "../../types/Book";
import { showSuccess } from "@/app/utils/toast";
import Image from "next/image";
import { getImageURL } from "@/app/config"; // giả định bạn có hàm này

interface Props {
  selectedItems: { product: Book; quantity: number }[];
  onRemove: (bookId: number) => void;
  onChangeQty: (bookId: number, quantity: number) => void;
  onSuccess?: () => void;
}

export default function SelectedItemsPanel({
  selectedItems,
  onRemove,
  onChangeQty,
  onSuccess,
}: Props) {
  const total = selectedItems.reduce((acc, item) => {
    const unitPrice = item.product.price ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert("Chưa có sản phẩm nào được chọn.");
      return;
    }
    const orderData = selectedItems.map((item) => ({
      product_id: item.product.id,
      quantity: Number(item.quantity),
    }));

    const token = getToken();
    if (!token) return null;

    try {
      const res = await fetch("http://localhost:8000/api/from-employee", {
        method: "POST",
        body: JSON.stringify({ order_items: orderData }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", res.status, text);
        alert("Tạo đơn thất bại: " + text);
        return;
      }

      const data = await res.json();
      showSuccess(`Đã tạo đơn thành công!\nMã đơn: ${data.order.order_code}`);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Đơn đang tạo</h2>
      <ul className="space-y-3">
        {selectedItems.map((item) => {
          const book = item.product;
          const unitPrice = book.price ?? book.price;

          return (
            <li
              key={book.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2"
            >
              {/* Image + title */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Image
                  src={getImageURL(book.thumbnail || "")}
                  alt={book.title}
                  width={40}
                  height={60}
                  className="object-cover rounded"
                />
                <div className="text-sm font-medium truncate">{book.title}</div>
              </div>

              {/* Price info */}
              <div className="text-sm text-right sm:text-left">
                {book.price && book.price < book.price ? (
                  <>
                    <p className="text-red-600 font-semibold">
                      {unitPrice.toLocaleString()}₫
                    </p>
                    <p className="text-xs line-through text-gray-400">
                      {book.price.toLocaleString()}₫
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">{book.price.toLocaleString()}₫</p>
                )}
              </div>

              {/* Quantity & remove */}
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <input
                  type="number"
                  min={1}
                  className="w-16 border px-1 py-0.5 rounded"
                  value={item.quantity}
                  onChange={(e) =>
                    onChangeQty(book.id, Number(e.target.value))
                  }
                />
                <button
                  onClick={() => onRemove(book.id)}
                  className="text-red-500 text-sm font-semibold"
                  title="Xóa"
                >
                  X
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 border-t pt-2">
        <p>
          Tổng tiền:{" "}
          <strong className="text-red-600 text-lg">
            {total.toLocaleString()}₫
          </strong>
        </p>
        <button
          onClick={handleSubmit}
          className="mt-3 bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          Xác nhận tạo đơn
        </button>
      </div>
    </div>
  );
}
