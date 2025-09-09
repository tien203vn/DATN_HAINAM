import React, { useState } from "react";
import { Table, Button, Input, Space, Tag, Image } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Categories = () => {
  const [searchText, setSearchText] = useState("");

  // Fake data danh mục
  const dataSource = [
    {
      key: "1",
      image: "https://via.placeholder.com/50x50.png?text=Laptop",
      name: "Laptop",
      desc: "Các sản phẩm máy tính xách tay",
      date: "24/3/2025",
    },
    {
      key: "2",
      image: "https://via.placeholder.com/50x50.png?text=Tablet",
      name: "Máy tính bảng",
      desc: "Các sản phẩm máy tính bảng",
      date: "24/3/2025",
    },
    {
      key: "3",
      image: "https://via.placeholder.com/50x50.png?text=Phụ+kiện",
      name: "Phụ kiện",
      desc: "Các sản phẩm phụ kiện điện tử",
      date: "24/3/2025",
    },
    {
      key: "4",
      image: "https://via.placeholder.com/50x50.png?text=Watch",
      name: "Thiết bị đeo",
      desc: "Đồng hồ thông minh, vòng đeo tay",
      date: "24/3/2025",
    },
    {
      key: "5",
      image: "https://via.placeholder.com/50x50.png?text=TV",
      name: "Ti vi",
      desc: "Không có mô tả",
      date: "23/4/2025",
    },
  ];

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
    },
    {
      title: "HÌNH ẢNH",
      dataIndex: "image",
      render: (img) => <Image width={50} src="../../../public/lon.png" />,
    },
    {
      title: "TÊN DANH MỤC",
      dataIndex: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "MÔ TẢ",
      dataIndex: "desc",
    },
    {
      title: "NGÀY TẠO",
      dataIndex: "date",
    },
    {
      title: "THAO TÁC",
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} style={{ color: "blue" }}>
            Sửa
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            style={{ color: "red" }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style ={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý danh mục</h2>
      <p style={{ color: "#888" }}>
        Quản lý các danh mục sản phẩm trong hệ thống
      </p>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Tổng: {dataSource.length} danh mục</div>

        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm danh mục
          </Button>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          <Input
            placeholder="Tìm kiếm theo tên danh mục, mô tả..."
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

export default Categories;
