import type { Metadata } from "next";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext"; // 🧠 Thêm dòng này
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppLifecycleManager from "./components/AppLifecycleManager";
import { SearchProvider } from "./context/SearchContext";
export const metadata: Metadata = {
  title: "Trang chủ Bookstore",
  description: "Website bán sách chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen grid grid-rows-[1fr_auto] bg-gray-50">
        <AppProvider>
          <AppLifecycleManager />
          <SearchProvider>
          <Header />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          </SearchProvider>
          <ToastContainer position="top-right" autoClose={4000} style={{ top: '140px' }} />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
