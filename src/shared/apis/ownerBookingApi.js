import axiosInstance from "../utils/authorizedAxios";

export const getOwnerBookingListApi = async (params) => {
  // Tạo query string từ params
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const res = await axiosInstance.get(`/booking/list-booking?${query}`);
  return res.data;
};


export const getBookingListApi = async (params) => {
  // Tạo query string từ params
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  const res = await axiosInstance.get(`/booking/all?${query}`);
  return res.data;
};