import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { URL } from "../../assets/variables";
import BookingDetailModal from "./BookingDetailModal";
import Pagination from "../../components/Pagination";
import LoadingModal from "../../components/LoadingModal";

export default function BookingManager({ data, setData }) {
  const [bookings, setBookings] = useState(data.bookings || []);
  const [searchQuery, setSearchQuery] = useState({
    client: "",
    type: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 20;

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredBookings(
      bookings.filter(
        (b) =>
          (!searchQuery.client ||
            b.client
              .toLowerCase()
              .includes(searchQuery.client.toLowerCase())) &&
          (!searchQuery.type ||
            b.type.toLowerCase().includes(searchQuery.type.toLowerCase()))
      )
    );
  }, [searchQuery, bookings]);

  useEffect(() => {
    setData((prev) => ({ ...prev, bookings }));
  }, [bookings]);

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  async function handleUpdate(updatedBooking) {
    const submitData = { type: "updateBooking", data: updatedBooking };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setBookings(
          bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b))
        );
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(bookingId) {
    if (!confirm("Bạn muốn xóa booking này?")) return;
    const submitData = { type: "deleteBooking", data: bookingId };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddNewBooking = () => {
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  async function handleSaveNewBooking(newBooking) {
    const submitData = { type: "newBooking", data: newBooking };
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();
      if (result.success) {
        newBooking.id = result.data;
        setBookings([...bookings, newBooking]);
        handleCloseModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * bookingsPerPage;
    return filteredBookings
      .slice()
      .reverse()
      .slice(startIndex, startIndex + bookingsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Booking</h2>
        <button
          onClick={handleAddNewBooking}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
        >
          <Plus className="mr-2" /> Thêm booking
        </button>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-gray-700 text-sm mb-1">Client</label>
          <input
            type="text"
            name="client"
            value={searchQuery.client}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={searchQuery.type}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
            placeholder="higg / slcp"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedBookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">{b.client}</td>
                <td className="px-4 py-3">{b.type}</td>
                <td className="px-4 py-3">{b.deadline}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(b)}
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
        <BookingDetailModal
          data={data}
          booking={selectedBooking}
          onClose={handleCloseModal}
          onSave={handleSaveNewBooking}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {loading && <LoadingModal message="Loading..." />}
    </div>
  );
}
