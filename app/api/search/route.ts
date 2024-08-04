import { query } from "firebase/firestore";
import { supabase, embedTranscription } from "../../../scripts/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from 'next/server';

type Data = any;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userid: string;
    query: string;
  };
}

async function NotecastRPC(reqBody: ExtendedNextApiRequest['body']) {
  const query_embedding = await embedTranscription(reqBody.query)
  const user_id = reqBody.userid

  try {
    let { data, error } = await supabase.rpc('notecast_search', {
  match_count: 5, 
  query_embedding, 
  similarity_threshold: 0.8, 
  user_id
})

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
    const { userid, query } = reqBody;

    //console.log("USERID BE", userid);

    // Update the data
    const fetchedData = await NotecastRPC({ userid, query });

    //console.log("Data from rpc :", fetchedData);

    //const chunks = JSON.stringify(fetchedData)

    return NextResponse.json(fetchedData);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ error: "An error occurred while reading data" }, { status: 500 });
  }
}
