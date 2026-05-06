import { NextResponse } from "next/server";

const association = {
  applinks: {
    apps: [],
    details: [
      {
        appID: "TEAM_ID.kr.fixcar.app",
        paths: ["*"],
      },
    ],
  },
  webcredentials: {
    apps: ["TEAM_ID.kr.fixcar.app"],
  },
};

export async function GET() {
  return NextResponse.json(association, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
