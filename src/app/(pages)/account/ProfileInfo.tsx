'use client';

import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface UserDetail {
  phone?: string;
  email?: string;
  address?: string;
}

interface ProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    detail?: UserDetail; // <-- thêm kiểu detail
  };
  onLogout: () => void;
}

export default function ProfileInfo({ user, onLogout }: ProfileProps) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col items-center text-center">
        <FaUserCircle className="text-6xl text-gray-400 mb-2" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {user.name}
        </h2>
        <p className="text-gray-500 text-sm mb-4">{user.email}</p>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-700">
        {/* <div className="flex justify-between">
          <span>Mã người dùng:</span>
          <span className="font-medium text-gray-900">{user.id}</span>
        </div> */}
        <div className="flex justify-between">
          <span>Tên tài khoản:</span>
          <span className="font-medium text-gray-900">{user.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Email:</span>
          <span className="font-medium text-gray-900">{user.email}</span>
        </div>

        {/* Thông tin chi tiết */}
        {user.detail && (
          <>
            {user.detail.phone && (
              <div className="flex justify-between">
                <span>Số điện thoại:</span>
                <span className="font-medium text-gray-900">{user.detail.phone}</span>
              </div>
            )}
            {/* {user.detail.email && (
              <div className="flex justify-between">
                <span>Email đơn hàng:</span>
                <span className="font-medium text-gray-900">{user.detail.email}</span>
              </div>
            )} */}
            {user.detail.address && (
              <div className="flex justify-between">
                <span>Địa chỉ:</span>
                <span className="font-medium text-gray-900">{user.detail.address}</span>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={onLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
      >
        🚪 Đăng xuất
      </button>
    </div>
  );
}
