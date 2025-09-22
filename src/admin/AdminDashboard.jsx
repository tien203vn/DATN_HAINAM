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

import "../styles/admin.css";

// Import các trang quản lý
import Products from "../pages/pageAdmin/Products";
import Orders from "../pages/pageAdmin/Orders";
import Users from "../pages/pageAdmin/Users";
import Categories from "../pages/pageAdmin/Categories";
import UsersManager from "./UsersManager";

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

function AdminDashboard() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Tiến Nổ</div>
        <nav className="menu">
          <NavLink to="." end>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to="products">
            <FaBox /> Sản phẩm
          </NavLink>
          <NavLink to="orders">
            <FaShoppingCart /> Đơn hàng
          </NavLink>
          <NavLink to="users">
            <FaUsers /> Người dùng
          </NavLink>
          <NavLink to="categories">
            <FaList /> Danh mục
          </NavLink>
        </nav>
        <div className="logout">
          <FaSignOutAlt /> Đăng xuất
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Navbar */}
        <header className="navbar" style ={{ padding: "20px" }}>
          <input type="text" placeholder="Tìm kiếm..." />
          <div className="profile">
            <span className="bell">🔔</span>
            <div className="avatar">A</div>
            <span>Admin</span>
          </div>
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
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<UsersManager />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
