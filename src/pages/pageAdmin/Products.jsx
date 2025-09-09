import React, { useState } from "react";
import { Table, Button, Input, Space, Tag } from "antd";
import { PlusOutlined, SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Products = () => {
  const [searchText, setSearchText] = useState("");

  // Fake dữ liệu demo
  const dataSource = [
    {
      key: "1",
      name: "máy tính",
      price: "100.000 đ",
      category: "Phụ kiện",
      stock: 5,
      sold: 0,
      date: "22/05/2025",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    },
    {
      key: "2",
      name: "điều hòa không khí",
      price: "1.000.000 đ",
      category: "Điều hòa",
      stock: 5,
      sold: 0,
      date: "22/05/2025",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },
    {
      key: "3",
      name: "iPhone 14 Pro Max",
      price: "320.000 đ",
      category: "Điện thoại",
      stock: 1,
      sold: 0,
      date: "23/04/2025",
      image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    },
  ];

  const columns = [
    {
      title: "",
      dataIndex: "image",
      render: (img) => <img src={img} alt="product" width={40} />,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Tồn kho",
      render: (_, record) => (
        <div>
          <Tag color="gold">{record.stock} sản phẩm</Tag>
          <div>Đã bán: {record.sold}</div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
    },
    {
      title: "Thao tác",
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} />
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style ={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý sản phẩm</h2>
      <p style={{ color: "#888" }}>Quản lý danh sách sản phẩm trong cửa hàng</p>

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>

        <Space>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary">Tìm kiếm</Button>
        </Space>
      </div>

      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default Products;
