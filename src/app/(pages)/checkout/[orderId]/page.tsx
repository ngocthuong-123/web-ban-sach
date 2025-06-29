"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getGuestOrderById, confirmOrder } from "../../../services/api/orders";
import { showSuccess, showError } from "../../../utils/toast";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params?.orderId);
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "bank_transfer" | "credit_card" | "momo" | "paypal"
  >("cod");
  const [qrVisible, setQrVisible] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [canConfirm, setCanConfirm] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (paymentMethod === "bank_transfer") {
      setQrVisible(true);
      setPaymentConfirmed(false);
      setCanConfirm(false); // Disable nút xác nhận ngay khi chọn chuyển khoản

      // Sau 15 phút: ẩn QR, hiển thị chờ xác nhận
      const qrTimer = setTimeout(() => {
        setQrVisible(false);
        console.log("QR hết hạn, đang chờ ngân hàng xác nhận...");

        // Sau thêm 5 phút: tự động xác nhận đơn
        const confirmTimer = setTimeout(async () => {
          try {
            await confirmOrder(orderId);
            showSuccess(
              "Cảm ơn quý khách đã thanh toán. Đơn hàng đã được xác nhận!"
            );
            setPaymentConfirmed(true);
            setCanConfirm(true); // Cho phép xác nhận lại nếu cần
            setTimeout(() => {
              router.push("/");
            }, 3000);
          } catch (error) {
            showError("Không thể tự động xác nhận đơn hàng.");
          }
        }, 5000); // 5 phút sau QR hết hạn

        return () => clearTimeout(confirmTimer);
      }, 5000); // QR hiển thị 15 phút

      return () => clearTimeout(qrTimer);
    } else {
      setCanConfirm(true); // Cho phép xác nhận với các phương thức khác
    }
  }, [paymentMethod]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getGuestOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
        showError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleConfirm = async () => {
    try {
      await confirmOrder(orderId);
      //   showSuccess("Đơn hàng đã được xác nhận!");
      showSuccess("Cảm ơn quý khách đã đặt hàng!");
      setTimeout(() => {
        router.push("/");
      }, 2000); // hoặc trang chi tiết đơn
    } catch (error) {
      console.error("Xác nhận lỗi:", error);
      showError("Không thể xác nhận đơn hàng.");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        HÓA ĐƠN THANH TOÁN
      </h1>

      <div className="mb-4 text-sm text-gray-600">
        <p>
          <strong>Mã đơn hàng:</strong> {order.order_code}
        </p>
        <p>
          <strong>Trạng thái:</strong> Đang chờ xác nhận{" "}
        </p>
      </div>

      <hr className="my-4" />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Thông tin khách hàng
        </h2>
        <p>
          <strong>Họ tên:</strong> {order.customer_name}
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

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Chi tiết đơn hàng
        </h2>
        <table className="w-full border border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Sản phẩm</th>
              <th className="border px-2 py-1">Số lượng</th>
              <th className="border px-2 py-1">Giá</th>
              <th className="border px-2 py-1">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.details?.map((item: any, index: number) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  {item.book?.title || "Sản phẩm"}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.quantity}
                </td>
                <td className="border px-2 py-1 text-right">
                  {item.unit_price?.toLocaleString("vi-VN")}₫
                </td>
                <td className="border px-2 py-1 text-right">
                  {(item.quantity * item.unit_price)?.toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-sm text-gray-700">
        <p>
          <strong>Tạm tính:</strong>{" "}
          {order.total_price?.toLocaleString("vi-VN")}₫
        </p>
        <p>
          <strong>Phí vận chuyển:</strong>{" "}
          {order.shipping_fee?.toLocaleString("vi-VN")}₫
        </p>
        <p className="text-lg font-bold text-black mt-2">
          Tổng cộng:{" "}
          {(
            Number(order.total_price) + Number(order.shipping_fee)
          ).toLocaleString("vi-VN")}
          ₫
        </p>
        <p>
          <strong>Dự kiến nhận hàng trong 3 ngày tới.</strong>
        </p>
      </div>
      <div className="mt-6 text-sm">
        <label
          htmlFor="paymentMethod"
          className="block font-medium text-gray-700 mb-1"
        >
          Phương thức thanh toán
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
          <option value="bank_transfer">Chuyển khoản ngân hàng</option>
          <option value="credit_card">Thẻ tín dụng</option>
          <option value="momo">Ví MoMo</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      {/* {paymentMethod === "bank_transfer" && (
        <div className="mt-6 text-center">
          {qrVisible ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Quét mã để chuyển khoản
              </h3>
              <img
                src={`https://img.vietqr.io/image/VCB-0123456789-compact2.png?amount=${
                  Number(order.total_price) + Number(order.shipping_fee)
                }&addInfo=${order.order_code}&accountName=NGUYEN%20THI%20NGOC20%THUONG`}
                alt="QR chuyển khoản"
                className="mx-auto border p-2 rounded shadow"
              />
              <p className="text-sm text-gray-600 mt-2">
                Vui lòng chuyển khoản đúng nội dung:{" "}
                <strong>{order.order_code}</strong>
              </p>
              <p className="text-xs text-red-500 mt-1">
                Mã QR sẽ hết hạn sau 15 phút
              </p>
            </>
          ) : !paymentConfirmed ? (
            <p className="text-sm text-orange-600 mt-4">
              Đang chờ xác nhận giao dịch từ ngân hàng...
            </p>
          ) : (
            <p className="text-sm text-green-600 mt-4 font-medium">
              Thanh toán đã được xác nhận!
            </p>
          )}
        </div>
      )} */}
      {paymentMethod === "bank_transfer" && (
        <div className="mt-6 text-center">
          {qrVisible ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Quét mã để chuyển khoản
              </h3>
              <img
                src={`https://img.vietqr.io/image/VCB-0123456789-compact2.png?amount=${
                  Number(order.total_price) + Number(order.shipping_fee)
                }&addInfo=${
                  order.order_code
                }&accountName=NGUYEN%20THI%20NGOC20%THUONG`}
                alt="QR chuyển khoản"
                className="mx-auto border p-2 rounded shadow"
              />
              <p className="text-sm text-gray-600 mt-2">
                Vui lòng chuyển khoản đúng nội dung:{" "}
                <strong>{order.order_code}</strong>
              </p>
              <p className="text-xs text-red-500 mt-1">
                Mã QR sẽ hết hạn sau 15 phút. Sau đó hệ thống sẽ tự động xác
                nhận đơn hàng.
              </p>
            </>
          ) : !paymentConfirmed ? (
            <p className="text-sm text-orange-600 mt-4">
              Đang chờ xác nhận giao dịch từ ngân hàng...
            </p>
          ) : (
            <p className="text-sm text-green-600 mt-4 font-medium">
              Thanh toán đã được xác nhận!
            </p>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`px-6 py-2 rounded ${
            canConfirm
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
}
