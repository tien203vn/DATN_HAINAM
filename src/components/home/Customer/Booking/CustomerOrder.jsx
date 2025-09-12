import React, { useEffect, useState } from "react";
import { Table, Tag, Image, Space } from "antd";
import { getOwnerBookingListApi } from "../../../../shared/apis/ownerBookingApi";
import { LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomerOrders = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getOwnerBookingListApi()
      .then((res) => {
        setBookings(res.data || []);
        setMeta(res.meta || {});
      })
      .catch(() => {
        setError("Không thể tải dữ liệu booking!");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Tên xe",
      dataIndex: "carName",
      key: "carName",
    },
    {
      title: "Số giờ",
      dataIndex: "numberOfHour",
      key: "numberOfHour",
    },
    {
      title: "Giá cơ bản",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (v) => v?.toLocaleString("vi-VN", { minimumFractionDigits: 2 }) + " đ",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (v) => v?.toLocaleString("vi-VN", { minimumFractionDigits: 2 }) + " đ",
    },
    {
      title: "Đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      render: (v) => v?.toLocaleString("vi-VN", { minimumFractionDigits: 2 }) + " đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => {
        let color = "blue";
        if (status === "PENDING_DEPOSIT") color = "orange";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startDateTime",
      key: "startDateTime",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endDateTime",
      key: "endDateTime",
    },
    {
      title: "Ảnh xe",
      dataIndex: "images",
      key: "images",
      render: (imgs) => (
        <Space>
          {imgs?.slice(0, 2).map((img, idx) => (
            <Image key={idx} src={img} width={60} height={40} alt="car" />
          ))}
        </Space>
      ),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <EyeOutlined
          style={{ fontSize: 22, cursor: "pointer" }}
          onClick={() => navigate(`/owner-booking/${record.bookingId}`)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Quản lý booking</h2>
      <p style={{ color: "#888" }}>Quản lý và theo dõi trạng thái các booking của bạn</p>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <LoadingOutlined style={{ fontSize: 32 }} spin /> Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <b>Tổng booking:</b> {meta?.totalItems ?? bookings.length}
            {meta?.totalPages && (
              <span style={{ marginLeft: 16 }}>
                <b>Trang:</b> {meta?.currentPage + 1} / {meta?.totalPages}
              </span>
            )}
          </div>
          <Table
            dataSource={bookings.map((b) => ({ ...b, key: b.bookingId }))}
            columns={columns}
            pagination={{ pageSize: meta?.pageSize || 5 }}
            scroll={{ x: true }}
          />
          {/* Modal chi tiết booking đã được thay bằng chuyển trang */}
        </>
      )}
    </div>
  );
};

export default CustomerOrders;
