const GuestDrawer = ({
  visible,
  onClose,
  onSubmit,
  guestInfo,
  setGuestInfo,
}: any) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="ml-auto bg-white w-full sm:w-[400px] h-full shadow-xl transition-transform duration-300 ease-in-out transform translate-x-0 p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Nhập thông tin đặt hàng</h2>

        <input
          type="text"
          placeholder="Họ tên"
          value={guestInfo.customer_name}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, customer_name: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={guestInfo.customer_phone}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, customer_phone: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email (không bắt buộc)"
          value={guestInfo.customer_email}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, customer_email: e.target.value })
          }
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Địa chỉ giao hàng"
          value={guestInfo.customer_address}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, customer_address: e.target.value })
          }
          className="w-full mb-4 px-3 py-2 border rounded"
        ></textarea>

        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};
export default GuestDrawer;
