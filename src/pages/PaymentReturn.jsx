import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { currencyFormat } from '../shared/utils'
import LoadingState from '../components/LoadingState'
import { handleVNPayReturn } from '../shared/apis/paymentApi'

export default function PaymentReturn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentResult, setPaymentResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const hasProcessed = useRef(false) // Prevent duplicate API calls
  const processedTxnRef = useRef(null) // Track processed transaction

  const processPaymentReturn = useCallback(async () => {
    // Lấy txnRef để check duplicate
    const currentTxnRef = searchParams.get('vnp_TxnRef')
    
    // Prevent duplicate API calls
    if (hasProcessed.current || processedTxnRef.current === currentTxnRef) {
      console.log('Payment return already processed, skipping...', {
        hasProcessed: hasProcessed.current,
        processedTxnRef: processedTxnRef.current,
        currentTxnRef
      })
      return
    }
    
    hasProcessed.current = true
    processedTxnRef.current = currentTxnRef
      
    try {
      // Lấy tất cả params từ URL để gửi về backend
      const params = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      console.log('Processing VNPay return params:', params)

      // Gọi API backend để xử lý return URL
      const response = await handleVNPayReturn(params)
      
      if (response.success && response.data) {
        const { vnpResponseCode, amount, txnRef, orderInfo, payDate, transactionNo, bankCode } = response.data
        
        if (vnpResponseCode === '00') {
          // Thanh toán thành công
          setPaymentResult({
            success: true,
            message: 'Nạp tiền thành công!',
            amount: amount,
            txnRef: txnRef,
            orderInfo: orderInfo,
            payDate: payDate,
            transactionNo: transactionNo,
            bankCode: bankCode
          })
          
          toast.success(`Nạp tiền thành công ${currencyFormat(amount, 'VND', false)} VND`)
          
          // Tự động chuyển về ví sau 3 giây
          setTimeout(() => {
            navigate('/wallet')
          }, 3000)
          
        } else {
          // Thanh toán thất bại
          setPaymentResult({
            success: false,
            message: getErrorMessage(vnpResponseCode),
            txnRef: txnRef
          })
          
          toast.error('Thanh toán thất bại')
          
          // Tự động chuyển về ví sau 5 giây
          setTimeout(() => {
            navigate('/wallet')
          }, 5000)
        }
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán')
      }
      
    } catch (error) {
      console.error('Payment return error:', error)
      setPaymentResult({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán',
        txnRef: searchParams.get('vnp_TxnRef')
      })
      toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán')
      
      // Tự động chuyển về ví sau 5 giây
      setTimeout(() => {
        navigate('/wallet')
      }, 5000)
    } finally {
      setLoading(false)
    }
  }, [searchParams, navigate])

  useEffect(() => {
    // Chỉ process một lần khi component mount
    processPaymentReturn()
  }, [processPaymentReturn])

  const getErrorMessage = (responseCode) => {
    switch (responseCode) {
      case '01': return 'Giao dịch chưa hoàn tất'
      case '02': return 'Giao dịch bị lỗi'
      case '04': return 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)'
      case '05': return 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)'
      case '06': return 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)'
      case '07': return 'Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)'
      case '09': return 'GD Hoàn trả bị từ chối'
      case '10': return 'Đã giao hàng'
      case '11': return 'Giao dịch không thành công do: Khách hàng nhập sai mật khẩu xác thực giao dịch (OTP)'
      case '12': return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa'
      case '13': return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)'
      case '24': return 'Giao dịch không thành công do: Khách hàng hủy giao dịch'
      case '51': return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch'
      case '65': return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày'
      case '75': return 'Ngân hàng thanh toán đang bảo trì'
      case '79': return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định'
      default: return 'Giao dịch thất bại'
    }
  }

  const handleBackToWallet = () => {
    navigate('/wallet')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <LoadingState />
            <p className="text-center mt-3">Đang xử lý kết quả thanh toán...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card shadow-lg ${paymentResult?.success ? 'border-success' : 'border-danger'}`}>
            <div className="card-header text-center">
              <h4 className={paymentResult?.success ? 'text-success' : 'text-danger'}>
                {paymentResult?.success ? '✅ Thanh toán thành công' : '❌ Thanh toán thất bại'}
              </h4>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <h5>{paymentResult?.message}</h5>
              </div>
              
              {paymentResult?.success && (
                <div className="mb-4">
                  <div className="row mb-2">
                    <div className="col-6"><strong>Số tiền:</strong></div>
                    <div className="col-6 text-success">
                      {currencyFormat(paymentResult.amount, 'VND', false)} VND
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><strong>Mã giao dịch:</strong></div>
                    <div className="col-6">{paymentResult.txnRef}</div>
                  </div>
                  {paymentResult.transactionNo && (
                    <div className="row mb-2">
                      <div className="col-6"><strong>Mã GD VNPay:</strong></div>
                      <div className="col-6">{paymentResult.transactionNo}</div>
                    </div>
                  )}
                  {paymentResult.bankCode && (
                    <div className="row mb-2">
                      <div className="col-6"><strong>Ngân hàng:</strong></div>
                      <div className="col-6">{paymentResult.bankCode}</div>
                    </div>
                  )}
                  {paymentResult.payDate && (
                    <div className="row mb-2">
                      <div className="col-6"><strong>Thời gian:</strong></div>
                      <div className="col-6">{paymentResult.payDate}</div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center">
                <button className="btn btn-primary" onClick={handleBackToWallet}>
                  Quay về Ví của tôi
                </button>
              </div>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  {paymentResult?.success ? 'Tự động chuyển sau 3 giây...' : 'Tự động chuyển sau 5 giây...'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}