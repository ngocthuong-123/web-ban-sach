"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getToken } from "../utils/storage";
type Order = {
  id: number;
  order_code: string;
  shipping_step?: string;
  status: string;
  created_at: string;
  total_price?: number;
};

interface OrderSectionProps {
  title: string;
  orders: Order[];
}
const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  completed: "Đã hoàn tất",
  canceled: "Đã hủy",
};
const shippingStepLabels: Record<string, string> = {
  packing: "Đang đóng gói",
  handover: "Đã bàn giao cho đơn vị vận chuyển",
  in_transit: "Đang vận chuyển",
  waiting_pickup: "Chờ lấy hàng",
};
const cancelReasons = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi tìm được giá tốt hơn ở nơi khác",
  "Tôi đặt nhầm sản phẩm",
  "Tôi không muốn mua nữa",
  "Khác...",
];
const OrderSection: React.FC<OrderSectionProps> = ({ title, orders }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOrders = showAll ? orders : orders.slice(0, 2);
  const [orderList, setOrderList] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalOrders = orders.length;
  const handleOpenModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setSelectedReason("");
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do hủy đơn.");
      return;
    }

    const token = getToken();
    if (!token) return alert("Vui lòng đăng nhập lại!");

    try {
      const res = await fetch(
        `http://localhost:8000/api/orders-cancel/${selectedOrderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: selectedReason, // cần backend chấp nhận nếu bạn xử lý
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Hủy đơn hàng thành công!");
        setOrderList((prev) =>
          prev.map((o) =>
            o.id === selectedOrderId ? { ...o, status: "canceled" } : o
          )
        );
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert("❌ Không thể hủy đơn: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu hủy:", err);
      alert("⚠️ Có lỗi xảy ra khi hủy đơn.");
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">Không có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">
        Tổng số đơn:{" "}
        <span className="font-medium text-gray-800">{totalOrders}</span>
      </p>

      <ul className="divide-y divide-gray-200">
        {visibleOrders.map((order) => (
          <li key={order.id} className="relative py-2 flex justify-between">
            <div>
              <span className="text-blue-600 font-medium">
                #{order.order_code}
              </span>
              <p className="text-sm text-gray-600">
                Trạng thái:{" "}
                <span className="capitalize">
                  {statusLabels[order.status] || order.status}
                  {order.status === "shipping" && order.shipping_step && (
                    <>
                      {" | "}
                      {shippingStepLabels[order.shipping_step] ||
                        order.shipping_step}
                    </>
                  )}
                </span>
              </p>

              <p className="text-xs text-gray-400">
                Ngày tạo: {new Date(order.created_at).toLocaleDateString()}
              </p>
              {/* Nút xem chi tiết nếu là đơn đã giao */}
              {order.status === "completed" && (
                <Link
                  href={`/orders/${order.order_code}`}
                  className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                >
                  🔍 Xem chi tiết
                </Link>
              )}
            </div>
            {/* Nút hủy đơn nếu là đã xác nhận */}
            {order.status === "confirmed" && (
              <button
                onClick={() => handleOpenModal(order.id)}
                className="absolute bottom-3 right-1 text-sm text-red-500 hover:underline"
              >
                Hủy đơn hàng
              </button>
            )}
            {order.total_price && (
              <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                {order.total_price.toLocaleString()} ₫
              </div>
            )}
          </li>
        ))}
      </ul>

      {orders.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          {showAll ? "Ẩn bớt" : `Xem thêm (${orders.length - 2}) đơn`}
        </button>
      )}
      {/* Modal chọn lý do hủy đơn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Lý do hủy đơn hàng</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cancelReasons.map((reason) => (
                <label key={reason} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-blue-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSection;
