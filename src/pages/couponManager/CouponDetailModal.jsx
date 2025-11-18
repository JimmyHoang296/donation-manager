import React, { useState } from "react";
import { useApp } from "../../Context";
import { URL } from "../../assets/variables";
import LoadingModal from "../../components/LoadingModal";
import { X } from "lucide-react";

export default function CouponDetailModal({ onClose }) {
  const { data, setData } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    phone: "",
    site: data.user.site,
    createUser: data.user.name,
    createDate: new Date(),
    expDate: "",
    total: "",
    remain: "",
    status: "",
    note: "",
    detail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    //validation for id input
    if (name === "id") {
      // Get prefix from site or default to empty string
      const prefix = form.site || "";
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
      setForm((prev) => ({ ...prev, id: formatted }));
      return;
    }

    // validation for expired date
    if (name === "expDate") {
      const selectedDate = new Date(value);
      const now = new Date();

      // Compare without time zone shift issues
      if (selectedDate < now) {
        alert("Ngày hết hạn không thể chọn trong quá khứ");
        return; // ❌ Prevent setting invalid date
      }

      setForm((prev) => ({ ...prev, expDate: value }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.phone || !form.expDate || !form.total) {
      alert("Hãy nhập đầy đủ thông tin để tạo phiếu");
      return;
    }

    const exists = data.veGui.some((v) => v.id === form.id);
    if (exists) {
      alert("Không thể tạo do phiếu đã tồn tại");
      return;
    }

    const submitData = {
      type: "addNewVegui",
      site: data.user.site,
      lastUpdated: data.lastUpdated,
      data: {...form, remain:form.total},
    };
    console.log(submitData);
    try {
      setIsLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        alert("Tạo phiếu thành công");
        if (result.isUpdated) {
          const newData = {
            ...data,
            lastUpdated: result.updated,
            veGui: [form, ...data.veGui],
          };
          setData(newData);
        } else {
          const veGuiUpdated = result.veGui;
          const newVeGui = [
            ...data.veGui.map((item) => {
              const updated = veGuiUpdated.find((u) => u.id === item.id);
              return updated ? { ...item, ...updated } : item;
            }),
            ...veGuiUpdated.filter(
              (u) => !data.veGui.some((v) => v.id === u.id)
            ),
          ];
          const newData = {
            ...data,
            lastUpdated: result.updated,
            veGui: newVeGui,
          };
          setData(newData);
        }
        onClose();
      } else {
        alert("Tạo phiếu không thành công");
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error sending request: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-5 animate-fade-in">
        <div className="flex justify-between content-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Tạo Coupon mới
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mx-auto bg-white shadow-md rounded-2xl p-5 border border-gray-200 space-y-3 grid grid-cols-2 gap-2"
        >
          {[
            { name: "id", label: "Mã phiếu" },
            { name: "name", label: "Tên khách hàng" },
            { name: "phone", label: "Số điện thoại" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày hết hạn
            </label>
            <input
              type="date"
              name="expDate"
              value={form.expDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng số phiếu
            </label>
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="col-span-2 w-full bg-indigo-500 text-white rounded-lg p-2 font-semibold hover:bg-indigo-600 transition"
          >
            Tạo phiếu
          </button>
        </form>
      </div>
      {isLoading && <LoadingModal message="Loading..." />}
    </div>
  );
}
