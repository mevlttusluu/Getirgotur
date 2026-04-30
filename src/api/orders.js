import axiosClient from "./axiosClient";

export async function createOrder(payload) {
  const res = await axiosClient.post("/api/orders", payload);
  return res.data?.order ?? null;
}

export async function getMyOrders() {
  const res = await axiosClient.get("/api/orders/my");
  return res.data?.orders ?? [];
}

export async function getAllOrders() {
  const res = await axiosClient.get("/api/orders");
  return res.data?.orders ?? [];
}

