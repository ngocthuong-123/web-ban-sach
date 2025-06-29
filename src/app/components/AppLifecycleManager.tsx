// "use client";
// import { useEffect } from 'react';

// export default function AppLifecycleManager() {
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = '';
//     };

//     const handleUnload = () => {
//       sessionStorage.removeItem('guest_session_id');
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     window.addEventListener('unload', handleUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       window.removeEventListener('unload', handleUnload);
//     };
//   }, []);

//   return null;
// }
"use client";
import { useEffect } from 'react';

export default function AppLifecycleManager() {
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('guest_session_id');
    };

    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return null;
}
