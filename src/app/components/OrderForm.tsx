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

interface UserInfo {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
  addressDetail?: string;
}


interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (info: UserInfo) => Promise<void>;
  loading?: boolean;
  
}

export default function GuestOrderForm({
  open,
  onClose,
  onConfirm,
  loading,
}: OrderFormProps) {
  const [form, setForm] = useState<UserInfo>({
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

        <div className="space-y-5 mt-2">
          {/* Họ tên, điện thoại, email */}
          {[
            {
              name: "customer_name",
              label: "Họ tên",
              placeholder: "Nguyễn Văn A",
            },
            {
              name: "customer_phone",
              label: "Số điện thoại",
              placeholder: "0123456789",
            },
            {
              name: "customer_email",
              label: "Email (tuỳ chọn)",
              placeholder: "email@example.com",
            },
          ].map(({ name, label, placeholder }) => (
            <div key={name} className="space-y-1">
              <Label htmlFor={name} className="text-sm font-medium">
                {label}
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
            <Label className="text-sm font-medium">Số nhà, tên đường</Label>
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
            <Label className="text-sm font-medium">Tỉnh/Thành phố</Label>
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
            <Label className="text-sm font-medium">Quận/Huyện</Label>
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
            <Label className="text-sm font-medium">Phường/Xã</Label>
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

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || loading}>
              {loading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
