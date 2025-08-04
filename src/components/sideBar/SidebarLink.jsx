import React from 'react'

const SidebarLink = ({ icon, text, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <svg
        className="w-6 h-6 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
      </svg>
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default SidebarLink
