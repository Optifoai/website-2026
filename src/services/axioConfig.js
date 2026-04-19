import axios from "axios"
const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION;
export const client = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Authorization": authorization,
      
    }
  });


