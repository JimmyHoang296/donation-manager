import React, { useState } from "react";
import { Save, Trash } from "lucide-react";
import Select from "react-select";

export default function BookingDetailModal({
  data,
  booking,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}) {
  const [formData, setFormData] = useState(
    booking || {
      id: "",
      customerId: "",
      customerTaxCode: "",
      customerName: "",
      type: "",
      clientRequest: "",
      deadline: "",
      slcpStep: [],
      slcpScore: "",
      slcpWorkerLang: "",
      slcpManagerLang: "",
      higgSelf: "",
      higgSingle: "",
      higgVerification: "",
      higgChem: [],
      repName: "",
      repTitle: "",
      repMail: "",
      repPhone: "",
      expectedTime: "",
    }
  );

  const isNew = !booking?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.client) return alert("Client is required");
    if (!formData.type) return alert("Type is required");

    if (isNew) {
      onSave(formData);
    } else {
      onUpdate(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-bold">
            {isNew ? "Thêm Booking" : "Chi tiết Booking"}
          </h3>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {/* Common fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium">Tên khách hàng</label>
            <Select
              name="customerName"
              value={
                formData.customerName
                  ? {
                      value: formData.customerName,
                      label: formData.customerName,
                    }
                  : null
              }
              onChange={(selected) => {
                const customer = data.customers.find(
                  (c) => c.customerName === selected.value
                );
                setFormData({
                  ...formData,
                  customerName: customer.customerName,
                  customerTaxCode: customer.customerTaxCode,
                });
              }}
              options={data.customers.map((c) => ({
                value: c.customerName,
                label: c.customerName,
              }))}
            />
          </div>

          {/* Customer Tax Code */}
          <div>
            <label className="block text-sm font-medium">Mã số thuế KH</label>
            <Select
              name="customerTaxCode"
              value={
                formData.customerTaxCode
                  ? {
                      value: formData.customerTaxCode,
                      label: formData.customerTaxCode,
                    }
                  : null
              }
              onChange={(selected) => {
                const customer = data.customers.find(
                  (c) => c.customerTaxCode === selected.value
                );
                setFormData({
                  ...formData,
                  customerName: customer.customerName,
                  customerTaxCode: customer.customerTaxCode,
                });
              }}
              options={data.customers.map((c) => ({
                value: c.customerTaxCode,
                label: c.customerTaxCode,
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client request</label>
            <input
              type="text"
              name="clientRequest"
              value={formData.clientRequest}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Loại dịch vụ (chọn để nhập chi tiết)
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Select --</option>
              <option value="slcp">SLCP</option>
              <option value="higg">Higg</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Conditional fields */}
        {formData.type === "slcp" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t pt-4">
            <h4 className="col-span-2 font-bold">SLCP Info</h4>
            <div>
              <label className="block text-sm font-medium">
                What step is requested to be verified?
              </label>
              <Select
                name="slcpStep"
                isMulti
                value={
                  formData.slcpStep?.map((s) => ({ value: s, label: s })) || []
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    slcpStep: selected.map((s) => s.value),
                  })
                }
                options={[
                  { value: "step 1", label: "Step 1" },
                  { value: "step 2", label: "Step 2" },
                  { value: "step 3", label: "Step 3" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Score if your fatory finished self-assesment
              </label>
              <input
                placeholder="Score"
                type="number"
                name="slcpScore"
                value={formData.slcpScore}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Language of workers
              </label>
              <input
                placeholder="Worker Lang"
                type="text"
                name="slcpWorkerLang"
                value={formData.slcpWorkerLang}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Language of management
              </label>
              <input
                placeholder="Manager Lang"
                type="text"
                name="slcpManagerLang"
                value={formData.slcpManagerLang}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {formData.type === "higg" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t pt-4">
            <h4 className="col-span-2 font-bold">Higg Info</h4>
            <div>
              <label className="block text-sm font-medium">
                Higg FEM Self-Assessment
              </label>
              <select
                name="higgSelf"
                value={formData.higgSelf}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Higg FEM ID for single physical location?
              </label>
              <select
                name="higgSingle"
                value={formData.higgSingle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No, combined locations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Is a Higg FEM 2024 or Facility Foundations Verification
                required?
              </label>
              <select
                name="higgVerification"
                value={formData.higgVerification}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select...</option>
                <option value="2024 Verification">
                  Higg FEM 2024 Verification{" "}
                </option>
                <option value="Facility Foundation Verification">
                  Higg FEM Facility Foundation Verification
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Chemical Use in other operation/ maintenance
              </label>
              <Select
                name="higgChem"
                isMulti
                value={
                  formData.higgChem?.map((s) => ({ value: s, label: s })) || []
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    higgChem: selected.map((s) => s.value),
                  })
                }
                options={[
                  {
                    value: "Chemicals used in Wastewater Treatment",
                    label: "Chemicals used in Wastewater Treatment",
                  },
                  { value: "Spot Cleaner", label: "Spot Cleaner" },
                  { value: "Machine Lubricants", label: "Machine Lubricants" },
                  { value: "Others if any", label: "Others if any" },
                ]}
              />
            </div>
          </div>
        )}

        {/* Rep Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <h4 className="col-span-2 font-bold">Representative</h4>
          <input
            placeholder="Name"
            type="text"
            name="repName"
            value={formData.repName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            placeholder="Title"
            type="text"
            name="repTitle"
            value={formData.repTitle}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            placeholder="Email"
            type="email"
            name="repMail"
            value={formData.repMail}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            placeholder="Phone"
            type="tel"
            name="repPhone"
            value={formData.repPhone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            placeholder="Expected Time"
            type="text"
            name="expectedTime"
            value={formData.expectedTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleSave}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Save className="mr-2" /> Save
          </button>
          {!isNew && (
            <button
              onClick={() => onDelete(formData.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Trash className="mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
