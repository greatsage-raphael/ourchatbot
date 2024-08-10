import { dub } from "../../../scripts/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';

type Data = any;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    url: string;
  };
}

async function CreateLink(reqBody: ExtendedNextApiRequest['body']) {
  try {
    const link = await dub.links.create({
      url: reqBody.url,
    });
console.log("LINK", link.shortLink)
    return link
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { url } = reqBody;


    // Update the data
    const updatedData = await CreateLink({ url });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "An error occurred while reading data" }, { status: 500 });
  }
}
