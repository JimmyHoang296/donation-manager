import React from "react";
import SidebarLink from "./SidebarLink";

function SideBar({isSidebarOpen, setIsSidebarOpen, currentPage, setCurrentPage, darkMode, toggleDarkMode}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-6 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <svg
          className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý Dự án
        </span>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <SidebarLink
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.165-.021-.328-.06-.487m0 0A7.001 7.001 0 0017 12V8a6 6 0 00-6-6H5a6 6 0 00-6 6v4a6 6 0 006 6h2m2 0h2M7 12h2m2 0h2"
          text="Khách hàng"
          onClick={() => {
            setCurrentPage("customers");
            setIsSidebarOpen(false); // Close sidebar on link click for mobile
          }}
          isActive={currentPage === "customers"}
        />
        <SidebarLink
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          text="Dự án"
          onClick={() => {
            setCurrentPage("projects");
            setIsSidebarOpen(false);
          }}
          isActive={currentPage === "projects"}
        />
        <SidebarLink
          icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          text="Nhân viên"
          onClick={() => {
            setCurrentPage("employees");
            setIsSidebarOpen(false);
          }}
          isActive={currentPage === "employees"}
        />
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center p-3 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {darkMode ? (
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.573l.707-.707M6.993 17.007l-.707.707M18.364 18.364l-.707-.707M5.636 5.636l-.707-.707"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
              ></path>
            </svg>
          )}
          {darkMode ? "Chế độ Sáng" : "Chế độ Tối"}
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
