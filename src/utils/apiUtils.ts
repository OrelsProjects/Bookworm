import axios, { Axios } from "axios";
import { NextRequest } from "next/server";
import dotenv from "dotenv";
dotenv.config();

export function GetAxiosInstance(request: NextRequest): Axios;
export function GetAxiosInstance(userId: string, token: string): Axios;

// Unified function implementation
export function GetAxiosInstance(arg1: any, arg2?: any): Axios {
  let token: string;
  let userId: string;

  if (!arg2) {
    token = getTokenFromRequest(arg1);
    userId = getUserIdFromRequest(arg1);
  } else {
    userId = arg1;
    token = arg2;
  }

  if (token && userId) {
    axios.defaults.headers.common["Authorization"] = null;
    axios.defaults.headers.common["user_id"] = userId;
  }

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

  return axios;
}
export const getUserIdFromRequest = (request: NextRequest): string => {
  const headers = request.headers;
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
