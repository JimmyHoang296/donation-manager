import React from "react";

function EmployeeManagement() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Quản lý Nhân viên
      </h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Đây là nội dung trang quản lý nhân viên. Bạn có thể quản lý thông tin
        nhân sự, vai trò và hiệu suất làm việc.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
          >
            <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200 mb-2">
              Nhân viên {i + 1}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chức vụ: Lập trình viên
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Phòng ban: Phát triển
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
              Xem hồ sơ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeManagement;
