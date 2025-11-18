import React, { useState } from "react";

import LoadingModal from "../../components/LoadingModal";
import { useApp } from "../../Context";
import UseCouponCard from "./UseCouponCard";
import MoveCouponCard from "./MoveCouponCard";
import ModCouponCard from "./ModCouponCard";

export default function CouponCard({ coupon }) {
  const [showHis, setShowHis] = useState(false);
  const [showUseCard, setShowUseCard] = useState(false);
  const [showMoveCard, setShowMoveCard] = useState(false)
  const [showModCard, setShowModCard] = useState(false)
  const statusColor = (status) => {
    return status === "Hết hạn"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  };

  return (
    <div
      key={coupon.id}
      className="w-full max-w-sm min-w-2xl bg-white rounded-xl  p-4 transition-all  mb-2 border-1 border-gray-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{coupon.id}</h2>
        <span
          className={`px-2 py-1 text-xs rounded ${statusColor(coupon.status)}`}
        >
          {coupon.status}
        </span>
      </div>

      <p className="mb-3">
        <span className="text-gray-500">👤 Khách hàng: </span>
        {coupon.name}
      </p>

      <div className="space-y-1 grid grid-cols-2 gap-2">
        <p>
          <span className="text-gray-500">📞 Phone:</span> {coupon.phone}
        </p>
        <p>
          <span className="text-gray-500">⏰ Expiry:</span>{" "}
          {new Date(coupon.expDate).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <span className="text-gray-500">💰 Total:</span> {coupon.total}
        </p>
        <p>
          <span className="text-gray-500">🧾 Remain:</span> {coupon.remain}
        </p>
      </div>

      {showHis && coupon.detail && (
        <div>
          <div
              className="grid grid-cols-3 border-t mt-3 pt-1 text-sm text-gray-600"
            >
              <p>Ngày dùng</p>
              <p>Số lượng</p>
              <p>Ghi chú</p>
            </div>
          {JSON.parse(coupon.detail).map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-3 mt-1 pt-1 text-sm "
            >
              <p>{v.useDate}</p>
              <p>{v.qty}</p>
              <p>{v.note}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex sm:justify-start items-end mt-2 gap-2 text-sm">
        <button
          onClick={() => {
            setShowHis(!showHis);
          }}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
        >
          {showHis?"Ẩn lịch sử":"Hiện lịch sử"}
        </button>
        {!coupon.status && (
          <button
            onClick={() => setShowUseCard(true)}
            className="bg-green-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
          >
            Sử dụng phiếu
          </button>
        )}

        <button
          onClick={() => setShowModCard(true)}
          className="bg-orange-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
        >
          Sửa thông tin
        </button>
        <button
          onClick={() => setShowMoveCard(true)}
          className="bg-red-300 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-400"
        >
          Chuyển phiếu mới
        </button>
      </div>
      {showUseCard && (
        <UseCouponCard coupon={coupon} onClose={() => setShowUseCard(false)} />
      )}
      {showMoveCard && (
        <MoveCouponCard coupon={coupon} onClose={() => setShowMoveCard(false)} />
      )}
      {showModCard && (
        <ModCouponCard coupon={coupon} onClose={() => setShowModCard(false)} />
      )}
    </div>
  );
}
