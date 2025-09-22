import React, { useState } from "react";

export default function CustomerSearchModal({ onClose, onSelect, customers }) {
  const [nameQuery, setNameQuery] = useState("");
  const [taxCodeQuery, setTaxCodeQuery] = useState("");
  const [selected, setSelected] = useState(null);

  function handleQuery (e)  {
    setSelected(null)
    if (e.target.name ==="customerName"){
        setNameQuery(e.target.value)
    }else{
        setTaxCodeQuery(e.target.value)
    }

  }
  const filtered = customers.filter((c) => {
    
    const matchesName = (c.customerName ?? "")
      .toLowerCase()
      .includes(nameQuery.toLowerCase());
    const matchesTax =
      !taxCodeQuery || (c.customerTaxCode ?? "").includes(taxCodeQuery.trim());
    return matchesName && matchesTax;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Tìm khách hàng</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected}
              className={`px-3 py-1 rounded text-white ${
                selected
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Xác nhận
            </button>
            <button onClick={onClose} className="text-2xl">
              &times;
            </button>
          </div>
        </div>

        {/* Search fields */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            name="customerName"
            placeholder="Nhập tên khách hàng..."
            value={nameQuery}
            onChange={(e) => handleQuery(e)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="customerTaxCode"
            placeholder="Nhập mã số thuế..."
            value={taxCodeQuery}
            onChange={(e) => handleQuery(e)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Results */}
        <ul className="divide-y">
          {filtered.map((c) => (
            <li
              key={c.cId}
              className={`p-3 cursor-pointer ${
                selected?.id === c.cId ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelected(c)}
            >
              <p className="font-semibold">{c.customerName}</p>
              <p className="text-sm text-gray-500">MST: {c.customerTaxCode}</p>
              <p className="text-sm text-gray-400">Địa chỉ: {c.vAddress}</p>
            </li>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm p-3">
              Không tìm thấy khách hàng
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
