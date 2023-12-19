import axios, { Axios } from "axios";
import { NextRequest } from "next/server";

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
  axios.defaults.baseURL = "http://localhost:3000/dev/api";
  // axios.defaults.baseURL =
  //   "https://72kvc34caj.execute-api.us-east-1.amazonaws.com/dev/api";
  return axios;
};
