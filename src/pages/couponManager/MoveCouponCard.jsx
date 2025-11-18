import React, { useState } from "react";
import { useApp } from "../../Context";
import { toDateInputValue } from "../../assets/helpers";
import { URL } from "../../assets/variables";
import LoadingModal from "../../components/LoadingModal";

export default function MoveCouponCard({ coupon, onClose }) {
  const [id, setId] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData } = useApp();

  const handleInputId = (e) => {
    const { name, value } = e.target;

    // Get prefix from site or default to empty string
    const prefix = data.user.site || "";
    // Remove prefix if user deletes or changes it manually
    let raw = value.toUpperCase().replace(prefix.toUpperCase(), "");
    // Remove all non-digit characters 
    raw = raw.replace(/\D/g, "");
    // Allow empty when deleted
    if (raw === "") {
      setForm((prev) => ({ ...prev, id: "" }));
      return;
    }
    // Pad to 9 digits max
    const formatted = prefix + raw.padStart(10, "0").slice(-10);
    setId(formatted);
    return;
  };

  const handleMoveCoupon = async () => {
    if (!id) {
      alert("Nhập mã phiếu mới");
      return;
    }
    const exists = data.veGui.some((v) => v.id === id);
    if (exists) {
      alert("Không thể tạo do phiếu đã tồn tại");
      return;
    }

    const submitData = {
      type: "moveVeGui",
      site: coupon.site,
      lastUpdated: data.lastUpdated,
      data: {
        id: coupon.id,
        newId: id,
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
        alert("Chuyển phiếu thành công");

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
        alert("Chuyển phiếu không thành công");
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
          Chuyển sang phiếu mới
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
              Mã phiếu mới
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={id}
              onChange={handleInputId}
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
            onClick={() => handleMoveCoupon()}
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
