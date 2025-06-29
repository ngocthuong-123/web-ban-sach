export default function DoiTraPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Chính sách đổi/trả</h1>
      <p className="mb-2">Chúng tôi chấp nhận đổi/trả sách trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng nếu rơi vào các trường hợp sau:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Sản phẩm bị lỗi: in sai, mất trang, nhòe mực</li>
        <li>Rách, hư hỏng do quá trình vận chuyển</li>
        <li>Giao nhầm sản phẩm: sai tựa sách, sai số lượng</li>
      </ul>
      <p className="mb-2">Điều kiện:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Sách còn nguyên trạng, không bị viết lên</li>
        <li>Có hình ảnh sản phẩm lỗi và mã đơn hàng</li>
      </ul>
      <p>Liên hệ: <a href="https://zalo.me/123456789" className="text-blue-600 hover:underline">Zalo CSKH</a> hoặc gọi hotline: <strong>0961 123 456</strong></p>
    </div>
  );
}