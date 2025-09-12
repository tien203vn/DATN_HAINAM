import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CarBookingDetails from "../../../../pages/CarBookingDetails";
import { Button } from "antd";
import { getOwnerBookingListApi } from "../../../../shared/apis/ownerBookingApi";

export default function OwnerBookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  // Không cần fetch booking ở đây, CarBookingDetails sẽ tự fetch theo bookingId

  return (
    <div className="container">
      <div>
        <div style={{ marginTop: 24}}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Quay về danh sách booking
          </Button>
        </div>
        <h2 style={{ fontWeight: "bold", marginBottom: 24, marginTop: 24, marginLeft: 10 }}>
          Chi tiết booking #{bookingId}
        </h2>
      </div>

      <CarBookingDetails />
    </div>
  );
}
