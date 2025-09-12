import { Tag, Image, Space } from "antd";
import { currencyFormat } from "../../../../shared/utils";

export default function CarBookingDetailsView({ booking }) {
	if (!booking) return null;
	return (
		<div style={{ padding: 16 }}>
			<h3 style={{ marginBottom: 16 }}>Thông tin booking</h3>
			<Space direction="horizontal" size={32}>
				<Image.PreviewGroup>
					{booking.images?.map((img, idx) => (
						<Image key={idx} src={img} width={120} height={80} alt="car" />
					))}
				</Image.PreviewGroup>
				<div>
					<div><b>Tên xe:</b> {booking.carName}</div>
					<div><b>ID booking:</b> {booking.bookingId}</div>
					<div><b>Số giờ thuê:</b> {booking.numberOfHour}h</div>
					<div><b>Giá cơ bản:</b> {currencyFormat(booking.basePrice, "VND", false)}</div>
					<div><b>Tổng tiền:</b> {currencyFormat(booking.total, "VND", false)}</div>
					<div><b>Đặt cọc:</b> {currencyFormat(booking.deposit, "VND", false)}</div>
					<div><b>Thời gian bắt đầu:</b> {booking.startDateTime}</div>
					<div><b>Thời gian kết thúc:</b> {booking.endDateTime}</div>
					<div><b>Trạng thái:</b> <Tag color="blue">{booking.bookingStatus}</Tag></div>
				</div>
			</Space>
		</div>
	);
}
