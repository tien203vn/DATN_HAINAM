import React, { useState } from "react";
import { Table, Button, Input, Space, Tag, Avatar } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const Users = () => {
  const [searchText, setSearchText] = useState("");

  // Fake data người dùng
  const dataSource = [
    {
      key: "1",
      name: "adminsgs",
      email: "adminsgs@gmail.com",
      phone: "0937678234",
      role: "Quản trị viên",
      date: "06/09/2025",
      lastLogin: "Chưa đăng nhập",
      orders: "0 đơn",
      status: "Hoạt động",
    },
    {
      key: "2",
      name: "huy",
      email: "huy@gmail.com",
      phone: "0961381346",
      role: "Khách hàng",
      date: "22/05/2025",
      lastLogin: "Chưa đăng nhập",
      orders: "0 đơn",
      status: "Hoạt động",
    },
    {
      key: "3",
      name: "ngongochuy208",
      email: "ngongochuy208@gmail.com",
      phone: "0961381346",
      role: "Quản trị viên",
      date: "21/05/2025",
      lastLogin: "Chưa đăng nhập",
      orders: "0 đơn",
      status: "Hoạt động",
    },
  ];

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      render: (text) => (
        <Space>
          <Avatar>{text.charAt(0).toUpperCase()}</Avatar>
          <div>
            <div>{text}</div>
            <small style={{ color: "#999" }}>ID: 200{Math.floor(Math.random() * 10)}</small>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <Space>
          <MailOutlined /> {email}
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "phone",
      render: (phone) => (
        <Space>
          <PhoneOutlined /> {phone}
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) =>
        role === "Quản trị viên" ? (
          <Tag color="red">{role}</Tag>
        ) : (
          <Tag color="green">{role}</Tag>
        ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "date",
    },
    {
      title: "Lần cuối đăng nhập",
      dataIndex: "lastLogin",
    },
    {
      title: "Đơn hàng",
      dataIndex: "orders",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === "Hoạt động" ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="red">{status}</Tag>
        ),
    },
    {
      title: "Thao tác",
      render: () => (
        <Space>
          <Button type="link" danger>
            Khóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style ={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý người dùng</h2>
      <p style={{ color: "#888" }}>
        Quản lý danh sách các tài khoản người dùng
      </p>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Tổng: {dataSource.length} người dùng</div>

        <Space>
          <Button type="primary">+ Thêm người dùng</Button>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350 }}
          />
          <Button type="primary">Tìm kiếm</Button>
        </Space>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Users;
