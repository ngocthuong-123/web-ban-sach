export default function BaoMatPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Chính sách bảo mật</h1>
      <p className="mb-2">Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng như sau:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Thông tin thu thập: họ tên, SĐT, địa chỉ, email</li>
        <li>Mục đích sử dụng: xử lý đơn hàng, chăm sóc khách</li>
        <li>Không chia sẻ thông tin cho bên thứ ba trừ khi bạn đồng ý hoặc theo yêu cầu pháp luật</li>
      </ul>
      <p>Mọi thông tin có thể được cập nhật/xóa theo yêu cầu qua email: <strong>lienhe@ngocthuong.vn</strong></p>
    </div>
  );
}
