import React from "react";

function CustomerManagement() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Quản lý Khách hàng
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Đây là nội dung trang quản lý khách hàng. Bạn có thể thêm danh sách
        khách hàng, thông tin liên hệ, lịch sử giao dịch tại đây.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
          >
            <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200 mb-2">
              Khách hàng {i + 1}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Email: khachhang{i + 1}@example.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Điện thoại: (123) 456-789{i}
            </p>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-200">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerManagement;
