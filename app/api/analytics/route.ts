import { ClicksTimeseries } from "dub/models/components";
import { dub } from "../../../scripts/admin";
import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    url: string;
  };
}

async function getAnalytics(reqBody: ExtendedNextApiRequest['body']) {
    try {
      //console.log("URL BATCH", reqBody.url)
        // Retrieve the timeseries analytics for the last 7 days for a link
        const response = await dub.analytics.retrieve({
          linkId: reqBody.url,
          interval: "7d",
          groupBy: "timeseries",
        });
    
        const timeseries = response as ClicksTimeseries[];

        console.log("TIME", timeseries)
    
        return timeseries
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
}

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { url } = reqBody;

//console.log("URL", url)
    // Update the data
    const updatedData = await getAnalytics({ url });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "An error occurred while reading data" }, { status: 500 });
  }
}
