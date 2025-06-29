"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type NotificationItem = {
  id: string | number;
  read_at: string | null;
  created_at: string;
  data: {
    order_id: string | number;
    status: string;
    shipping_step?: string;
    [key: string]: any;
  };
};

const NotificationComponent = (): React.JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        setNotifications(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy thông báo:", error);
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (id: string | number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:8000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Thông báo đơn hàng</h2>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500">Không có thông báo nào.</div>
        ) : (
          <>
            {notifications.map((n, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md border transition-all ${
                  n.read_at
                    ? "bg-white text-gray-800"
                    : "bg-yellow-50 text-gray-900 font-semibold"
                }`}
              >
                <div className="mb-1">
                  <span className="text-blue-600 font-medium">
                    Đơn hàng #{n.data.order_id}
                  </span>{" "}
                  đã được cập nhật.
                </div>
                <div>
                  <span className="text-gray-700">Trạng thái mới: </span>
                  <span className="capitalize">{n.data.status}</span>
                </div>

                {n.data.shipping_step && (
                  <div>
                    <span className="text-gray-700">Chi tiết giao hàng: </span>
                    <span className="capitalize">{n.data.shipping_step}</span>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </div>

                {!n.read_at && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
