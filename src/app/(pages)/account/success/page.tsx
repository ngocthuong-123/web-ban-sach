// 'use client';
// import { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { setToken, setUser } from '../../../utils/storage';
// import { getCurrentUser } from '../../../services/api/user';

// export default function LoginSuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

// useEffect(() => {
//     const handleLogin = async () => {
//       const token = searchParams.get('token');

//       if (token) {
//         setToken(token);
//         const user = await getCurrentUser();
//         if (user) {
//           setUser(user);
//           console.log("✅ Đăng nhập thành công", user);
//           router.push("/");
//         } else {
//           console.warn("❌ Lỗi lấy thông tin người dùng");
//           router.push("/login");
//         }
//       } else {
//         router.push("/login");
//       }
//     };

//     handleLogin();
//   }, [router, searchParams]);

//   return <p>Đang xử lý đăng nhập...</p>;
// }
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken, setUser } from '../../../utils/storage';
import { getCurrentUser } from '../../../services/api/user';
import { Suspense } from 'react';

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
      const token = searchParams.get('token');

      if (token) {
        setToken(token);
        const user = await getCurrentUser();

        if (user) {
          setUser(user);
          console.log("✅ Đăng nhập thành công", user);
          router.push("/");
        } else {
          console.warn("❌ Lỗi lấy thông tin người dùng");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    handleLogin();
  }, [router, searchParams]);

  return <p>Đang xử lý đăng nhập...</p>;
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<p>Đang xử lý đăng nhập...</p>}>
      <LoginSuccessContent />
    </Suspense>
  );
}
