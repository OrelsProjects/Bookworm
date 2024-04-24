import { NextRequest, NextResponse } from "next/server";
import { IResponse } from "../../../../../models/dto/response";
import { GetAxiosInstance, getUserIdFromRequest } from "../../../../../utils/apiUtils";
import { Visitor } from "../_utils";
import { BookInListVisit } from "../../../../../models/statistics/visit";
import loggerServer from "../../../../../utils/loggerServer";

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<void>>> {
  let createVisitBody: BookInListVisit | null = null;
  try {
    const visitorType: Visitor = "bookInList";
    createVisitBody = await req.json();
    const axios = GetAxiosInstance(req);
    await axios.post("/statistics/visitor", { ...createVisitBody, visitorType });
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error creating visit", getUserIdFromRequest(req), {
        data: {
          createVisitBody,
        },
        error,
      });

    return NextResponse.json({}, { status: 500 });
  }
}
