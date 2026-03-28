import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-mock-interview-rs8j.onrender.com"
});

export default API;
