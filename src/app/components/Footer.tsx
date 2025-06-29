// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#A2836E] border-t border-[#7A5E49]">
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">
        <div>
          <h3 className="font-bold mb-2 text-white">Về NGOCTHUONG</h3>
          <ul className="space-y-1 text-[#EFE6DD]">
            <li>
              <a href="/gioi-thieu" className="hover:underline">Giới thiệu</a>
            </li>
            <li>
              <a href="/tuyen-dung" className="hover:underline">Tuyển dụng</a>
            </li>
            <li>
              <a href="/dieu-khoan" className="hover:underline">Điều khoản sử dụng</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Hỗ trợ</h3>
          <ul className="text-[#EFE6DD] space-y-1">
            <li>
              <a href="/chinh-sach-doi-tra" className="hover:underline">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="/bao-mat" className="hover:underline">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/huong-dan-mua-hang" className="hover:underline">Hướng dẫn mua hàng</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Kết nối</h3>
          <ul className="text-[#EFE6DD] space-y-1">
            <li><a href="https://facebook.com/ngocthuongbooks" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://zalo.me/1234567890" target="_blank" rel="noopener noreferrer">Zalo</a></li>
            <li><a href="https://instagram.com/ngocthuong.books" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Liên hệ</h3>
          <ul className="text-[#EFE6DD] space-y-1">
            <li>Hotline: 0961 123 456</li>
            <li>Email: lienhe@ngocthuong.vn</li>
            <li>Địa chỉ: 123 Đường Sách, Q.1, TP.HCM</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#7A5E49] text-center text-xs py-4 text-white">
        © 2025 NGOCTHUONG. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}
