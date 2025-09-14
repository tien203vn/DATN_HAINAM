import React, { useState, useEffect } from "react";
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
import axiosInstance from "../../../../shared/utils/authorizedAxios";

import "../../../../styles/admin.css";

function Revenue() {
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
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState({});
  const [monthlyProducts, setMonthlyProducts] = useState({});
  const [monthlyCustomers, setMonthlyCustomers] = useState({});
  const [monthlyHours, setMonthlyHours] = useState({});
  const [monthlyStatus, setMonthlyStatus] = useState({});
  const [monthlyTopRevenueCars, setMonthlyTopRevenueCars] = useState({});
  const [topRentedCars, setTopRentedCars] = useState([]);

  useEffect(() => {
    axiosInstance.get("booking/monthly-revenue-summary").then((res) => {
      setMonthlyOrders(res.data?.data || {});
    });
    axiosInstance.get("booking/monthly-repair-cost-summary").then((res) => {
      setMonthlyProducts(res.data?.data || {});
    });
    axiosInstance.get("booking/monthly-late-fee-summary").then((res) => {
      setMonthlyCustomers(res.data?.data || {});
    });
    axiosInstance.get("booking/monthly-hours-summary").then((res) => {
      setMonthlyHours(res.data?.data || {});
    });
    axiosInstance.get("booking/monthly-top-revenue-cars").then((res) => {
      setMonthlyTopRevenueCars(res.data?.data || {});
    });
    axiosInstance.get("booking/monthly-top-rented-cars").then((res) => {
      setTopRentedCars(res.data?.data || []);
    });
  }, []);

  // Tổng đơn hàng của tháng đang chọn
  let totalOrdersThisMonth = monthlyOrders[selectedMonth] ?? 0 ;
  if(totalOrdersThisMonth){
    totalOrdersThisMonth *= 1000000;
  }
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
  let totalProductsThisMonth = monthlyProducts[selectedMonth] ?? 0;
  if(totalProductsThisMonth){
    totalProductsThisMonth *= 1000000;
  }
  // Tổng sản phẩm tháng trước
  const totalProductsPrevMonth = monthlyProducts[prevMonth] ?? 0;

  // Tính phần trăm tăng/giảm sản phẩm cho thuê
  let percentProductChange = 0;
  if (totalProductsPrevMonth === 0 && totalProductsThisMonth > 0) {
    percentProductChange = 100;
  } else if (totalProductsPrevMonth === 0 && totalProductsThisMonth === 0) {
    percentProductChange = 0;
  } else {
    percentProductChange =
      ((totalProductsThisMonth - totalProductsPrevMonth) /
        totalProductsPrevMonth) *
      100;
  }
  const percentProductText =
    percentProductChange >= 0
      ? `↑ ${percentProductChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentProductChange).toFixed(2)}% so với tháng trước`;

  // Tổng người dùng đã thuê của tháng đang chọn
  const totalCustomersThisMonth = (monthlyCustomers[selectedMonth] ?? 0)* 1000000;
  // Tổng người dùng tháng trước
  const totalCustomersPrevMonth = monthlyCustomers[prevMonth] ?? 0;

  // Tính phần trăm tăng/giảm người dùng đã thuê
  let percentCustomerChange = 0;
  if (totalCustomersPrevMonth === 0 && totalCustomersThisMonth > 0) {
    percentCustomerChange = 100;
  } else if (totalCustomersPrevMonth === 0 && totalCustomersThisMonth === 0) {
    percentCustomerChange = 0;
  } else {
    percentCustomerChange =
      ((totalCustomersThisMonth - totalCustomersPrevMonth) /
        totalCustomersPrevMonth) *
      100;
  }
  const percentCustomerText =
    percentCustomerChange >= 0
      ? `↑ ${percentCustomerChange.toFixed(2)}% so với tháng trước`
      : `↓ ${Math.abs(percentCustomerChange).toFixed(2)}% so với tháng trước`;

  // Tổng số giờ thuê của tháng đang chọn
  const totalHoursThisMonth = monthlyHours[selectedMonth] ?? 0;
  // Tổng số giờ thuê tháng trước
  const totalHoursPrevMonth = monthlyHours[prevMonth] ?? 0;

  // Tính phần trăm tăng/giảm số giờ thuê
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
    revenue: monthlyOrders[i + 1] ?? 0,
  }));

  // Lấy dữ liệu trạng thái đơn hàng của tháng đang chọn
  // Đảm bảo rawStatus luôn là mảng
  const rawStatus = Array.isArray(monthlyStatus[selectedMonth]) ? monthlyStatus[selectedMonth] : [];
  const statusNames = ["CANCELLED", "COMPLETED", "CONFIRMED", "PICK_UP"];
  const orderStatusData = statusNames.map((name) => {
    const found = rawStatus.find((item) => item.name === name);
    return {
      name,
      value: found ? found.value : 0,
    };
  });

  // Chuẩn hóa dữ liệu cho PieChart top doanh thu xe theo tháng đang chọn
  const topRevenuePieData = Array.isArray(monthlyTopRevenueCars[selectedMonth])
    ? monthlyTopRevenueCars[selectedMonth].length > 0
      ? monthlyTopRevenueCars[selectedMonth].map((car) => ({
          name: car.carName,
          value: car.totalRevenue
        }))
      : [{ name: "Không có dữ liệu", value: 1 }]
    : [{ name: "Không có dữ liệu", value: 1 }];

  // Đảm bảo PieChart luôn có dữ liệu (nếu không có thì hiển thị dummy)
  const pieDataToShow = topRevenuePieData.length > 0
    ? topRevenuePieData
    : [{ name: "Không có dữ liệu", value: 1 }];

  // Chuẩn hóa dữ liệu cho PieChart top 10 xe thuê nhiều nhất
  const topRentedPieData = Array.isArray(topRentedCars)
    ? topRentedCars.map((car) => ({
        name: car.carName,
        value: car.rentalCount
      }))
    : [];

  // Tạo mảng màu động cho tối đa 10 xe
  const dynamicColors = [
    "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666",
    "#66CCFF", "#FFB6C1", "#A0522D", "#8A2BE2", "#228B22"
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}

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
                <h2>Dashboard</h2>
                <p className="subtitle">Tổng quan về hoạt động của cửa hàng</p>

                {/* Cards */}
                <div className="cards">
                  <div className="card">
                    <p>Tổng doanh thu </p>
                    <h3>{totalOrdersThisMonth}</h3>
                    <span className={percentChange >= 0 ? "success" : "danger"}>
                      {percentText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng số tiền phải sửa chữa </p>
                    <h3>{totalProductsThisMonth}</h3>
                    <span
                      className={
                        percentProductChange >= 0 ? "success" : "danger"
                      }
                    >
                      {percentProductText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng số tiền xe trả muộn </p>
                    <h3>{totalCustomersThisMonth}</h3>
                    <span
                      className={
                        percentCustomerChange >= 0 ? "success" : "danger"
                      }
                    >
                      {percentCustomerText}
                    </span>
                  </div>
                </div>

                {/* Bảng doanh thu từng tháng */}
                {/* <div className="mb-4">
                  <h4>Doanh thu từng tháng</h4>
                  <table className="table table-bordered" style={{ maxWidth: 400 }}>
                    <thead>
                      <tr>
                        <th>Tháng</th>
                        <th>Doanh thu (₫)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.month}</td>
                          <td>{item.revenue.toLocaleString("vi-VN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}

                {/* Charts */}
                <div className="charts">
                  <div className="chart-box">
                    <h4>Biểu đồ doanh thu</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={orderReview}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <button className="report-btn">Xuất báo cáo</button>
                  </div>

                  <div className="chart-box">
                    <h4>Top 10 doanh thu xe</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={topRevenuePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {topRevenuePieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={dynamicColors[index] || "#ccc"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="charts mt-3">

                  <div className="chart-box">
                    <h4>Top 10 xe thuê</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={topRentedPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                         {topRentedPieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={dynamicColors[index]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-box">
                    <h4>Top 10 </h4>
                    <ResponsiveContainer width="100%" height={400}>
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
                              fill={dynamicColors[index]}
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

export default Revenue;
