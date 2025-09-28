import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { currencyFormat } from '../shared/utils'
import LoadingState from '../components/LoadingState'

export default function PaymentReturn() {
  const navigate = useNavigate()
  const [paymentResult, setPaymentResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const processedRef = useRef(false)
  const txnRefRef = useRef(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const txnRef = urlParams.get('txnRef')
    const sessionKey = txnRef ? `payment_return_${txnRef}` : 'payment_return_unknown'

    if (processedRef.current) {
      console.log('[Payment][Skip] already processed (in-memory)')
      return
    }
    if (txnRefRef.current && txnRefRef.current === txnRef) {
      console.log('[Payment][Skip] same txnRef ref processed')
      return
    }
    if (sessionStorage.getItem(sessionKey)) {
      console.log('[Payment][Skip] sessionStorage flag exists')
      return
    }

    processedRef.current = true
    txnRefRef.current = txnRef
    sessionStorage.setItem(sessionKey, '1')

    // Process payment result from URL params directly (backend already processed)
    const success = urlParams.get('success') === 'true'
    const message = decodeURIComponent(urlParams.get('message') || '')
    const amount = parseInt(urlParams.get('amount') || '0')

    console.log('[Payment][Process] URL params =>', { success, message, amount, txnRef })

    if (success) {
      setPaymentResult({
        success: true,
        message: message || 'Nạp tiền thành công!',
        amount: amount,
        txnRef: txnRef
      })
      toast.success(`Nạp tiền thành công ${currencyFormat(amount, 'VND', false)} VND`)
      setTimeout(() => navigate('/wallet'), 3000)
    } else {
      setPaymentResult({
        success: false,
        message: message || 'Thanh toán thất bại',
        txnRef: txnRef
      })
      toast.error('Thanh toán thất bại')
      setTimeout(() => navigate('/wallet'), 5000)
    }

    setLoading(false)
  }, [navigate])



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
                  <div className="row mb-2">
                    <div className="col-6"><strong>Thời gian:</strong></div>
                    <div className="col-6">{new Date().toLocaleString('vi-VN')}</div>
                  </div>
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