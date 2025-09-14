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

// Dữ liệu fix cứng cho chart
const orderStatusData = [
  { name: "Hoàn thành", value: 7 },
  { name: "Đang xử lý", value: 2 },
  { name: "Đã hủy", value: 1 },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

function Analysis() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState({});

  useEffect(() => {
    axiosInstance.get("user/revenue").then((res) => {
      // res.data = [{month: 1, revenue: 1000}, ...]
      const data = res.data || [];
      setRevenueData(
        data.map((item) => ({
          month: `Tháng ${item.month}`,
          revenue: item.revenue,
        }))
      );
      setTotalRevenue(data.reduce((sum, item) => sum + item.revenue, 0));
    });
    axiosInstance.get("booking/monthly-summary").then((res) => {
      setMonthlyOrders(res.data?.data || {});
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
                    <p>Tổng đơn hàng tháng {selectedMonth}</p>
                    <h3>{totalOrdersThisMonth}</h3>
                    <span className={percentChange >= 0 ? "success" : "danger"}>
                      {percentText}
                    </span>
                  </div>
                  <div className="card">
                    <p>Tổng sản phẩm được cho thuê</p>
                    <h3>24</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                  <div className="card">
                    <p>Tổng người dùng đã thuê</p>
                    <h3>3</h3>
                    <span className="success">↑ 0% so với tháng trước</span>
                  </div>
                  <div className="card">
                    <p>Tổng đơn hàng tháng {selectedMonth}</p>
                    <h3>{totalOrdersThisMonth}</h3>
                    <span className="success">Đơn hàng tháng này</span>
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
                    <h4>Biểu đồ đơn thuê</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
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

export default Analysis;
