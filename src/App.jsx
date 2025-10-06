import { useState } from "react";
import { mockdata } from "./assets/mockData";
import Login from "./pages/login/Login";
import DonationManager from "./pages/donationManager/DonationManager";
import Dashboard from "./pages/dashboard/Dashboard";
import PaymentManager from "./pages/paymentManager/PaymentManager";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("donation-manager");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState(mockdata);

  const renderContent = () => {
    switch (currentPage) {
      case "donation-manager":
        return <DonationManager data={data} setData={setData} />;
      case "dashboard":
        return <Dashboard data = {data}/>
      case "payment-manager":
        return <PaymentManager data = {data} setData={setData}/>
      default:
        return <PaymentManager data={data} setData={setData} />;
    }
  };

  return (
    <>
      {!isLogin ? (
        <Login setData={setData} setIsLogin={setIsLogin} />
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
            <Header
              user={data.user.name}
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
