import React, { useState } from "react";
import { useApp } from "../../Context";
import { toDateInputValue } from "../../assets/helpers";
import { URL } from "../../assets/variables";
import LoadingModal from "../../components/LoadingModal";

export default function UseCouponCard({ coupon, onClose, onConfirm }) {
  const [useValue, setUseValue] = useState("");
  const [note, setNote] = useState("");
  const [useDate, setUseDate] = useState(toDateInputValue(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData } = useApp();

  const handleUseCoupon = async () => {
    console.log("click use coupon");
    if (!useValue) {
      alert("Điền số sử dụng");
      return;
    }
    if (useValue * 1 > coupon.remain * 1) {
      alert("Sử dụng quá số phiếu còn");
      return;
    }
    const submitData = {
      type: "useVeGui",
      site: coupon.site,
      lastUpdated: data.lastUpdated,
      data: {
        id: coupon.id,
        site: coupon.site,
        useDate,
        qty: useValue,
        note,
        user: data.user.name,
      },
    };
    try {
      setIsLoading(true);
      console.log(submitData);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        alert("Dùng phiếu thành công");

        const veGuiUpdated = result.veGui;
        const newVeGui = [
          ...data.veGui.map((item) => {
            const updated = veGuiUpdated.find((u) => u.id === item.id);
            return updated ? { ...item, ...updated } : item;
          }),
          ...veGuiUpdated.filter((u) => !data.veGui.some((v) => v.id === u.id)),
        ];
        const newData = {
          ...data,
          lastUpdated: result.lastUpdated,
          veGui: newVeGui,
        };
        setData(newData);

        onClose();
      } else {
        alert("Dùng phiếu không thành công");
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5 animate-fade-in">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Sử dụng Coupon {coupon.id}
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between gap-5">
            <p>
              <span className="text-gray-600">Khách hàng: </span>
              {coupon.name}
            </p>
            <p>
              <span className="text-gray-600">Phiếu còn: </span>
              {coupon.remain}
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ngày sử dụng
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={useDate}
              onChange={(e) => setUseDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Số lượng sử dụng
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={useValue}
              onChange={(e) => setUseValue(e.target.value)}
              placeholder="Nhập số phiếu"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ghi chú</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú (tùy chọn)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUseCoupon()}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
      {isLoading && <LoadingModal message="Loading..." />}
    </div>
  );
}
