import axios from "axios";

const abortController = new AbortController();
const signal = abortController.signal;

const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  signal,
});

export default baseAxios;
