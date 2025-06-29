"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewModal from "../../../components/ReviewModal";
const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  completed: "Đã hoàn tất",
  canceled: "Đã hủy",
};

export default function OrderDetailPage() {
  const { order_code } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !order_code) return;

    fetch(`http://localhost:8000/api/orders-detail/${order_code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Lỗi khi lấy đơn hàng:", err));
  }, [order_code]);

  if (!order) return <p>Đang tải chi tiết đơn hàng...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6 mt-10 leading-loose">
      <h2 className="text-2xl font-bold">
        Chi tiết đơn hàng #{order.order_code}
      </h2>

      {/* Thông tin chung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <p>
          <strong>Trạng thái:</strong>
          {statusLabels[order.status] || order.status}
        </p>
        <p>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Phương thức thanh toán:</strong>{" "}
          {order.payment_method.toUpperCase()}
        </p>
        {/* <p><strong>Đã thanh toán:</strong> {order.is_paid ? 'Có' : 'Chưa'}</p> */}
        <p>
          <strong>Phí giao hàng:</strong>{" "}
          {parseFloat(order.shipping_fee).toLocaleString()} ₫
        </p>
        <p>
          <strong>Giảm giá:</strong>{" "}
          {parseFloat(order.discount_value).toLocaleString()} ₫
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {parseFloat(order.total_price).toLocaleString()} ₫
        </p>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Thông tin giao hàng:</h3>
        <p>
          <strong>Tên người nhận:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {order.customer_phone}
        </p>
        <p>
          <strong>Email:</strong> {order.customer_email}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order.customer_address}
        </p>
      </div>

      {/* Danh sách sản phẩm */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Sản phẩm trong đơn hàng:</h3>
        {order.details?.length > 0 ? (
          <ul className="space-y-4">
            {order.details.map((item: any) => (
              <li
                key={item.id}
                className="flex items-center gap-4 border p-4 rounded shadow-sm"
              >
                <img
                  src={`http://localhost:8000/storage/${item.book?.thumbnail}`}
                  alt={item.book?.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.book?.title}</h4>
                  <p>Số lượng: {item.quantity}</p>
                  <p>
                    Đơn giá: {parseFloat(item.unit_price).toLocaleString()} ₫
                  </p>
                  <p>
                    Tổng phụ:{" "}
                    {(
                      item.quantity * parseFloat(item.unit_price)
                    ).toLocaleString()}{" "}
                    ₫
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      setSelectedBookId(item.book.id);
                      setIsReviewOpen(true);
                    }}
                    className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Đánh giá sản phẩm
                  </button>

                  <ReviewModal
                    bookId={selectedBookId || 0}
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            Không có sản phẩm nào trong đơn hàng.
          </p>
        )}
      </div>
    </div>
  );
}
