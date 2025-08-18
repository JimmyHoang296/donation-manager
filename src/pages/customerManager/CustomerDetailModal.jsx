import React, { useState } from 'react';
import { Save, Trash } from 'lucide-react';

const CustomerDetailModal = ({ data, customer, onClose, onSave, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState(customer || {
    id: "",
    customerCode: "", // Mã KH
    customerName: "", // Tên KH
    email: "", // Địa chỉ email
    englishName: "", // Tên tiếng anh
    vietnameseName: "", // Tên tiếng việt
    englishAddress: "", // Địa chỉ tiếng anh
    vietnameseAddress: "", // Địa chỉ tiếng việt
    legalRepresentative: "", // Đại diện pháp luật
    position: "", // Chức vụ
    taxCode: "", // MST
    invoiceEmail: "", // Email hóa đơn
    phoneNumber: "", // SDT
    industry: "", // Ngành sản xuất
    numberOfEmployees: "", // Số nhân viên
    workshopArea: "", // Diện tích nhà xưởng
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isNewCustomer = !customer?.id;

  const handleSave = () => {
    if (isNewCustomer) {
      if (!formData.customerCode) {
        alert('Hãy nhập Mã KH');
        return;
      }
      if (!formData.customerName) {
        alert('Hãy nhập Tên KH');
        return;
      }
      onSave(formData);
    } else {
      onUpdate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-4 border-b">
          <h3 className="text-2xl font-bold">
            {isNewCustomer ? "Thêm khách hàng mới" : "Chi tiết khách hàng"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-600 text-5xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Mã KH</label>
            <input type="text" name="customerCode" value={formData.customerCode} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Tên KH</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Tên tiếng anh</label>
            <input type="text" name="englishName" value={formData.englishName} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Tên tiếng việt</label>
            <input type="text" name="vietnameseName" value={formData.vietnameseName} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Địa chỉ tiếng anh</label>
            <input type="text" name="englishAddress" value={formData.englishAddress} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Địa chỉ tiếng việt</label>
            <input type="text" name="vietnameseAddress" value={formData.vietnameseAddress} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Đại diện pháp luật</label>
            <input type="text" name="legalRepresentative" value={formData.legalRepresentative} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Chức vụ</label>
            <input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">MST</label>
            <input type="text" name="taxCode" value={formData.taxCode} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Email hóa đơn</label>
            <input type="email" name="invoiceEmail" value={formData.invoiceEmail} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">SDT</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Ngành sản xuất</label>
            <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Số nhân viên</label>
            <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-700 text-sm mb-1">Diện tích nhà xưởng</label>
            <input type="number" name="workshopArea" value={formData.workshopArea} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4 border-t pt-4">
          <button
            onClick={handleSave}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
          >
            <Save className="mr-2" /> Lưu
          </button>
          {!isNewCustomer && (
            <button
              onClick={() => onDelete(customer.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash className="mr-2" /> Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;