import axiosInstance from "../utils/authorizedAxios";

export const getUserBookingListApi = async (params = {}) => {
  // params: { page, size, sort, search }
  const { page = 1, size = 10, sort = "id:asc", search = "" } = params;
  let query = `user-booking?currentPage=${page}&pageSize=${size}&sort=${sort}`;
  if (search) query += `&keyword=${encodeURIComponent(search)}`;
  const res = await axiosInstance.get(query);
  return res.data;
};

export const getUserRentingListApi = async (params = {}) => {
  // params: { page, size, sort, search }
  const { page = 1, size = 10, sort = "id:asc", search = "" } = params;
  let query = `user/renting?currentPage=${page}&pageSize=${size}&sort=${sort}`;
  if (search) query += `&keyword=${encodeURIComponent(search)}`;
  const res = await axiosInstance.get(query);
  return res.data;
};


export const getAllUser = async (params = {}) => {
  // params: { page, size, sort, search }
  const { page = 1, size = 10, sort = "id:asc", search = "" } = params;
  let query = `user-list?currentPage=${page}&pageSize=${size}&sort=${sort}`;
  if (search) query += `&keyword=${encodeURIComponent(search)}`;
  const res = await axiosInstance.get(query);
  return res.data;
};