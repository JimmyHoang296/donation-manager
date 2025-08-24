import { useState } from "react";
import Dashboard from "./pages/main/Main";
import TaskManager from "./pages/taskManager/TaskManager";
import Calendar from "./pages/calendar/Calendar";
import SearchStore from "./pages/searchStore/SearchStore";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { mockdata } from "./assets/mockData";
import ViolationManager from "./pages/violation/ViolationManager";
import Login from "./pages/login/Login";
import CustomerManager from "./pages/customerManager/CustomerManager";
import ProjectManager from "./pages/projectManager/ProjectManager";

// Mock data for demonstration

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("project-management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState(mockdata)
  
  const renderContent = () => {
    switch (currentPage) {
      // case "dashboard":
      //   return <Dashboard data={data} />;
      // case "task-management":
      //   return <TaskManager data={data} setData={setData}/>;
      case "calendar":
        return <Calendar data={data} setData={setData}/>;
      // case "search":
      //   return <SearchStore />;
      // case "violation-management":
      //   return <ViolationManager data={data} setData={setData}/>;
      case "customer-management":
        return <CustomerManager data={data} setData={setData}/>;
      case "project-management":
        return <ProjectManager data={data} setData={setData}/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {!isLogin ? (
        <Login setData={setData} setIsLogin={setIsLogin}/>
      ) : (
<div className="flex w-screen h-screen bg-gray-100 font-sans overflow-hidden">
  {/* Sidebar width is controlled here, regardless of how <Sidebar /> is built */}
  <div className={`${isSidebarOpen ? "w-64" : "w-16"} shrink-0`}>
    <Sidebar
      user={data.user}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      setCurrentPage={setCurrentPage}
    />
  </div>

  {/* Main column */}
  <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
    <Header user={data.user.name} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

    {/* Only this area scrolls horizontally (and vertically if needed) */}
    <main className="flex-1 p-2">
      {/* Ensure content can exceed the container width to trigger horizontal scroll */}
      <div className="">
        {renderContent()}
      </div>
    </main>
  </div>
</div>
      )}
    </>
  );
};

export default App;
