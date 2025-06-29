interface Props {
  total: number;
  originalTotal: number;
  shippingFee: number;
  loading: boolean;
  onConfirm: () => void;
  discounts?: any[];
  selectedDiscountCode?: string | null;
  onDiscountSelect?: (code: string | null) => void;
}

export default function CartSummary({
  total,
  originalTotal,
  shippingFee,
  loading,
  onConfirm,
  discounts = [],
  selectedDiscountCode,
  onDiscountSelect,
}: Props) {
  return (
    <div className="bg-gray-50 text-gray-700 p-2 rounded-lg shadow-md h-fit sticky top-6">
      <h3 className="text-xl font-bold mb-4">Tạm tính</h3>
      {originalTotal > total && (
  <p className="text-sm text-gray-500 line-through">
    Tổng trước giảm: {originalTotal.toLocaleString()}₫
  </p>
)}
      <p>
        Tổng tiền sản phẩm đã chọn:{' '}
        <span className="text-green-600 font-semibold">
          {total.toLocaleString()}₫
        </span>
      </p>

      {discounts.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Chọn mã giảm giá tự động:</h4>
          {discounts.map((discount) => (
            <label key={discount.code} className="flex items-center space-x-2 mb-1">
              <input
  type="radio"
  checked={selectedDiscountCode === discount.code}
  onChange={() =>
    selectedDiscountCode === discount.code
      ? onDiscountSelect?.(null) // nếu đang chọn thì bỏ chọn
      : onDiscountSelect?.(discount.code)
  }
/>

              <span>
  {discount.title || discount.description || discount.code}
</span>

            </label>
          ))}
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              checked={!selectedDiscountCode}
              onChange={() => onDiscountSelect?.(null)}
            />
            <span>Không áp dụng</span>
          </label>
        </div>
      )}
      {total > 0 && (
        <>
          <p>
            Phí vận chuyển:{' '}
            <span className="text-blue-600 font-semibold">
              {(shippingFee ?? 0).toLocaleString()}₫
            </span>
          </p>
          <p>
            Tổng thanh toán:{' '}
            <span className="text-red-600 font-bold">
              {(total + (shippingFee ?? 0)).toLocaleString()}₫
            </span>
          </p>
        </>
      )}

      <button
        className="mt-4 w-full bg-[#F5F0EB] hover:bg-[#D9C7B8] text-gray-500 font-semibold py-2 rounded"
        disabled={total === 0 || loading}
        onClick={onConfirm}
      >
        {loading ? 'Đang xử lý...' : 'Xác nhận mua hàng'}
      </button>
    </div>
  );
}
