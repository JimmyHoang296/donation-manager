import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { toDateInputValue } from "../../assets/helpers";

const PaymentDetailModal = ({ payment, onClose, onSave }) => {
  const [formData, setFormData] = useState({...payment, actualAmount: payment.dueAmount, actualDate:toDateInputValue(payment.dueDate)});
  
  useEffect(() => {
    // if (payment) {
    //   setFormData({
    //     actualAmount: payment.actualAmount || "",
    //     actualDate: toDateInputValue(payment.actualDate) || "",
    //   });
    // }
  }, [payment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.actualAmount || !formData.actualDate) {
      alert("Please fill in both Actual Amount and Actual Date");
      return;
    }

    onSave({
      ...payment,
      actualAmount: formData.actualAmount,
      actualDate: formData.actualDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-bold">Confirm Payment</h3>
          <button onClick={onClose} className="text-gray-600 text-3xl leading-none">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Actual Amount</label>
            <input
              type="number"
              name="actualAmount"
              value={formData.actualAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter actual amount"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Actual Date</label>
            <input
              type="date"
              name="actualDate"
              value={formData.actualDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-600"
          >
            <Save className="mr-2 w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
