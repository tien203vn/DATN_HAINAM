import axiosInstance from "../utils/authorizedAxios";

export const getOwnerBookingListApi = async () => {
  const res = await axiosInstance.get("booking/list-booking");
  return res.data;
};
