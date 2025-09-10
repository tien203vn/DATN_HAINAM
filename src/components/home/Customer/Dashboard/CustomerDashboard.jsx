import React from "react";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, Routes, Route, NavLink } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "../../../../styles/admin.css";

// Dữ liệu fix cứng cho chart
const revenueData = [
  { month: "Jan", revenue: 4000000 },
  { month: "Feb", revenue: 3000000 },
  { month: "Mar", revenue: 2000000 },
  { month: "Apr", revenue: 2780000 },
  { month: "May", revenue: 1890000 },
  { month: "Jun", revenue: 2390000 },
  { month: "Jul", revenue: 3490000 },
];

const orderStatusData = [
  { name: "Hoàn thành", value: 7 },
  { name: "Đang xử lý", value: 2 },
  { name: "Đã hủy", value: 1 },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

function CustomerDashboard() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="main">
        {/* Navbar */}
        <header className="navbar" style ={{ padding: "20px", display: "flex", alignItems: "end", flexDirection: "row-reverse" }}>
          <input type="text" placeholder="Tìm kiếm..." />
          
        </header>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="dashboard">
                <h2>Dashboard</h2>
                <p className="subtitle">Tổng quan về hoạt động của cửa hàng</p>

                {/* Cards */}
                <div className="cards">
                  <div className="card">
                    <p>Tổng doanh thu</p>
                    <h3>4.990.000 ₫</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                  <div className="card">
                    <p>Tổng đơn hàng</p>
                    <h3>9</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                  <div className="card">
                    <p>Tổng sản phẩm</p>
                    <h3>24</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                  <div className="card">
                    <p>Tổng người dùng</p>
                    <h3>3</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts">
                  <div className="chart-box">
                    <h4>Biểu đồ doanh thu</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                    <button className="report-btn">Xuất báo cáo</button>
                  </div>

                  <div className="chart-box">
                    <h4>Trạng thái đơn hàng</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default CustomerDashboard;
