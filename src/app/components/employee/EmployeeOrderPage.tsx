import { useState } from "react";
import SelectedItemsPanel from "./SelectedItemsPanel";
import { Book } from "@/app/types/Book";

export default function EmployeeOrderPage() {
  const [selectedItems, setSelectedItems] = useState<
    { product: Book; quantity: number }[]
  >([]);

  // Hàm xóa tất cả selected items, dùng làm onSuccess callback
  const resetSelectedItems = () => {
    console.log("Resetting selected items...");
    setSelectedItems([]);
  };

  return (
    <div>
      {/* Các phần khác: danh sách sản phẩm, chọn sản phẩm thêm vào selectedItems,... */}
      <SelectedItemsPanel
        selectedItems={selectedItems}
        onRemove={(id) =>
          setSelectedItems((prev) =>
            prev.filter((item) => item.product.id !== id)
          )
        }
        onChangeQty={(id, qty) =>
          setSelectedItems((prev) =>
            prev.map((item) =>
              item.product.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onSuccess={resetSelectedItems} // truyền hàm reset
      />
    </div>
  );
}
