'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../../utils/storage';
import axios from 'axios';

export default function ContactForm() {
    const router = useRouter();
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  province_id: '',
  province: '',
  district: '',
  ward: '',
  street_address: '',
});


  const [userId, setUserId] = useState<number | null>(null);
  const [originalEmail, setOriginalEmail] = useState<string>(''); // 👈 dùng để so sánh sau này
    const [isLoaded, setIsLoaded] = useState(false);
const [provinces, setProvinces] = useState<{ id: number, name: string }[]>([]);

useEffect(() => {
  axios.get('http://localhost:8000/api/provinces').then(res => {
    setProvinces(res.data);
  });
}, []);

  useEffect(() => {
    const user = getUser();
    console.log('👤 User từ localStorage:', user);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
      setUserId(user.id);
    }
    setIsLoaded(true); // ✅ sau khi xử lý xong
    setOriginalEmail(user.email || '');
  }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Bạn chưa đăng nhập');
      return;
    }

    try {
      // 👇 Nếu email thay đổi thì cập nhật bảng `users` trước
      if (formData.email !== originalEmail) {
        await axios.put(`http://localhost:8000/api/users/${userId}`, {
          email: formData.email,
        });
      }

      // 👇 Lưu thông tin chi tiết vào bảng user_details
      await axios.post('http://localhost:8000/api/user-details', {
        user_id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      province_id: formData.province_id,
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      street_address: formData.street_address,
      address: `${formData.province}${formData.street_address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
      });

      alert('Đã lưu thông tin liên hệ thành công!');
      router.back();
    } catch (error) {
      console.error('Lỗi gửi thông tin:', error);
      alert('Có lỗi xảy ra');
    }
  };
if (!isLoaded) return null;
  return (
    <div className="text-gray-700 max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">📞 Thông tin liên hệ</h2>
      <form onSubmit={handleSubmit} className="text-gray-700 space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Họ tên</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

<div>
  <label className="block font-medium mb-1">Tỉnh / Thành phố</label>
  <select
    name="province_id"
    required
    value={formData.province_id}
    onChange={(e) => {
      const selectedId = Number(e.target.value);
      const selectedProvince = provinces.find(p => p.id === selectedId);
      setFormData({
        ...formData,
        province_id: selectedId.toString(),
        province: selectedProvince ? selectedProvince.name : '',
      });
    }}
    className="w-full border px-3 py-2 rounded"
  >
    <option value="">-- Chọn tỉnh/thành --</option>
    {provinces.map((p) => (
      <option key={p.id} value={p.id}>{p.name}</option>
    ))}
  </select>
</div>


<div>
  <label className="block font-medium mb-1">Quận / Huyện</label>
  <input
    type="text"
    name="district"
    required
    value={formData.district}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />
</div>

<div>
  <label className="block font-medium mb-1">Phường / Xã</label>
  <input
    type="text"
    name="ward"
    required
    value={formData.ward}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />
</div>

<div>
  <label className="block font-medium mb-1">Địa chỉ cụ thể (số nhà, đường)</label>
  <input
    type="text"
    name="street_address"
    required
    value={formData.street_address}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
  />
</div>


        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Lưu
        </button>
      </form>
    </div>
  );
}
