import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Tag, Avatar } from "antd";
import { PlusOutlined, SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../shared/utils/authorizedAxios";
import { MULTIPLIED_AMOUNT } from "../../shared/constants";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('search') || "");
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('currentPage')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const navigate = useNavigate();

  const updateUrlParams = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    
    setSearchParams(newSearchParams);
  };

  const fetchCars = async (params = {}) => {
    setLoading(true);
    try {
      const actualPage = params.currentPage || currentPage;
      const actualSize = params.size || pageSize;
      const actualSearch = params.search !== undefined ? params.search : searchText;
      
      const apiPageParam = actualPage - 1; // Convert to 0-based indexing for API
      
      console.log('Calling API with params:', { 
        currentPage: actualPage, 
        size: actualSize, 
        search: actualSearch,
        apiPageParam: apiPageParam  // This is what actually gets sent to API
      });
      
      const response = await axiosInstance.get("/car/list-car", {
        params: {
          currentPage: apiPageParam, // Use the converted value
          size: actualSize,
          search: actualSearch,
        }
      });
      setCars(response.data.data || []);
      setMeta(response.data.meta || {});
      
      // Update URL params
      updateUrlParams({
        currentPage: actualPage,
        size: actualSize,
        search: actualSearch || undefined,
      });
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []); // Remove dependencies to prevent infinite loop

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCars({ currentPage: 1, search: searchText });
  };

  const handleViewDetail = (carId) => {
    navigate(`/my-cars/${carId}`);
  };

  const columns = [
    {
      title: "",
      dataIndex: "images",
      render: (images) => (
        <Avatar 
          src={images?.[0]?.imageUrl} 
          size={50}
          shape="square"
        >
          {images?.[0] ? "" : "No Image"}
        </Avatar>
      ),
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{text}</div>
          <small style={{ color: "#999" }}>ID: {record.id}</small>
        </div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
    },
    {
      title: "Giá thuê/ngày",
      dataIndex: "basePrice",
      render: (price) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
          {(price * MULTIPLIED_AMOUNT).toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.isActive ? (
            <Tag color="green">Hoạt động</Tag>
          ) : (
            <Tag color="red">Ngừng hoạt động</Tag>
          )}
          {record.isAvailable ? (
            <Tag color="blue">Có sẵn</Tag>
          ) : (
            <Tag color="orange">Đang thuê</Tag>
          )}
          {record.isStopped && <Tag color="volcano">Tạm dừng</Tag>}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
            title="Xem chi tiết"
          />
          <Button type="default" icon={<EditOutlined />} title="Chỉnh sửa" />
          <Button type="primary" danger icon={<DeleteOutlined />} title="Xóa" />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý xe cho thuê</h2>
      <p style={{ color: "#888" }}>
        Quản lý danh sách xe cho thuê trong hệ thống
      </p>

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <div>Tổng: {meta?.totalItems || 0} xe</div>

        <Space>
          <Button icon={<FilterOutlined />}>Bộ lọc</Button>
          <Input
            placeholder="Tìm kiếm theo tên xe, thương hiệu..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Space>
      </div>

      <Table 
        dataSource={cars.map(car => ({ ...car, key: car.id }))} 
        columns={columns} 
        loading={loading}
        pagination={{
          current: currentPage, // Use currentPage state directly
          pageSize: pageSize,   // Use pageSize state directly
          total: meta?.totalItems,
          onChange: (page, size) => {
            console.log('Pagination onChange:', { page, size });
            setCurrentPage(page);
            setPageSize(size);
            // Call fetchCars immediately with new values
            fetchCars({ currentPage: page, size, search: searchText });
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} xe`,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Products;
