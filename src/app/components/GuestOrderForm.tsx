import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  Province,
  District,
  Ward,
} from "../services/api/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface GuestInfo {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
}

interface GuestOrderFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: GuestInfo) => void;
  loading?: boolean;
}

export default function GuestOrderForm({
  open,
  onClose,
  onConfirm,
  loading,
}: GuestOrderFormProps) {
  const [form, setForm] = useState<GuestInfo>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
  });
  const [errors, setErrors] = useState({
    customer_name: false,
    customer_phone: false,
    addressDetail: false,
    province: false,
    district: false,
    ward: false,
  });
  const [addressDetail, setAddressDetail] = useState(""); // Số nhà, đường
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [districtId, setDistrictId] = useState<number | "">("");
  const [wardId, setWardId] = useState<number | "">("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [note, setNote] = useState("");
  const [useReceiverAddress, setUseReceiverAddress] = useState(false);
  const [receiverName, setReceiverName] = useState("");

  // Địa chỉ người nhận hộ
  const [receiverAddressDetail, setReceiverAddressDetail] = useState("");
  const [receiverProvinceId, setReceiverProvinceId] = useState<number | "">("");
  const [receiverDistrictId, setReceiverDistrictId] = useState<number | "">("");
  const [receiverWardId, setReceiverWardId] = useState<number | "">("");

  useEffect(() => {
    if (open) fetchProvinces().then(setProvinces);
  }, [open]);

  useEffect(() => {
    if (provinceId) {
      fetchDistricts(provinceId).then(setDistricts);
      setDistrictId("");
      setWardId("");
      setWards([]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      fetchWards(districtId).then(setWards);
      setWardId("");
    }
  }, [districtId]);

  const getNameById = (list: any[], id: number | "") => {
    const item = list.find((i) => i.id === id);
    return item ? item.name : "";
  };

  const handleSubmit = () => {
    const newErrors = {
      customer_name: form.customer_name.trim() === "",
      customer_phone: form.customer_phone.trim() === "",
      addressDetail: addressDetail.trim() === "",
      province: provinceId === "",
      district: districtId === "",
      ward: wardId === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) return;

    const fullAddress = `${addressDetail}, ${getNameById(
      wards,
      wardId
    )}, ${getNameById(districts, districtId)}, ${getNameById(
      provinces,
      provinceId
    )}`;

    onConfirm({
      ...form,
      customer_address: fullAddress,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const isFormValid =
    form.customer_name.trim() !== "" &&
    form.customer_phone.trim() !== "" &&
    addressDetail.trim() !== "" &&
    provinceId !== "" &&
    districtId !== "" &&
    wardId !== "";
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-2xl shadow-xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Nhập thông tin nhận hàng
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div className="space-y-4">
            {/* <div className="space-y-5 mt-2"> */}
            {/* Họ tên, điện thoại, email */}
            {[
              {
                name: "customer_name",
                label: "HỌ TÊN",
                placeholder: "Nguyễn Văn A",
              },
              {
                name: "customer_phone",
                label: "SỐ ĐIỆN THOẠI",
                placeholder: "0123456789",
              },
              {
                name: "customer_email",
                label: "EMAIL",
                placeholder: "email@example.com",
              },
            ].map(({ name, label, placeholder }) => (
              <div key={name} className="space-y-1">
                <Label htmlFor={name} className="text-sm font-medium">
                  {label}
                  <span className="text-red-500">(*)</span>
                </Label>
                <Input
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`rounded-xl ${
                    errors.customer_name ? "border-red-500" : ""
                  }`}
                />
              </div>
            ))}

            {/* Số nhà, đường */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                SỐ NHÀ, TÊN ĐƯỜNG <span className="text-red-500">(*)</span>
              </Label>
              <Input
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="123 Đường ABC"
                className={`rounded-xl ${
                  errors.customer_name ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Tỉnh/Thành phố */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                TỈNH/THÀNH PHỐ <span className="text-red-500">(*)</span>
              </Label>
              <Select
                value={provinceId ? String(provinceId) : ""}
                onValueChange={(val) => setProvinceId(Number(val))}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn tỉnh/thành" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quận/Huyện */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                QUẬN/HUYỆN <span className="text-red-500">(*)</span>
              </Label>
              <Select
                value={districtId ? String(districtId) : ""}
                onValueChange={(val) => setDistrictId(Number(val))}
                disabled={!provinceId}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phường/Xã */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                PHƯỜNG/XÃ <span className="text-red-500">(*)</span>
              </Label>
              <Select
                value={wardId ? String(wardId) : ""}
                onValueChange={(val) => setWardId(Number(val))}
                disabled={!districtId}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p>
                <span className="text-red-500">(*)</span> : Không được bỏ trống
              </p>
            </div>
            <div className="space-y-1">
                      {/* Checkbox chọn người nhận hộ */}
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="use-other-address"
            checked={useReceiverAddress}
            onChange={() => setUseReceiverAddress(!useReceiverAddress)}
            className="accent-primary"
          />
          <Label htmlFor="use-other-address" className="text-sm">
            Giao hàng cho người khác (người nhận hộ)
          </Label>
        </div>
            </div>
          </div>
          
          <div className="space-y-4">

            {/* Số điện thoại người nhận hộ */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Tên người nhận hộ (tuỳ chọn)
              </Label>
              <Input
              disabled={!useReceiverAddress}
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder=""
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                SĐT người nhận hộ (tuỳ chọn)
              </Label>
              <Input
              disabled={!useReceiverAddress}
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="0987xxxxxx"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Email người nhận hộ (tuỳ chọn)
              </Label>
              <Input
              disabled={!useReceiverAddress}
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="xxx@gmail.com"
                className="rounded-xl"
              />
            </div>
            {/* Số nhà, đường */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Số nhà, tên đường</Label>
              <Input
              disabled={!useReceiverAddress}
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="123 Đường ABC"
                className={`rounded-xl ${
                  errors.customer_name ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Tỉnh/Thành phố */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</Label>
              <Select
              disabled={!useReceiverAddress}
                value={receiverProvinceId ? String(receiverProvinceId) : ""}
                onValueChange={(val) => setReceiverProvinceId(Number(val))}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn tỉnh/thành" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quận/Huyện */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Quận/Huyện</Label>
              <Select
                value={receiverDistrictId ? String(receiverDistrictId) : ""}
                onValueChange={(val) => setReceiverDistrictId(Number(val))}
                disabled={!receiverProvinceId}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phường/Xã */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Phường/Xã</Label>
              <Select
                value={receiverWardId ? String(receiverWardId) : ""}
                onValueChange={(val) => setReceiverWardId(Number(val))}
                disabled={!receiverDistrictId}
              >
                <SelectTrigger
                  className={`rounded-xl ${
                    errors.province ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ghi chú */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">GHI CHÚ (tuỳ chọn)</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Giao giờ hành chính, gọi trước khi đến..."
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid || loading}>
            {loading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
