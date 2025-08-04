import React from "react";

function Header({toggleSidebar, currentPage}) {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-40">
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white ml-4 md:ml-0">
        {currentPage === "customers" && "Quản lý Khách hàng"}
        {currentPage === "projects" && "Quản lý Dự án"}
        {currentPage === "employees" && "Quản lý Nhân viên"}
      </h1>
      {/* User Profile/Notifications (placeholder) */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        </div>
        <div className="flex items-center space-x-2">
          <img
            className="w-8 h-8 rounded-full"
            src="https://placehold.co/40x40/FF5733/FFFFFF?text=JD"
            alt="User Avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/40x40/FF5733/FFFFFF?text=User";
            }}
          />
          <span className="text-gray-800 dark:text-gray-200 font-medium hidden sm:block">
            John Doe
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
