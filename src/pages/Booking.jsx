import BreadCrumb from "../components/BreadCrumb";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import StarRating from "../components/StarRating";
import { convertToLocalDateTime, currencyFormat, formatDate } from "../shared/utils";
import ImageSlider from "../components/carousels/ImageSlider";
import StepsV2 from "../components/booking/StepsV2";
import { useState, useEffect } from "react";
import BookingStep1 from "../components/booking/BookingStep1";
import BookingStep2 from "../components/booking/BookingStep2";
import BookingStep3 from "../components/booking/BookingStep3";
import { getCarsById } from "../shared/apis/carApi";
import RequestError from "./error/RequestError";
import { addBookingApi } from "../shared/apis/bookingApi";
import { MULTIPLIED_AMOUNT } from '../shared/constants'
import { DatePicker, TimePicker, InputNumber, message } from "antd";
import dayjs from "dayjs";

export default function Booking() {

    const bookingSteps = ['Booking Information', 'Payment', 'Finish']

    const [searchParams] = useSearchParams()
    const [currentStep, setCurrentStep] = useState(1)
    const [bookingData, setBookingData] = useState({})
    const [bookingResData, setBookingResData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [car, setCar] = useState(null)
    const navigate = useNavigate()

    const requiredParams = ['carId', 'location', 'sD', 'sT', 'eD', 'eT']
    const missingParams = requiredParams.filter(param => !searchParams.get(param))

    useEffect(() => {
        if(missingParams.length === 0) {
            setLoading(true)
            getCarsById(searchParams.get('carId')).then(data => {
                setCar(data.data)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [searchParams])

    if (missingParams.length > 0) return <RequestError />

    const nextStep = (data) => {
        if(currentStep === 1) {
            setBookingData(data)
            setCurrentStep(2)
        }

        if(currentStep === 2) {
            setLoading(true)
            const carId = searchParams.get('carId')

            // Lấy thời gian từ input người dùng chọn
            const startDateTime = startDate.hour(startTime.hour()).minute(startTime.minute()).format("YYYY-MM-DD HH:mm");
            const endDateTime = endDate.hour(endTime.hour()).minute(endTime.minute()).format("YYYY-MM-DD HH:mm");

            // Tính số giờ thuê và tổng tiền
            const diffMs = endDate.hour(endTime.hour()).minute(endTime.minute()).diff(startDate.hour(startTime.hour()).minute(startTime.minute()), "minute");
            const numberOfHour = diffMs > 0 ? diffMs / 60 : 0;
            const total = (car?.basePrice ?? 0) * (numberOfHour / 24);

            const submitData = {
                carId,
                startDateTime,
                endDateTime,
                numberOfHour,
                total,
                ...bookingData,
                ...data
            }

            addBookingApi(submitData).then(data => {
                setBookingResData(data.data)
                setCurrentStep(3)
            }).catch(err => {
                console.log(err)
                setCurrentStep(1)
            }).finally(() => {
                setLoading(false)
            })
        }
    }

    const handleCancel = () => {
        navigate('/')
    }

    // State cho ngày/giờ thuê
    const [startDate, setStartDate] = useState(dayjs());
    const [startTime, setStartTime] = useState(dayjs().hour(8).minute(0));
    const [endDate, setEndDate] = useState(dayjs().add(1, "day"));
    const [endTime, setEndTime] = useState(dayjs().hour(8).minute(0));

    // Khai báo maxDays trước khi dùng
    const maxDays = 7;

    // Đúng: kết hợp ngày và giờ bằng .set
    const selectedStart = startDate
        .set('hour', startTime.hour())
        .set('minute', startTime.minute())
        .set('second', 0)
        .set('millisecond', 0);

    const selectedEnd = endDate
        .set('hour', endTime.hour())
        .set('minute', endTime.minute())
        .set('second', 0)
        .set('millisecond', 0);

    const diffMs = selectedEnd.diff(selectedStart, "minute");
    const hoursDiff = diffMs > 0 ? diffMs / 60 : 0;

    // Tính tổng tiền và đặt cọc
    const total = (car?.basePrice ?? 0) * (hoursDiff )/24;
    const deposit = car?.deposit;

    // Giới hạn ngày bắt đầu: chỉ được chọn hôm nay hoặc ngày hôm sau
    const disabledStartDate = (d) => {
        const today = dayjs().startOf("day");
        const tomorrow = today.add(1, "day");
        return d < today || d > tomorrow;
    };

    // Giới hạn ngày kết thúc: chỉ được chọn trong vòng 7 ngày kể từ ngày bắt đầu
    const disabledEndDate = (d) => {
        const minEnd = startDate;
        const maxEnd = startDate.add(maxDays, "day");
        return d < minEnd || d > maxEnd;
    };

    // Reset endDate nếu vượt quá 7 ngày
    useEffect(() => {
        const maxEnd = startDate.add(maxDays, "day");
        if (endDate.isAfter(maxEnd)) {
            setEndDate(maxEnd);
            setEndTime(startTime);
        }
    }, [startDate, endDate, startTime]);

    // Validation thời gian
    const isTimeValid = () => {
        const now = dayjs();
        
        // Kiểm tra thời gian bắt đầu không được nhỏ hơn thời gian hiện tại
        if (selectedStart.isBefore(now)) {
            return false;
        }
        
        // Kiểm tra thời gian kết thúc phải lớn hơn thời gian bắt đầu
        if (selectedEnd.isBefore(selectedStart) || selectedEnd.isSame(selectedStart)) {
            return false;
        }
        
        return true;
    };

    return (
        <>
            <BreadCrumb links={[
                {
                    path: '/',
                    name: 'Home'
                },
                {
                    name: 'Book Car'
                }
            ]}/>

            {(currentStep == 1 || currentStep == 2) && 
                <div className="rent-car-booking-detail bg-rt-primary text-white">
                    <div className="container py-3">
                        <div className="d-flex align-items-center">
                            <h5>Booking Details</h5>
                            <Link to="/search" className="d-flex align-items-center ms-auto text-white">
                                <FiEdit className="fs-4 me-1"/>
                                Change details
                            </Link>
                        </div>
                        <ul className="text-white fs-5.5 fw-semibold lh-lg">
                            <li>
                                Pick-up date and time:
                                <DatePicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    style={{ marginLeft: 8, marginRight: 8 }}
                                    disabledDate={disabledStartDate}
                                />
                                <TimePicker
                                    value={startTime}
                                    onChange={setStartTime}
                                    format="HH:mm"
                                    minuteStep={15}
                                    style={{ marginRight: 8 }}
                                />
                            </li>
                            <li>
                                Return date and time:
                                <DatePicker
                                    value={endDate}
                                    onChange={setEndDate}
                                    style={{ marginLeft: 8, marginRight: 8 }}
                                    disabledDate={disabledEndDate}
                                />
                                <TimePicker
                                    value={endTime}
                                    onChange={setEndTime}
                                    format="HH:mm"
                                    minuteStep={15}
                                    style={{ marginRight: 8 }}
                                />
                            </li>
                        </ul>
                        {!isTimeValid() && (
                            <div className="alert alert-warning" role="alert">
                                <strong>⚠️ Lưu ý:</strong> Thời gian thuê xe không hợp lệ. 
                                Thời gian bắt đầu phải lớn hơn thời gian hiện tại và thời gian kết thúc phải sau thời gian bắt đầu.
                            </div>
                        )}
                    </div>
                </div>
            }

            <div className="container">
                <StepsV2
                    steps={bookingSteps}
                    currentStep={currentStep}
                />
            </div>

            {(currentStep == 1 || currentStep == 2) && 
                <div className="border-top border-bottom my-3 border-dark">
                    <div className="container">
                        <div className="d-flex flex-column flex-md-row">
                            {/* Car details */}
                            <div className="w-100 w-md-50 py-2 py-md-4 px-3">
                                <div className="row mb-2">
                                    <div className="w-md-75">
                                        <ImageSlider images={car?.images}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <h4>{car?.name}</h4>
                                </div>
                                <div className="row mb-2 fw-semibold">
                                    <div className="col-4">Ratings:</div>
                                    <div className="col-8"><StarRating value={car?.rating || 0} size={20}/></div>
                                </div>
                                <div className="row mb-2 fw-semibold">
                                    <div className="col-4">Number of Seats:</div>
                                    <div className="col-8">{car?.numberOfSeats}</div>
                                </div>
                                <div className="row mb-2 fw-semibold">
                                    <div className="col-4">Price:</div>
                                    <div className="col-8">{currencyFormat((car?.basePrice ?? 0) * MULTIPLIED_AMOUNT / 1000, 'VND', false)}k/day</div>
                                </div>
                                <div className="row mb-2 fw-semibold">
                                    <div className="col-4">Loaction:</div>
                                    <div className="col-8">{car?.address}</div>
                                </div>
                                <div className="row mb-2 fw-semibold">
                                    <div className="col-4">Status:</div>
                                    <div className="col-8 text-success">
                                        {(car?.isAvailable && !car?.isStopped) && <span className="text-success">Available</span>}
                                        {car?.isStopped && <span className="text-danger">Stopped</span> }
                                    </div>
                                </div>
                            </div>
                            {/* Booking summary */}
                            <div className="w-100 w-md-50 py-2 py-md-4 px-3 border-md-start border-dark">
                                <div className="row mb-3">
                                    <h4>Booking Summary</h4>
                                </div>
                                <div className="row mb-3">
                                    <h5 className="text-end">
                                        Number of hours: {hoursDiff.toFixed(2)}h
                                    </h5>
                                </div>
                                <div className="row mb-3">
                                    <h5 className="text-end">Price per day: {currencyFormat((car?.basePrice ?? 0) * MULTIPLIED_AMOUNT, 'VND', false)} VND</h5>
                                </div>
                                <div className="w-75 pt-1 mb-3 ms-auto bg-dark"></div>
                                <div className="row mb-3">
                                    <h5 className="text-end">Total: {currencyFormat(total * MULTIPLIED_AMOUNT, 'VND', false)} VND</h5>
                                </div>
                                <div className="row mb-3">
                                    <h5 className="text-end">Deposit: {currencyFormat(deposit * MULTIPLIED_AMOUNT, 'VND', false)} VND</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {currentStep == 1 && <BookingStep1 isTimeValid={isTimeValid()} onCancel={handleCancel} onNextStep={nextStep}/>}

            {currentStep == 2 && (
                <BookingStep2
                    disabled={loading}
                    loading={loading}
                    deposit={deposit}
                    startDate={startDate}
                    startTime={startTime}
                    endDate={endDate}
                    endTime={endTime}
                    numberOfHour={hoursDiff}
                    total={total}
                    onCancel={handleCancel}
                    onNextStep={nextStep}
                />
            )}

            {currentStep == 3 && <BookingStep3 bookingResData={bookingResData}/>}
        </>
    )
}
