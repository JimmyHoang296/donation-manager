import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { URL } from "../../assets/variables";
import DonationDetailModal from "./DonationDetailModal";
import Pagination from "../../components/Pagination";
import LoadingModal from "../../components/LoadingModal";
import { toDateInputValue } from "../../assets/helpers";

export default function DonationManager({ data, setData }) {
  const [donations, setDonations] = useState(data.donations || []);
  const [payments, setPayments] = useState(data.payments || []);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    bizName: "",
    startDate: "",
    endDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filteredDonations, setFilteredDonations] = useState(donations);
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 10;

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredDonations(
      donations.filter(
        (donation) =>
          (!searchQuery.name ||
            donation.name
              .toLowerCase()
              .includes(searchQuery.name.toLowerCase())) &&
          (!searchQuery.bizName ||
            donation.bizName
              .toLowerCase()
              .includes(searchQuery.bizName.toLowerCase()))
      )
    );
  }, [searchQuery, donations]);

  useEffect(() => {
    setData((prev) => ({ ...prev, donations }));
  }, [donations]);

  const statusStyle = {
    draft: "bg-red-300",
    active: "bg-green-300",
    cancelled: "bg-yellow-300",
  };

  // Reset current page if it goes out of range after filtering/deleting
  useEffect(() => {
    const maxPage = Math.ceil(filteredDonations.length / donationsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredDonations, currentPage]);

  const handleOpenModal = (donation) => {
    setSelectedDonation(donation);
    setSelectedPayment(
      payments.filter((v) => v.d_id.toString() === donation.id.toString())
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonation(null);
    setSelectedPayment(null);
  };

  async function handleUpdate(updatedDonation, action) {
    if (action === "activate") {
      updatedDonation = { ...updatedDonation, status: "active" };
    } else if (action === "cancelled") {
      updatedDonation = { ...updatedDonation, status: "cancelled" };
      updatedDonation = updatedDonation.cancelledDate
        ? updatedDonation
        : { ...updatedDonation, cancelledDate: new Date() };
    }
    const submitData = {
      type: "updateDonation",
      data: updatedDonation,
    };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setDonations(
          donations.map((p) =>
            p.id === updatedDonation.id ? updatedDonation : p
          )
        );
        setSelectedDonation(updatedDonation);
        alert("Update donation successfully");
        // handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddNewDonation = () => {
    setSelectedDonation(null);
    setIsModalOpen(true);
  };

  async function handleSaveNewDonation(newDonation) {
    const submitData = { type: "newDonation", data: newDonation };
    console.log(JSON.stringify(submitData));
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        newDonation.id = result.data.newId;
        newDonation.status = "draft";
        setDonations([...donations, newDonation]);
        alert("Create donation successfully");
        // handleCloseModal();
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  }

  const paginatedDonations = useMemo(() => {
    const startIndex = (currentPage - 1) * donationsPerPage;
    return [...filteredDonations] // clone to avoid mutation
      .reverse()
      .slice(startIndex, startIndex + donationsPerPage);
  }, [filteredDonations, currentPage]);

  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Donation manager</h2>
        <button
          onClick={handleAddNewDonation}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center"
        >
          <Plus className="mr-2" /> Add new donation
        </button>
      </div>

      {/* Search */}
      <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={searchQuery.name}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Business name
          </label>
          <input
            type="text"
            name="bizName"
            value={searchQuery.hashTags}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Start date</label>
          <input
            type="date"
            name="startDate"
            value={searchQuery.startDate}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">End date</label>
          <input
            type="date"
            name="endDate"
            value={searchQuery.endDate}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex sm:justify-start items-end">
          <button
            onClick={() =>
              setSearchQuery({
                caption: "",
                status: "",
                hashTags: "",
                createdBy: "",
              })
            }
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Clear search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Pledge Amount</th>
              <th className="px-4 py-3 text-left">Frequency</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">Last Payment</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {paginatedDonations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-4 py-3">
                  {" "}
                  <span
                    className={`p-2 rounded-xl ${statusStyle[donation.status]}`}
                  >
                    {donation.status}
                  </span>{" "}
                </td>

                <td className="px-4 py-3 max-w-50">{donation.amount}</td>
                <td className="px-4 py-3">{donation.frequency}</td>
                <td className="px-4 py-3">
                  {toDateInputValue(donation.startDate)}
                </td>
                <td className="px-4 py-3">
                  {toDateInputValue(donation.endDate)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(donation)}
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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isModalOpen && (
        <DonationDetailModal
          user={data.user}
          payment={selectedPayment}
          donation={selectedDonation}
          onClose={handleCloseModal}
          onSave={handleSaveNewDonation}
          onUpdate={handleUpdate}
        />
      )}
      {loading && <LoadingModal message="Loading..." />}
    </div>
  );
}
