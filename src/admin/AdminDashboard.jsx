import React, { useState, useEffect } from "react";
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
import axiosInstance from "../shared/utils/authorizedAxios";

import "../styles/admin.css";

// Import các trang quản lý
import Products from "../pages/pageAdmin/Products";
import Orders from "../pages/pageAdmin/Orders";
import Users from "../pages/pageAdmin/Users";
import Categories from "../pages/pageAdmin/Categories";
import UsersManager from "./UsersManager";
import CustomerOrders from "./CustomerOrder";

function AdminDashboard() {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthlyOrders, setMonthlyOrders] = useState({});
  const [monthlyProducts, setMonthlyProducts] = useState({});
  const [monthlyCustomers, setMonthlyCustomers] = useState({});
  const [monthlyHours, setMonthlyHours] = useState({});
  const [monthlyStatus, setMonthlyStatus] = useState({});

  useEffect(() => {
    axiosInstance.get("booking/admin/monthly-summary").then((res) => {
      setMonthlyOrders(res.data?.data || {});
    });
    axiosInstance.get("booking/admin/monthly-product-summary").then((res) => {
      setMonthlyProducts(res.data?.data || {});
    });
    axiosInstance.get("booking/admin/monthly-customer-summary").then((res) => {
      setMonthlyCustomers(res.data?.data || {});
    });
    axiosInstance.get("booking/admin/monthly-hours-summary").then((res) => {
      setMonthlyHours(res.data?.data || {});
    });
    axiosInstance.get("booking/admin/monthly-status-summary").then((res) => {
      setMonthlyStatus(res.data?.data || {});
    });
  }, []);

  // Tổng đơn hàng của tháng đang chọn
  const totalOrdersThisMonth = monthlyOrders[selectedMonth] ?? 0;
  // Tổng đơn hàng tháng trước
  const prevMonth = selectedMonth > 1 ? selectedMonth - 1 : 12;
  const totalOrdersPrevMonth = monthlyOrders[prevMonth] ?? 0;

  // Tính phần trăm tăng/giảm
  let percentChange = 0;
  if (totalOrdersPrevMonth === 0 && totalOrdersThisMonth > 0) {
    percentChange = 100;
  } else if (totalOrdersPrevMonth === 0 && totalOrdersThisMonth === 0) {
    percentChange = 0;
  } else {
    percentChange =
      ((totalOrdersThisMonth - totalOrdersPrevMonth) / totalOrdersPrevMonth) *
      100;
  }
  const percentText =
    percentChange >= 0
      ? `↑ ${percentChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentChange).toFixed(2)}% so với tháng trước`;

  // Tổng sản phẩm cho thuê của tháng đang chọn
  const totalProductsThisMonth = monthlyProducts[selectedMonth] ?? 0;
  const totalProductsPrevMonth = monthlyProducts[prevMonth] ?? 0;

  let percentProductChange = 0;
  if (totalProductsPrevMonth === 0 && totalProductsThisMonth > 0) {
    percentProductChange = 100;
  } else if (totalProductsPrevMonth === 0 && totalProductsThisMonth === 0) {
    percentProductChange = 0;
  } else {
    percentProductChange =
      ((totalProductsThisMonth - totalProductsPrevMonth) / totalProductsPrevMonth) *
      100;
  }
  const percentProductText =
    percentProductChange >= 0
      ? `↑ ${percentProductChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentProductChange).toFixed(2)}% so với tháng trước`;

  // Tổng người dùng đã thuê của tháng đang chọn
  const totalCustomersThisMonth = monthlyCustomers[selectedMonth] ?? 0;
  const totalCustomersPrevMonth = monthlyCustomers[prevMonth] ?? 0;

  let percentCustomerChange = 0;
  if (totalCustomersPrevMonth === 0 && totalCustomersThisMonth > 0) {
    percentCustomerChange = 100;
  } else if (totalCustomersPrevMonth === 0 && totalCustomersThisMonth === 0) {
    percentCustomerChange = 0;
  } else {
    percentCustomerChange =
      ((totalCustomersThisMonth - totalCustomersPrevMonth) / totalCustomersPrevMonth) * 100;
  }
  const percentCustomerText =
    percentCustomerChange >= 0
      ? `↑ ${percentCustomerChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentCustomerChange).toFixed(2)}% so với tháng trước`;

  // Tổng số giờ thuê của tháng đang chọn
  const totalHoursThisMonth = monthlyHours[selectedMonth] ?? 0;
  const totalHoursPrevMonth = monthlyHours[prevMonth] ?? 0;

  let percentHoursChange = 0;
  if (totalHoursPrevMonth === 0 && totalHoursThisMonth > 0) {
    percentHoursChange = 100;
  } else if (totalHoursPrevMonth === 0 && totalHoursThisMonth === 0) {
    percentHoursChange = 0;
  } else {
    percentHoursChange =
      ((totalHoursThisMonth - totalHoursPrevMonth) / totalHoursPrevMonth) * 100;
  }
  const percentHoursText =
    percentHoursChange >= 0
      ? `↑ ${percentHoursChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentHoursChange).toFixed(2)}% so với tháng trước`;

  // Tạo biến orderReview từ monthlyOrders, chỉ lấy đến tháng hiện tại
  const orderReview = Array.from({ length: currentMonth }, (_, i) => ({
    month: monthNames[i],
    order: monthlyOrders[i + 1] ?? 0,
  }));

  // Lấy dữ liệu trạng thái đơn hàng của tháng đang chọn
  const rawStatus = monthlyStatus[selectedMonth] ?? [];
  const statusNames = ["CANCELLED", "COMPLETED", "CONFIRMED", "PICK_UP"];
  const orderStatusData = statusNames.map((name) => {
    const found = rawStatus.find((item) => item.name === name);
    return {
      name,
      value: found ? found.value : 0
    };
  });

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Admin Panel</div>
        <nav className="menu">
          <NavLink to="." end>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to="products">
            <FaBox /> Xe cho thuê
          </NavLink>
          <NavLink to="orders">
            <FaShoppingCart /> Đơn hàng
          </NavLink>
          <NavLink to="users">
            <FaUsers /> Người dùng
          </NavLink>

        </nav>
        <div className="logout">
          <FaSignOutAlt /> Đăng xuất
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Navbar */}
        <header
          className="navbar"
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "end",
            flexDirection: "row-reverse",
          }}
        >
          <select
            style={{ width: 140 }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            <option value="">Chọn tháng</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
            ))}
          </select>
        </header>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="dashboard">
                <h2>Admin Dashboard</h2>
                <p className="subtitle">Tổng quan về hoạt động của hệ thống</p>

                {/* Cards */}
                <div className="cards">
                  <div className="card">
                    <p>Tổng đơn hàng tháng {selectedMonth}</p>
                    <h3>{totalOrdersThisMonth}</h3>
                    <span className={percentChange >= 0 ? "success" : "danger"}>
                      {percentText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng xe được thuê tháng {selectedMonth}</p>
                    <h3>{totalProductsThisMonth}</h3>
                    <span className={percentProductChange >= 0 ? "success" : "danger"}>
                      {percentProductText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng người dùng đã thuê tháng {selectedMonth}</p>
                    <h3>{totalCustomersThisMonth}</h3>
                    <span className={percentCustomerChange >= 0 ? "success" : "danger"}>
                      {percentCustomerText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng số giờ thuê tháng {selectedMonth}</p>
                    <h3>{totalHoursThisMonth}</h3>
                    <span className={percentHoursChange >= 0 ? "success" : "danger"}>
                      {percentHoursText}
                    </span>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts">
                  <div className="chart-box">
                    <h4>Biểu đồ đơn thuê</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={orderReview}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="order"
                          stroke="#8884d8"
                        />
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
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/users" element={<UsersManager />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
