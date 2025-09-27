import { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function PaymentSuccessNotification({ show, amount, onClose }) {
  useEffect(() => {
    if (show && amount) {
      // Hiển thị toast thành công
      toast.success(
        `🎉 Nạp tiền thành công! +${new Intl.NumberFormat('vi-VN').format(amount)} VND`, 
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
      
      // Auto close sau 3 giây
      const timer = setTimeout(() => {
        if (onClose) onClose()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [show, amount, onClose])

  if (!show) return null

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="card shadow-lg border-success" style={{ maxWidth: '400px' }}>
        <div className="card-header bg-success text-white text-center">
          <h5 className="mb-0">🎉 Nạp tiền thành công!</h5>
        </div>
        <div className="card-body text-center">
          <div className="text-success fs-4 fw-bold mb-3">
            +{new Intl.NumberFormat('vi-VN').format(amount)} VND
          </div>
          <p className="text-muted">
            Tiền đã được cộng vào ví của bạn
          </p>
          <button 
            className="btn btn-success" 
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}