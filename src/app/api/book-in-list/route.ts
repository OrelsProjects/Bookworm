import { NextRequest, NextResponse } from "next/server";
import Logger from "@/src/utils/loggerServer";
import {
  GetAxiosInstance,
  getUserIdFromRequest,
} from "../../../utils/apiUtils";
import { BookInList } from "../../../models/bookInList";

export async function PATCH(req: NextRequest) {
  let returnStatus = 200;
  let booksInList: BookInList[] = [];
  try {
    const body = await req.json();
    booksInList = body.booksInList;
    const axios = GetAxiosInstance(req);
    await axios.patch(`/list/books/position`, {booksInList});
  } catch (error: any) {
    Logger.error("Error updating books list", getUserIdFromRequest(req), {
      data: {
        booksInList: booksInList,
      },
      error,
    });
    returnStatus = 500;
  }
  return NextResponse.json({}, { status: returnStatus });
}

export async function POST(req: NextRequest) {}
