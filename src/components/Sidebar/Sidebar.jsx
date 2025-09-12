import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Car,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  UserCheck,
  Menu,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const menuItems = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      key: "vehicles",
      label: "Vehicle Management",
      icon: Car,
      submenu: [
        { label: "My Cars", path: "/my-cars" },
        { label: "Add New Car", path: "/add-car" },
        { label: "Xe đang chờ duyệt", path: "/my-cars-active" }, //lấy ra xe đang chờ duyệt thuê
        { label: "Xe không hoạt động", path: "/my-cars-not-active" }, //lấy ra xe đã hoàn thành và đang chờ nhà xe kiểm tra
      ],
    },
    {
      key: "bookings",
      label: "Booking Management",
      icon: Calendar,
      submenu: [
        { label: "Tất cả đơn hàng", path: "/bookings/order" },
        { label: "Phân tích", path: "/bookings/analysis" },
      ],
    },
    {
      key: "customers",
      label: "Customer Management",
      icon: Users,
      submenu: [
        { label: "All Customers", path: "/user-booking" },
        { label: "Khách đang thuê", path: "/customers/vip" },
        { label: "Customer Reviews", path: "/customers/feedback" },
      ],
    },
    {
      key: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      submenu: [
        { label: "Revenue", path: "/reports/revenue", icon: DollarSign },
        { label: "Vehicle Stats", path: "/reports/vehicles", icon: Car },
        { label: "Customers", path: "/reports/customers", icon: UserCheck },
        { label: "Trends", path: "/reports/trends", icon: TrendingUp },
      ],
    },
    {
      key: "payments",
      label: "Payment Management",
      icon: CreditCard,
      submenu: [
        { label: "Transactions", path: "/payments/transactions" },
        { label: "Invoices", path: "/payments/invoices" },
        { label: "Refunds", path: "/payments/refunds" },
      ],
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      submenu: [
        { label: "General Settings", path: "/settings/general" },
        { label: "Pricing", path: "/settings/pricing" },
        { label: "Permissions", path: "/settings/permissions" },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
      >
        {/* Logo and Header */}
        <div className={styles.sidebarHeader}>
          <div className="d-flex align-items-center">
            <Car className="me-2" size={32} />
            <span className="fw-bold fs-5">RentCar Pro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-link text-white p-1"
            style={{ textDecoration: "none" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <div key={item.key} className="mb-2">
              {item.submenu ? (
                <div
                  className={`${styles.menuItem} ${
                    item.path === location.pathname ? styles.menuItemActive : ""
                  }`}
                  onClick={() => toggleSubmenu(item.key)}
                >
                  <div className="d-flex align-items-center">
                    <item.icon className="me-3" size={20} />
                    <span className="fw-medium">{item.label}</span>
                  </div>
                  {expandedMenus[item.key] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`${styles.menuItem} ${
                    item.path === location.pathname ? styles.menuItemActive : ""
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="d-flex align-items-center">
                    <item.icon className="me-3" size={20} />
                    <span className="fw-medium">{item.label}</span>
                  </div>
                </Link>
              )}
              {/* Render submenu nếu có */}
              {item.submenu && expandedMenus[item.key] && (
                <div className={styles.submenu}>
                  {item.submenu.map((subitem, index) => (
                    <Link
                      key={index}
                      to={subitem.path}
                      className={`${styles.submenuItem} ${
                        subitem.path === location.pathname
                          ? styles.submenuItemActive
                          : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {subitem.icon && (
                        <subitem.icon className="me-3" size={16} />
                      )}
                      <span>{subitem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
