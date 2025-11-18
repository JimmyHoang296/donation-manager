import React, { useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { URL } from "../../assets/variables";
import CouponDetailModal from "./CouponDetailModal";
import Pagination from "../../components/Pagination";
import LoadingModal from "../../components/LoadingModal";
import { toDateInputValue } from "../../assets/helpers";
import CouponCard from "./CouponCard";
import { useApp } from "../../Context";

export default function CouponManager() {
  const { data, setData } = useApp();
  const coupons = data.veGui || [];
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    id: "",
    phone: "",
    isAll: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const CouponsPerPage = 10;

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    setCurrentPage(1);
  };

  useEffect(() => {
    setFilteredCoupons(
      !searchQuery.name && !searchQuery.id && !searchQuery.phone
        ? []
        : coupons.filter(
            (coupon) =>
              (!searchQuery.name ||
                coupon.name
                  .toLowerCase()
                  .includes(searchQuery.name.toLowerCase())) &&
              (!searchQuery.id ||
                coupon.id
                  .toLowerCase()
                  .includes(searchQuery.id.toLowerCase())) &&
              (!searchQuery.phone ||
                coupon.phone
                  .toString()
                  .toLowerCase()
                  .includes(searchQuery.phone.toLowerCase())) &&
              (searchQuery.isAll || coupon.status=="")
          )
    );
  }, [searchQuery, coupons]);

  // Reset current page if it goes out of range after filtering/deleting
  useEffect(() => {
    const maxPage = Math.ceil(filteredCoupons.length / CouponsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredCoupons, currentPage]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
    setSelectedPayment(null);
  };

  const handleAddNewCoupon = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const paginatedCoupons = useMemo(() => {
    const startIndex = (currentPage - 1) * CouponsPerPage;
    return [...filteredCoupons] // clone to avoid mutation
      .reverse()
      .slice(startIndex, startIndex + CouponsPerPage);
  }, [filteredCoupons, currentPage]);

  const totalPages = Math.ceil(filteredCoupons.length / CouponsPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý coupon</h2>
        <button
          onClick={handleAddNewCoupon}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center"
        >
          <Plus className="mr-2" /> Tạo phiếu mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={searchQuery.phone}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Tên khách hàng
          </label>
          <input
            type="text"
            name="name"
            value={searchQuery.name}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Mã coupon</label>
          <input
            type="text"
            name="id"
            value={searchQuery.id}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Tìm trong</label>
          <select
            name="isAll"
            value={searchQuery.isAll}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="false">Vé còn hạn</option>
            <option value="true">Tìm tất cả</option>
          </select>
        </div>
        <div className="flex sm:justify-start items-end">
          <button
            onClick={() =>
              setSearchQuery({
                name: "",
                id: "",
                phone: "",
                isAll: false,
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
        {paginatedCoupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isModalOpen && (
        <CouponDetailModal
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {loading && <LoadingModal message="Loading..." />}
    </div>
  );
}
