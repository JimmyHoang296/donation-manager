import React, { use, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  Eye,
  File,
  Plus,
  Save,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import Select from "react-select";
import ServiceDetailModal from "../servicesManager/ServiceDetailModal";
import { URL, customerInfors, emptyService } from "../../assets/variables";
import LoadingModal from "../../components/LoadingModal";
import CustomerSearchModal from "./CustomerSearchModal";

export default function ProjectDetailModal({
  data,
  project,
  onClose,
  onSave,
  onUpdate,
  onDelete,
}) {
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullInfor, setFullInfor] = useState(false);
  const [isSearchCustomerModalOpen, setIsSearchCustomerModalOpen] = useState(false)
  const [formData, setFormData] = useState(
    project || {
      id: "",
      customerId: "",
      customerTaxCode: "",
      customerName: "",
      type: "",
      clientRequest: "",
      deadline: "",
      slcpStep: "",
      slcpScore: "",
      slcpWorkerLang: "",
      slcpManagerLang: "",
      higgSelf: "",
      higgSingle: "",
      higgVerification: "",
      higgChem: "",
      repName: "",
      repTitle: "",
      repMail: "",
      repPhone: "",
      expectedTime: "",
    }
  );

  const isNew = !project?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.customerTaxCode) return alert("Chọn khách hàng");
    if (!formData.type) return alert("Chọn loại dịch vụ");

    if (isNew) {
      onSave(formData);
    } else {
      onUpdate(formData);
    }
  };

  const handleSearchCustomer = () => {};
  // ===== Service Handling =====
  const handleOpenService = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };
  // service row change
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;

    // convert quantity & price to numbers before saving
    updatedServices[index].quantity =
      Number(updatedServices[index].quantity) || 0;
    updatedServices[index].price = Number(updatedServices[index].price) || 0;

    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleAddService = () => {
    const newService = { ...emptyService, prjId: formData.id };
    setSelectedService(newService);
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Bạn muốn xóa công viêc này này?")) return;
    const submitData = { type: "deleteService", data: serviceId };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        const updatedServices = formData.services.filter(
          (s, i) => s.id !== serviceId
        );
        setFormData((prev) => ({ ...prev, services: updatedServices }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // handleCloseServiceModal();
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleSaveNewService = async (newService) => {
    const submitData = { type: "newService", data: newService };
    console.log(submitData);
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();
      if (result.success) {
        newService.id = result.data;
        setFormData((prev) => ({
          ...prev,
          services: [...(prev.services || []), newService],
        }));
        // handleCloseServiceModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (updatedService) => {
    const submitData = { type: "updateService", data: updatedService };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          services: prev.services.map((s) =>
            s.id === updatedService.id ? updatedService : s
          ),
        }));
        handleCloseServiceModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-calc total
  const total = formData.services?.reduce(
    (sum, s) => sum + (s.quantity || 0) * (s.price || 0),
    0
  );

  // ======Handle search customer modal======
  const handleCloseSearchCustomerModal =()=>{
    setIsSearchCustomerModalOpen (false)
  }

  const handleSelectCustomer = () => {

  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          {/* Action button */}
          <div className="flex items-center justify-start space-x-2">
            <h3 className="text-xl font-bold mr-12">
              {isNew ? "Thêm dự án" : "Thông tin dự án"}
            </h3>
            <button
              onClick={handleSave}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Save className="mr-2" /> Save
            </button>

            {!isNew && (
              <>
                {/* <button
                  onClick={handleSave}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <File className="mr-2" /> Tạo Booking
                </button> */}
                <button
                  onClick={() => onDelete(formData.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Trash className="mr-2" /> Hủy dự án
                </button>
                <button
                  onClick={() => onDelete(formData.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <File className="mr-2" /> Hoàn tất
                </button>
              </>
            )}
          </div>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        {/* Common fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 border-b-1 pb-6">
          <div className="flex items-center justify-start space-x-2 col-span-2">
            <h3 className="text-xl font-bold mr-12">Thông tin KH</h3>
            <button
              onClick={()=> setIsSearchCustomerModalOpen(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Search className="mr-2" /> Tìm KH
            </button>
            <button
              onClick={() => setFullInfor(!fullInfor)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
              {fullInfor ? (
                <p className="flex">
                  <ArrowBigUp className="mr-2" /> Ẩn thông tin
                </p>
              ) : (
                <p className="flex">
                  <ArrowBigDown className="mr-2" /> Hiện thông tin
                </p>
              )}
            </button>
          </div>
          {customerInfors.map((c, id) => (
            <div key={id} className={c.className(fullInfor)}>
              <label className="block text-sm font-medium">{c.label}</label>
              <input
                type={c.type}
                name={c.name}
                value={formData[c.name]}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-start space-x-2 col-span-2">
            <h3 className="text-xl font-bold mr-12">Thông tin dự án</h3>
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
              {[
                "vFEM",
                "vSLCP",
                "vZIV",
                "vSTZ",
                "vFDM",
                "vCOC",
                "t-FEM",
                "t-ZDHC",
                "t-CleanChain",
                "t-STZ",
                "Other",
              ].map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
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
        {formData.type === "vSLCP" && (
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
                  formData.slcpStep
                    ? formData.slcpStep
                        .split(",")
                        .map((s) => ({ value: s.trim(), label: s }))
                    : []
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    slcpStep: selected.map((s) => s.value).join(","), // 👈 store as string
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

        {formData.type === "vFEM" && (
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
                  formData.higgChem
                    ? formData.higgChem
                        .split(",")
                        .map((s) => ({ value: s.trim(), label: s }))
                    : []
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    higgChem: selected.map((s) => s.value).join(","),
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

        {/* Services Section */}
        {/* Services Table */}
        {/* Service Section */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách công việc trong dự án
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleAddService}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
              >
                <File className="mr-2" /> Tạo quoting
              </button>
              <button
                onClick={handleAddService}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
              >
                <Plus className="mr-2" /> Thêm công việc
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Tên Service</th>
                  <th className="px-4 py-3 text-left">Mandays</th>
                  <th className="px-4 py-3 text-left">Item cost</th>
                  <th className="px-4 py-3 text-left">Travel fee</th>
                  <th className="px-4 py-3 text-left">Admin fee</th>
                  <th className="px-4 py-3 text-left">Cost USD</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formData.services?.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 max-[4rem]">{s.name}</td>
                    <td className="px-4 py-3">{s.manday}</td>
                    <td className="px-4 py-3">{s.itemCost}</td>
                    <td className="px-4 py-3">{s.travelFee}</td>
                    <td className="px-4 py-3">{s.adminFee}</td>
                    <td className="px-4 py-3">{s.costUSD}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleOpenService(s)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 max-[4rem]">Total</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">
                    {formData.services?.reduce(
                      (sum, item) => sum + (item.costUSD || 0),
                      0
                    )}
                  </td>
                  <td className="px-4 py-3 text-center"> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isServiceModalOpen && (
          <ServiceDetailModal
            service={selectedService}
            onClose={handleCloseServiceModal}
            onSave={handleSaveNewService}
            onUpdate={handleUpdateService}
            onDelete={handleDeleteService}
          />
        )}
        {isSearchCustomerModalOpen && (
          <CustomerSearchModal
            customers={data.customers}
            onClose={handleCloseSearchCustomerModal}
            onSelect={handleSelectCustomer}
          />
        )}
      </div>
      {loading && <LoadingModal message="Loading..." />}
    </div>
  );
}
