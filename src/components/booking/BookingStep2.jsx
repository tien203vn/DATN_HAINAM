import { useForm } from 'react-hook-form'
import { currencyFormat, formatDateTime } from '../../shared/utils'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { MULTIPLIED_AMOUNT } from '../../shared/constants'
import ConfirmModal from '../modals/ConfirmModal'
import { useSearchParams } from 'react-router-dom'
import { getMyWalletApi } from '../../shared/apis/userApi'

export default function BookingStep2({
  disabled,
  loading,
  deposit,
  startDate,
  startTime,
  endDate,
  endTime,
  numberOfHour,
  total,
  onCancel,
  onNextStep
}) {
  const [wallet, setWallet] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState(null)
  const [searchParams] = useSearchParams()
  const sD = searchParams.get('sD')
  const sT = searchParams.get('sT')
  const startDateTime =
    startDate && startTime
      ? startDate
          .set('hour', startTime.hour())
          .set('minute', startTime.minute())
          .set('second', 0)
          .set('millisecond', 0)
          .format('YYYY-MM-DD HH:mm')
      : ''

  const eD = searchParams.get('eD')
  const eT = searchParams.get('eT')
  const endDateTime =
    endDate && endTime
      ? endDate
          .set('hour', endTime.hour())
          .set('minute', endTime.minute())
          .set('second', 0)
          .set('millisecond', 0)
          .format('YYYY-MM-DD HH:mm')
      : ''

  const { register, handleSubmit } = useForm({
    defaultValues: {
      paymentMethod: 'MY_WALLET'
    }
  })

  useEffect(() => {
    getMyWalletApi().then((data) => {
      const resWallet = data?.data?.wallet ?? 0
      setWallet(resWallet * MULTIPLIED_AMOUNT)
    })
  }, [])

  const onSubmit = (data) => {
    setFormData(data)
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    if (onNextStep && formData) {
      onNextStep(formData)
    }
    setShowConfirmModal(false)
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            <h4>Please select your payment method</h4>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <div className="form-check mb-3 ms-md-5">
                <input
                  className="form-check-input mt-2"
                  type="radio"
                  name="chkPaymentMethod"
                  id="chkPaymentMethod1"
                  value="MY_WALLET"
                  defaultChecked
                  {...register('paymentMethod')}
                />
                <label
                  className="form-check-label fs-5 mb-2"
                  htmlFor="chkPaymentMethod1"
                >
                  My wallet
                </label>
                {wallet >= deposit * MULTIPLIED_AMOUNT ? (
                  <div className="fs-5.5">
                    Current balance:{' '}
                    <span className="text-success">
                      {currencyFormat(wallet, 'VND', false)} VND
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="fs-5.5">
                      Current balance:{' '}
                      <span className="text-danger">
                        {currencyFormat(wallet, 'VND', false)} VND
                        (insufficient)
                      </span>
                    </div>
                    <div className="form-text fs-6">
                      Please go to My wallet to top-up and try again.
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="form-check mb-3 ms-md-5">
                <input
                  className="form-check-input mt-2"
                  type="radio"
                  name="chkPaymentMethod"
                  id="chkPaymentMethod2"
                  value="CASH"
                  {...register('paymentMethod')}
                />
                <label
                  className="form-check-label fs-5 mb-2"
                  htmlFor="chkPaymentMethod2"
                >
                  Cash
                </label>
                <div className="form-text fs-6">
                  Our operator will contact you for further instruction.
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="form-check mb-3 ms-md-5">
                <input
                  className="form-check-input mt-2"
                  type="radio"
                  name="chkPaymentMethod"
                  id="chkPaymentMethod3"
                  value="BANK"
                  {...register('paymentMethod')}
                />
                <label
                  className="form-check-label fs-5 mb-2"
                  htmlFor="chkPaymentMethod3"
                >
                  Bank transfer
                </label>
                <div className="form-text fs-6">
                  Our operator will contact you for further instruction.
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12 d-flex flex-column flex-lg-row align-items-center">
              <div className="d-flex ms-auto me-2">
                <button
                  className={clsx(
                    'btn btn-secondary me-2 px-3',
                    disabled ? 'disabled' : ''
                  )}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className={clsx(
                    'btn btn-primary px-4',
                    disabled ? 'disabled' : ''
                  )}
                  type="submit"
                >
                  {loading ? 'Submitting...' : 'Next'}
                </button>
              </div>
              <div className="form-text fs-6">
                The deposit amount will be deducted from your wallet.
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="mb-3">
        <h5>Thông tin thuê xe</h5>
        <ul>
          <li>
            Ngày nhận xe:{' '}
            {startDate && startDate.format('YYYY-MM-DD')}{' '}
            {startTime && startTime.format('HH:mm')}
          </li>
          <li>
            Ngày trả xe:{' '}
            {endDate && endDate.format('YYYY-MM-DD')}{' '}
            {endTime && endTime.format('HH:mm')}
          </li>
          <li>
            Số giờ thuê:{' '}
            {numberOfHour && numberOfHour.toFixed(2)}h
          </li>
          <li>
            Tổng tiền thuê:{' '}
            {total && total > 0
              ? total.toLocaleString('vi-VN')
              : 0}{' '}
            VND
          </li>
          <li>
            Tiền đặt cọc:{' '}
            {deposit && deposit > 0
              ? deposit.toLocaleString('vi-VN')
              : 0}{' '}
            VND
          </li>
        </ul>
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        message={`Are you sure that you want to rent this car from ${startDateTime} to ${endDateTime} and deposit ${currencyFormat(
          deposit * MULTIPLIED_AMOUNT
        )}?`}
        title="Confirm renting car"
      />
    </>
  )
}
