import React, { useState } from "react";
import { useApp } from "../../Context";
import { toDateInputValue } from "../../assets/helpers";
import { URL } from "../../assets/variables";
import LoadingModal from "../../components/LoadingModal";

export default function ModCouponCard({ coupon, onClose }) {
  const [newName, setNewName] = useState(coupon.name);
  const [newPhone, setNewPhone] = useState(coupon.phone);
  const [newExpDate, setNewExpDate] = useState(toDateInputValue(coupon.expDate));
  const [newTotal, setNewTotal] = useState(coupon.total);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData } = useApp();

  const handleInputDate = (e) => {
    const { value, name } = e.target;

    const selectedDate = new Date(value);
    const now = new Date();

    // Compare without time zone shift issues
    if (selectedDate < now) {
      alert("Ngày hết hạn không thể chọn trong quá khứ");
      return; // ❌ Prevent setting invalid date
    }
    setNewExpDate(value);
  };

  const handleModCoupon = async () => {
    console.log("click mod coupon");

    if (!newName || !newPhone || !newExpDate || !newTotal || !note) {
      alert("Hãy nhập đầy đủ thông tin");
      return;
    }

    if (newTotal * 1 <= coupon.total * 1 - coupon.remain * 1) {
      alert("Số phiếu phải nhiều hơn số đã dùng");
      return;
    }

    const submitData = {
      type: "modVeGui",
      site: coupon.site,
      lastUpdated: data.lastUpdated,
      data: {
        id: coupon.id,
        newName,
        newPhone,
        newExpDate,
        newTotal,
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
        alert("Sửa phiếu thành công");

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
        alert("Sửa phiếu không thành công");
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
        <h2 className="text-lg font-semibold mb-4 text-center border-r-amber-600">
          Sửa thông tin coupon {coupon.id}
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
              Ngày hết hạn mới (Ngày hết hạn cũ: {toDateInputValue(coupon.expDate)})
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newExpDate}
              onChange={(e) => setNewExpDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Số phiếu mới (Số phiếu cũ: {coupon.total})
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              placeholder="Nhập số phiếu"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Tên khách hàng mới (Tên cũ: {coupon.name})
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập số phiếu"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Số điện thoại mới (Số cũ: {coupon.phone})
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Nhập số phiếu"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ghi chú nguyên nhân sửa</label>
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
            onClick={() => handleModCoupon()}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
      {isLoading && <LoadingModal message="Loading..." />}
    </div>
  );
}
