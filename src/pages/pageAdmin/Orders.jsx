import React, { useState } from "react";
import { Table, Button, Input, Space, Tag } from "antd";
import { SearchOutlined, FilterOutlined, EyeOutlined } from "@ant-design/icons";

const Orders = () => {
  const [searchText, setSearchText] = useState("");

  // Fake data đơn hàng
  const dataSource = [
    {
      key: "1",
      orderCode: "SGS202507150155562003",
      customer: "ngongochuy208@gmail.com\n0961381346",
      date: "15/07/2025",
      paymentMethod: "CARD",
      paymentStatus: "Chưa thanh toán",
      total: "17.990.000 đ",
      status: "Pending",
    },
    {
      key: "2",
      orderCode: "SGS202507150145402003",
      customer: "huy@gmail.com\n0912345678",
      date: "22/07/2025",
      paymentMethod: "CARD",
      paymentStatus: "Đã thanh toán",
      total: "4.990.000 đ",
      status: "Processing",
    },
  ];

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      render: (status) =>
        status === "Đã thanh toán" ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="gold">{status}</Tag>
        ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      render: () => (
        <Button type="link" icon={<EyeOutlined />}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style ={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý đơn hàng</h2>
      <p style={{ color: "#888" }}>
        Quản lý và theo dõi trạng thái đơn hàng
      </p>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Tổng: {dataSource.length} đơn hàng</div>

        <Space>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          <Input
            placeholder="Tìm kiếm theo mã đơn, khách hàng, email, số điện thoại..."
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

export default Orders;
