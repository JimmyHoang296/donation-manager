import React, { useState, useEffect } from 'react';
import EmployeeManagement from './pages/employeeManagement/EmployeeManagement';
import CustomerManagement from './pages/customerManagement/CustomerManagement';
import ProjectManagement from './pages/projectManagement/ProjectManagement';
import SideBar from './components/sideBar/SideBar';
import Header from './components/header/Header';


// Main App Component
const App = () => {
  // State for managing light/dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from local storage or default to system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // State for managing the current page view
  const [currentPage, setCurrentPage] = useState('projects'); // Default page

  // State for sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Effect to apply or remove 'dark' class from HTML based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 'customers':
        return <CustomerManagement />;
      case 'projects':
        return <ProjectManagement />;
      case 'employees':
        return <EmployeeManagement />;
      default:
        return <ProjectManagement />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <SideBar isSidebarOpen={isSidebarOpen} currentPage={currentPage} darkMode={darkMode} setCurrentPage={setCurrentPage} setIsSidebarOpen={setIsSidebarOpen} toggleDarkMode={toggleDarkMode}/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <Header currentPage={currentPage} toggleSidebar={toggleSidebar}/>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto text-gray-900 dark:text-gray-100">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

// Sidebar Link Component



export default App;
