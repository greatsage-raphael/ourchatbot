import { supabase } from "../../../scripts/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';

type Data = any;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userid: string;
  };
}

async function ReadData(reqBody: ExtendedNextApiRequest['body']) {
  try {
    let { data, error } = await supabase
      .from('notecast')
      .select('*')
      .eq('userid', reqBody.userid); // read where git_id === user git id

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { userid } = reqBody;

    //console.log("USERID BE", userid);

    // Update the data
    const updatedData = await ReadData({ userid });

    //console.log("Data :", updatedData);

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "An error occurred while reading data" }, { status: 500 });
  }
}
