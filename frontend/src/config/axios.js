import axios from "axios";

export const instance = axios.create({
  baseURL: "https://project-aurora-29zc.onrender.com",
  withCredentials: true,
});
