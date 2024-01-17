import axios, { Axios } from "axios";
import { NextRequest } from "next/server";
import dotenv from "dotenv";
import { Logger } from "../logger";
dotenv.config();

const getBaseUrl = (): string => {
  let baseUrl = "";
  switch (process.env.NODE_ENV) {
    case "production":
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION || "";
      break;
    case "development":
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT || "";

      break;
    case "test":
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LOCAL || "";
      break;
    default:
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LOCAL || "";
      break;
  }
  return baseUrl;
};

export const GetAxiosInstance = (request: NextRequest): Axios => {
  const headers = request.headers;
  const authorization = headers.get("authorization");
  const userId = headers.get("user_id");
  if (authorization && userId) {
    axios.defaults.headers.common["Authorization"] = authorization;
    axios.defaults.headers.common["user_id"] = userId;
    request.headers.set("authorization", authorization);
    request.headers.set("user_id", userId);
  }
  axios.defaults.baseURL = getBaseUrl();
  return axios;
};
