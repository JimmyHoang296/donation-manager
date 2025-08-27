import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { URL } from "../../assets/variables";
import CustomerDetailModal from "./CustomerDetailModal"; // Renamed
import Pagination from "../../components/Pagination";
import LoadingModal from "../../components/LoadingModal";

// Customer Management Component (CRUD)
export default function CustomerManager({ data, setData }) {
  const [customers, setCustomers] = useState(data.customers); // Renamed
  const [searchQuery, setSearchQuery] = useState({
    customerTaxCode: "", // New search field
    customerName: "",
    vAddress:""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Renamed
  const [filteredCustomers, setFilteredCustomers] = useState(customers); // Renamed
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 20;

  const handleSearchChange = (e) => {
    const name = e.target.name;
    setSearchQuery({ ...searchQuery, [name]: e.target.value });
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredCustomers(
      customers.filter(
        (customer) =>
          (!searchQuery.customerTaxCode ||
            customer.customerTaxCode
              .toLowerCase()
              .includes(searchQuery.customerTaxCode.toLowerCase())) &&
          (!searchQuery.customerName ||
            customer.customerName
              .toLowerCase()
              .includes(searchQuery.customerName.toLowerCase()))&&
          (!searchQuery.vAddress ||
            customer.vAddress
              .toLowerCase()
              .includes(searchQuery.vAddress.toLowerCase()))
      )
    );
  }, [searchQuery, customers]);

  useEffect(() => {
    setData((prev) => ({ ...prev, ["customers"]: customers })); // Renamed
  }, [customers]);

  const handleOpenModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  async function handleUpdate(updatedCustomer) {
    const submitData = {
      type: "updateCustomer",
      data: updatedCustomer,
    };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(
          customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending request:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(customerId) {
    if (!confirm("Bạn muốn xóa khách hàng này?")) return;
    const submitData = {
      type: "deleteCustomer",
      data: customerId,
    };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setCustomers((prev) =>
          prev.filter((customer) => customer.id !== customerId)
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending request:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const handleAddNewCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  async function handleSaveNewCustomer(newCustomer) {
    const submitData = {
      type: "newCustomer",
      data: newCustomer,
    };
    console.log(JSON.stringify(submitData));
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        newCustomer.id = result.data;
        setCustomers([...customers, newCustomer]);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending request:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * customersPerPage;
    return filteredCustomers
      .reverse()
      .slice(startIndex, startIndex + customersPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h2>

        <button
          onClick={handleAddNewCustomer}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
        >
          <Plus className="mr-2" /> Thêm khách hàng
        </button>
      </div>

      <div className="mb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Mã số thuế
            </label>

            <input
              type="text"
              name="customerTaxCode"
              value={searchQuery.customerTaxCode}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Tên KH</label>

            <input
              type="text"
              name="customerName"
              value={searchQuery.customerName}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Địa chỉ
            </label>

            <input
              type="text"
              name="vAddress"
              value={searchQuery.vAddress}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex sm:justify-end items-end">
            <button
              onClick={() =>
                setSearchQuery({
                  customerTaxCode: "",
                  email: "",
                  vAddress: "",
                })
              }
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 w-full sm:w-auto"
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Danh sách khách hàng</h3>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Mã số thuế
                </th>

                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Tên KH
                </th>

                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>

                <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3">{customer.customerTaxCode}</td>

                  <td className="px-4 py-3">{customer.customerName}</td>

                  <td className="px-4 py-3 max-w-80 text-wrap">
                    {customer.email}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenModal(customer)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden space-y-4">
          {paginatedCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-4 border rounded-lg shadow-sm bg-white space-y-2"
            >
              <div>
                <span className="text-xs font-semibold text-gray-500">
                  Mã KH:
                </span>

                <p className="text-sm">{customer.customerTaxCode}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500">
                  Tên KH:
                </span>

                <p className="text-sm">{customer.customerName}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500">
                  Email:
                </span>
                <p className="text-sm">{customer.vAddress}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleOpenModal(customer)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <CustomerDetailModal
          data={data}
          customer={selectedCustomer}
          onClose={handleCloseModal}
          onSave={handleSaveNewCustomer}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {loading && <LoadingModal message={"Loading..."} />}
    </div>
  );
}
