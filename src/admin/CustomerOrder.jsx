import React, { useEffect, useState } from "react";
import { Table, Tag, Image, Space, Input, Select, DatePicker, Button, Row, Col } from "antd";
import { getOwnerBookingListApi } from "../shared/apis/ownerBookingApi";
import { LoadingOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "CONFIRMED", label: "Chờ xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "PICK_UP", label: "Đã lấy xe" },
];

const CustomerOrders = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Thêm state quản lý trang
  const [carName, setCarName] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [filters, setFilters] = useState({
    carName: "",
    bookingStatus: "",
    startDateTime: null,
    endDateTime: null,
  });
  const navigate = useNavigate();

  const fetchBookings = (page = 0, f = filters) => {
    setLoading(true);
    getOwnerBookingListApi({
      currentPage: page,
      carName: f.carName,
      bookingStatus: f.bookingStatus,
      startDateTime: f.startDateTime
        ? dayjs(f.startDateTime).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      endDateTime: f.endDateTime
        ? dayjs(f.endDateTime).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
    })
      .then((res) => {
        setBookings(res.data || []);
        setMeta(res.meta || {});
      })
      .catch(() => {
        setError("Không thể tải dữ liệu booking!");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings(currentPage, filters);
    // eslint-disable-next-line
  }, [currentPage, filters]);

  const handleSearch = () => {
    setCurrentPage(0);
    setFilters({
      carName,
      bookingStatus,
      startDateTime: dateRange[0],
      endDateTime: dateRange[1],
    });
  };

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
      {/* Bộ lọc tìm kiếm */}
      <div style={{ marginBottom: 16, background: "#f7f7f7", padding: 12, borderRadius: 8 }}>
        <Row gutter={16}>
          <Col>
            <Input
              placeholder="Tên xe"
              value={carName}
              onChange={e => setCarName(e.target.value)}
              style={{ width: 180 }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder="Trạng thái"
              value={bookingStatus}
              onChange={v => setBookingStatus(v)}
              style={{ width: 150 }}
              options={statusOptions}
              allowClear
            />
          </Col>
          <Col>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              value={dateRange}
              onChange={dates => setDateRange(dates)}
              style={{ width: 280 }}
              placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={handleSearch}>Tìm kiếm</Button>
          </Col>
        </Row>
      </div>
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
            pagination={{
              pageSize: meta?.pageSize || 5,
              current: currentPage + 1,
              total: meta?.totalItems,
              onChange: (page) => setCurrentPage(page - 1),
            }}
            scroll={{ x: true }}
          />
        </>
      )}
    </div>
  );
};

export default CustomerOrders;