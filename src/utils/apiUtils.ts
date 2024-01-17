import axios, { Axios } from "axios";
import { NextRequest } from "next/server";
import dotenv from "dotenv";
import Logger from "./loggerServer";
import loggerServer from "./loggerServer";
dotenv.config();

const getBaseUrl = (): string => {
  let baseUrl = "";
  switch (process.env.NODE_ENV) {
    case "production":
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION || "";
      break;
    case "development":
      // baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DEVELOPMENT || "";
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL_LOCAL || "";
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

export function GetAxiosInstance(request: NextRequest): Axios;
export function GetAxiosInstance(userId: string, token: string): Axios;

// Unified function implementation
export function GetAxiosInstance(arg1: any, arg2?: any): Axios {
  let token: string;
  let userId: string;

  if (arg1 instanceof NextRequest) {
    token = getTokenFromRequest(arg1);
    userId = getUserIdFromRequest(arg1);
  } else {
    userId = arg1;
    token = arg2;
  }

  if (token && userId) {
    axios.defaults.headers.common["Authorization"] = token;
    axios.defaults.headers.common["user_id"] = userId;
  }

  axios.defaults.baseURL = getBaseUrl();
  loggerServer.info(
    "About to send API request to: " + axios.defaults.baseURL,
    userId
  );

  return axios;
}
export const getUserIdFromRequest = (request: NextRequest): string => {
  const headers = request.headers;
  Logger.info(
    "Headers for user id",
    `before user id ${JSON.stringify(headers)}`,
    { headers }
  );
  const userId = headers.get("user_id");
  if (!userId) {
    return "No user id found in request";
  }
  return userId;
};

export const getTokenFromRequest = (request: NextRequest): string => {
  const headers = request.headers;
  const authorization = headers.get("authorization");
  if (!authorization) {
    return "No authorization found in request";
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return "No token found in request";
  }
  return token;
};
