export default function HuongDanPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Hướng dẫn mua hàng</h1>
      <ol className="list-decimal list-inside space-y-2 mb-4">
        <li>Chọn sách bạn yêu thích</li>
        <li>Nhấn "Thêm vào giỏ"</li>
        <li>Điền thông tin giao hàng và chọn phương thức thanh toán</li>
        <li>Hoàn tất đơn và đợi giao trong 2–5 ngày</li>
      </ol>
      <p className="mb-2">Lưu ý:</p>
      <ul className="list-disc list-inside">
        <li>Miễn phí ship cho đơn từ 300.000đ</li>
        <li>Hỗ trợ đổi trả trong vòng 7 ngày</li>
      </ul>
    </div>
  );
}
