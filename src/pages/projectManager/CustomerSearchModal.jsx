import React, { useState } from "react";

const mockCustomers = [
  { id: 1, name: "Công ty ABC", taxCode: "123456789" },
  { id: 2, name: "Công ty XYZ", taxCode: "987654321" },
  { id: 3, name: "Khách hàng Demo", taxCode: "555555555" },
];

export default function CustomerSearchModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.taxCode.includes(query)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Tìm khách hàng</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        <input
          type="text"
          placeholder="Nhập tên KH hoặc MST..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <ul className="divide-y">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => onSelect(c)}
            >
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">MST: {c.taxCode}</p>
            </li>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">Không tìm thấy khách hàng</p>
          )}
        </ul>
      </div>
    </div>
  );
}
