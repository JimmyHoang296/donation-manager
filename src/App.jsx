import { useState } from "react";
import Login from "./pages/login/Login";
import CouponManager from "./pages/couponManager/CouponManager";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("coupon-manager");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const renderContent = () => {
    switch (currentPage) {
      case "coupon-manager":
        return <CouponManager />;
      default:
        return <CouponManager />;
    }
  };

  return (
    <>
      {!isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <div className="flex w-screen h-screen bg-gray-100 font-sans overflow-hidden">
          {/* Sidebar width is controlled here, regardless of how <Sidebar /> is built */}
          <div className={`${isSidebarOpen ? "w-64" : "w-16"} shrink-0`}>
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Main column */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Header
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Only this area scrolls horizontally (and vertically if needed) */}
            <main className="flex-1 p-2 overflow-auto">
              {/* Ensure content can exceed the container width to trigger horizontal scroll */}
              <div className="">{renderContent()}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
