import axios from "axios"
const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION;
export const client = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Authorization": authorization,
      
    }
  });

export const S3_BUCKET = "optifo-prod";
export const REGION = "eu-west-2";
export const ACCESS_KEY = "i2/lT+KHHWINDLeQgUgQUkaUNxXzxK1wr2IQ8noJ";
export const SECRET_KEY = "AKIA3DGULCSWXFHUEBJS";

// S3_BUCKET_NAME=optifo-dev
// IAM_ACCESS_KEY=i2/lT+KHHWINDLeQgUgQUkaUNxXzxK1wr2IQ8noJ
// IAM_KEY_ID=AKIA3DGULCSWXFHUEBJS
