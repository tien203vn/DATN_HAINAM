import clsx from "clsx"
import styles from './styles.module.css'
import { Modal } from "react-bootstrap"
import { useState } from "react"
import { currencyFormat } from "../../shared/utils"
import { createVNPayPayment } from "../../shared/apis/paymentApi"
import { toast } from "react-toastify"

export default function WithdrawModal({currentBalance = 0, show = false, onClose = () => {}}) {

    const [amount, setAmount] = useState('')
    const [useCustomAmount, setUseCustomAmount] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setAmount('')
        setUseCustomAmount(false)
        setLoading(false)
        if(onClose) onClose()
    }

    const handleClick = async () => {
        const finalAmount = useCustomAmount ? parseFloat(amount) : getSelectedAmount()
        if (!finalAmount || finalAmount <= 0) {
            toast.error("Vui lòng nhập số tiền hợp lệ")
            return
        }

        if (finalAmount < 10000) {
            toast.error("Số tiền nạp tối thiểu là 10.000 VND")
            return
        }

        setLoading(true)
        
        try {
            // Tạo dữ liệu thanh toán theo VNPay API doc
            const paymentData = {
                amount: finalAmount, // Số tiền (backend sẽ nhân với 100)
                orderInfo: `Nap tien vao vi ${currencyFormat(finalAmount, 'VND', false)} VND`, // Không dấu, không ký tự đặc biệt
                orderType: "billpayment", // Mã danh mục hàng hóa
                returnUrl: `${window.location.origin}/payment-return` // URL return
            }

            // Gọi API tạo thanh toán VNPay
            const response = await createVNPayPayment(paymentData)
            
            if (response.success && response.data && response.data.paymentUrl) {
                // Redirect đến VNPay để thanh toán
                window.location.href = response.data.paymentUrl
            } else {
                toast.error(response.message || "Không thể tạo thanh toán. Vui lòng thử lại.")
            }
            
        } catch (error) {
            console.error("VNPay payment error:", error)
            toast.error("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const getSelectedAmount = () => {
        const select = document.querySelector('.amount-select')
        const selectedValue = select?.value
        const amounts = [1000000, 2000000, 5000000, 10000000]
        return amounts[selectedValue] || 0
    }

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header className="d-flex justify-content-center">
                <Modal.Title>Top-up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-center mb-3">
                    Vui lòng chọn số tiền muốn nạp vào ví.
                </p>
                
                <div className="mb-3">
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="amountOption" 
                            id="predefined"
                            checked={!useCustomAmount}
                            onChange={() => setUseCustomAmount(false)}
                        />
                        <label className="form-check-label" htmlFor="predefined">
                            Chọn từ danh sách có sẵn
                        </label>
                    </div>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="amountOption" 
                            id="custom"
                            checked={useCustomAmount}
                            onChange={() => setUseCustomAmount(true)}
                        />
                        <label className="form-check-label" htmlFor="custom">
                            Nhập số tiền tùy chọn
                        </label>
                    </div>
                </div>

                {!useCustomAmount ? (
                    <div className="d-flex justify-content-center">
                        <select className="form-select w-content amount-select" aria-label="Select price">
                            <option value="0">1.000.000 VND</option>
                            <option value="1">2.000.000 VND</option>
                            <option value="2">5.000.000 VND</option>
                            <option value="3">10.000.000 VND</option>
                        </select>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        <div className="input-group" style={{maxWidth: '300px'}}>
                            <input 
                                type="number" 
                                className="form-control text-end" 
                                placeholder="Nhập số tiền"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="10000"
                                max="100000000"
                            />
                            <span className="input-group-text">VND</span>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="p-0">
                <div className="btn-group m-0 w-100"  role="group">
                    <button type="button" className={clsx("m-0 btn border-end", styles.btn_footer_modal)} onClick={handleClose} disabled={loading}>
                        Cancel
                    </button>
                    <button type="button" className={clsx("m-0 btn", styles.btn_footer_modal)} onClick={handleClick} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Thanh toán VNPay"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}