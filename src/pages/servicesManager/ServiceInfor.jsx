import React, { useState, useEffect } from "react";

export default function ServiceInfor({
  service,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}) {
  const [formData, setFormData] = useState(service || emptyService);

  useEffect(() => {
    if (service) setFormData(service);
  }, [service]);

  // 🔹 Auto-calc values when relevant inputs change
  useEffect(() => {
    const costUSD =
      formData.manday * formData.itemCost +
      formData.travelFee +
      formData.adminFee;
    const totalVND = costUSD * formData.exchangeRate || 0;
    const VAT = costUSD * parseFloat(formData.vatRate) || 0; // example 10% VAT
    const total = costUSD + VAT || 0;

    setFormData((prev) => ({
      ...prev,
      costUSD,
      VAT,
      total,
      totalVND,
    }));
  }, [
    formData.manday,
    formData.itemCost,
    formData.rate,
    formData.travelFee,
    formData.adminFee,
  ]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {formData.id ? "Edit Service" : "New Service"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Service Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {["emp1", "emp2", "emp3"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Inputs that affect cost */}
          <h3 className="font-semibold">Input Costs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["exchangeRate", "vatRate"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["manday", "itemCost", "travelFee", "adminFee"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
            {["costUSD", "VAT", "total", "totalVND"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
            ))}
          </div>

          {/* Readonly Calculated */}
          <h3 className="font-semibold">Các chi phí</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "allowance",
              "overnight",
              "reporting",
              "nhatKhang",
              "hotel",
              "otherExpense",
              "grabXanh",
              "flightTicket",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            {formData.id && (
              <button
                type="button"
                onClick={() => onDelete(formData.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
