import { supabase } from "../../../scripts/admin";
import { NextResponse } from 'next/server';

// Helper function to read data from Supabase
async function ReadData(userid: string) {
  try {
    let { data, error } = await supabase
      .from('ourchatbot_main')
      .select('description, faqs, name, language, color, about')
      .eq('chat_id', userid)
      .single(); // Get single record instead of array

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your domain
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { userid } = reqBody;

    if (!userid) {
      return NextResponse.json(
        { error: "userid is required" },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log("ID From Route: ", userid);

    // Get the chatbot data
    const chatbotData = await ReadData(userid);

    if (!chatbotData) {
      return NextResponse.json(
        { error: "Chatbot configuration not found" },
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    // Format the response to match what the widget expects
    const response = {
      name: chatbotData.name || 'Assistant',
      color: chatbotData.color || '#0070f3',
      about: chatbotData.about || '',
      faqs: chatbotData.faqs || [],
      language: chatbotData.language || 'en',
      description: chatbotData.description
    };

    return NextResponse.json(response, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json(
      { error: "An error occurred while reading data" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}