import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Tag, Avatar, Modal, message } from "antd";
import { SearchOutlined, MailOutlined, PhoneOutlined, UserDeleteOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { getAllUser } from "../shared/apis/userBookingApi";
import axiosInstance from "../shared/utils/authorizedAxios";

const UsersManager = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchData = async (params = {}) => {
    setLoading(true);
    const res = await getAllUser({
      page: params.page || currentPage,
      size: params.size || pageSize,
      search: params.search || searchText,
    });
    // Map response: mỗi item có { user, bookingCount }
    setUsers((res.data || []).map((item) => ({ ...item.user, bookingCount: item.bookingCount })));
    setMeta(res.meta || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData({ page: 1, search: searchText });
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await axiosInstance.put(`/user/toggle-status/${userId}`);
      if (response.data.success) {
        message.success(response.data.message);
        fetchData(); // Refresh data
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thay đổi trạng thái tài khoản");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/user/delete/${userId}`);
      if (response.data.success) {
        message.success("Xóa tài khoản thành công");
        fetchData(); // Refresh data
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tài khoản");
    }
  };

  const showToggleConfirm = (user) => {
    const action = user.isActive ? "vô hiệu hóa" : "kích hoạt";
    Modal.confirm({
      title: `Xác nhận ${action} tài khoản`,
      content: `Bạn có chắc chắn muốn ${action} tài khoản của ${user.username}?`,
      onOk: () => toggleUserStatus(user.id, user.isActive),
    });
  };

  const showDeleteConfirm = (user) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản',
      content: `Bạn có chắc chắn muốn xóa tài khoản của ${user.username}? Hành động này không thể hoàn tác.`,
      okType: 'danger',
      onOk: () => deleteUser(user.id),
    });
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "username",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar?.imageUrl || undefined}>{text?.charAt(0)?.toUpperCase()}</Avatar>
          <div>
            <div style={{ fontWeight: "bold" }}>{text}</div>
            <small style={{ color: "#999" }}>ID: {record.id}</small>
          </div>
        </Space>
      ),
    },
    {
      title: "Số lượng đơn đặt hàng",
      dataIndex: "bookingCount",
      align: "center",
      render: (count) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <Space>
          <MailOutlined /> <span style={{ fontWeight: "bold" }}>{email}</span>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      render: (phone) => (
        <Space>
          <PhoneOutlined /> <span style={{ fontWeight: "bold" }}>{phone}</span>
        </Space>
      ),
    },
  // Ẩn loại người dùng
    {
      title: "Ngày tạo tài khoản",
      dataIndex: "createdAt",
      render: (v) => v ? new Date(v).toLocaleDateString() : "--",
    },
  // Có thể bổ sung thêm trường nếu API trả về
  // Có thể bổ sung thêm trường nếu API trả về
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (active) => active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Đã khóa</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type={record.isActive ? "default" : "primary"}
            icon={<UserSwitchOutlined />}
            size="small"
            onClick={() => showToggleConfirm(record)}
          >
            {record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
          </Button>
          <Button
            type="primary"
            danger
            icon={<UserDeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
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
        <div>Tổng: {meta?.totalItems ?? users.length} người dùng</div>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350 }}
            onPressEnter={handleSearch}
          />
          <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
        </Space>
      </div>
      <Table
        loading={loading}
        dataSource={users.map((u) => ({ ...u, key: u.id }))}
        columns={columns}
        pagination={{
          current: meta?.currentPage + 1 || currentPage,
          pageSize: meta?.pageSize || pageSize,
          total: meta?.totalItems,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default UsersManager;
