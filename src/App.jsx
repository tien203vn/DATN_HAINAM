import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './layouts/Layout'
import Home from './pages/Home'
import NotFound from './pages/error/NotFound'
import MyBooking from './pages/MyBooking'
import BookingDetails from './pages/BookingDetails'
import ForgotPassword from './pages/ForgotPassword'
import Booking from './pages/Booking'
import MyWallet from './pages/MyWallet'
import MyReports from './pages/MyReports'
import MyProfile from './pages/MyProfile'
import MyCars from './pages/MyCars'
import Search from './pages/Search'
import MyCarDetails from './pages/MyCarDetails'
import AddACar from './pages/AddACar'
import CarDetails from './pages/CarDetails'
import CarBookingDetails from './pages/CarBookingDetails'
import ProtectedRoute from './router/ProtectedRoute'
import OwnerBookingDetailPage from './components/home/Customer/Booking/OwnerBookingDetailPage'
import UsersBooking from './components/home/Customer/User/UsersBooking'
import CarConfirmActive from './components/home/Customer/Booking/CarConfirmActive'

// Admin
import AdminDashboard from './admin/AdminDashboard'
import Products from './pages/pageAdmin/Products'
import Orders from './pages/pageAdmin/Orders'
import Users from './pages/pageAdmin/Users'
import Categories from './pages/pageAdmin/Categories'
import Analysis from './components/home/Customer/Booking/Analysis'
import CustomerOrders from './components/home/Customer/Booking/CustomerOrder'
import MyCarsBooking from './pages/MyCarsBooking'
import MyCarsNotBooking from './pages/MyCarsNotBooking'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* App client */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="rent-car" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="my-booking" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />
          <Route path="my-booking/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
          <Route path="car-booking/:bookingId" element={<ProtectedRoute><CarBookingDetails /></ProtectedRoute>} />
          <Route path="owner-booking/:bookingId" element={<ProtectedRoute><OwnerBookingDetailPage /></ProtectedRoute>} />
          <Route path="my-cars" element={<ProtectedRoute><MyCars /></ProtectedRoute>} />
          <Route path="my-cars-active" element={<ProtectedRoute><MyCarsBooking /></ProtectedRoute>} />
          <Route path="my-cars-not-active" element={<ProtectedRoute><MyCarsNotBooking /></ProtectedRoute>} />
          <Route path="my-cars/:carId" element={<ProtectedRoute><MyCarDetails /></ProtectedRoute>} />
          <Route path="add-car" element={<ProtectedRoute><AddACar /></ProtectedRoute>} />
          <Route path="car-confirm" element={<ProtectedRoute><CarConfirmActive /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><MyWallet /></ProtectedRoute>} />
          <Route path="my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/bookings/order" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
          <Route path="/bookings/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/user-booking" element={<ProtectedRoute><UsersBooking /></ProtectedRoute>} />
          {/* BỎ dấu / để route con render trong Layout */}
          <Route path="cars/:carId" element={<ProtectedRoute><CarDetails /></ProtectedRoute>} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="not-found" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  )
}

export default App
