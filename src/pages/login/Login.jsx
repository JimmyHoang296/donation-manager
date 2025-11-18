import React, { useState } from "react";
import LoadingModal from "../../components/LoadingModal";
import { URL } from "../../assets/variables";
import { useApp } from "../../Context";

const Login = ({ setIsLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState("");
  const { data, setData } = useApp();

  const sites = ["Ktest", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9"];

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(userName, password, site);
    if (!userName || !password || !site) {
      alert("Nhập đủ thông tin để đăng nhập");
      return;
    }
    const submitData = {
      type: "login",
      data: { login: { userName, password, site } },
    };
    try {
      setLoading(true);
      console.log(submitData)
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(submitData), // body data type must match "Content-Type" header
      });

      const result = await response.json(); // Assuming response is JSON
      if (result.success) {
        // update to local
        console.log(result);
        setData(result);
        setIsLogin(true);
      } else {
        alert("Thông tin đăng nhập chưa chính xác");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      return { success: false, error: error.message }; // Return error object
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-800">
          Coupon Khỏe
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tài khoản
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tài khoản"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div>
            <label
              htmlFor="site"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cơ sở
            </label>
            <select
              id="site"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            >
              <option value=""></option>
              {sites.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
      {loading && <LoadingModal message={"loading..."} />}
    </div>
  );
};

export default Login;
