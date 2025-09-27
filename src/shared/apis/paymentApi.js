import axiosInstance from '../utils/authorizedAxios'

// Tạo thanh toán VNPay cho nạp tiền ví
export const createVNPayPayment = async (paymentData) => {
  const res = await axiosInstance.post('payment/vnpay/create', paymentData)
  return res.data
}

// Xử lý VNPay return URL
export const handleVNPayReturn = async (params) => {
  const queryString = new URLSearchParams(params).toString()
  const res = await axiosInstance.get(`payment/vnpay/return?${queryString}`)
  return res.data
}

// Xử lý VNPay IPN callback
export const handleVNPayIPN = async (params) => {
  const queryString = new URLSearchParams(params).toString()
  const res = await axiosInstance.get(`payment/vnpay/ipn?${queryString}`)
  return res.data
}