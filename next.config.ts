// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000",
//         pathname: "/storage/**",
//       },
//     ],
//   },
// };

// /*module.exports = nextConfig;*/
// module.exports = {
//   output: "export",
//   trailingSlash: true, // để tạo ra các thư mục chứa file index.html
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Thêm dòng này khi sử dụng output: export
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
  // Thêm cấu hình TypeScript
  typescript: {
    ignoreBuildErrors: true, // Tạm thời bỏ qua lỗi build
  },
};

module.exports = nextConfig;