import axiosClient from "./axiosClient";

export async function getMe() {
  const res = await axiosClient.get("/api/auth/me");
  return res.data?.user ?? null;
}

export async function register(payload) {
  const res = await axiosClient.post("/api/auth/register", payload);
  return res.data?.user ?? null;
}

export async function login(payload) {
  const res = await axiosClient.post("/api/auth/login", payload);
  return res.data?.user ?? null;
}

export async function logout() {
  await axiosClient.post("/api/auth/logout");
  return true;
}

