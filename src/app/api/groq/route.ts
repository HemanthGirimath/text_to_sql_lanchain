import { createSqlGenerationChain, executeQuery } from '../../groq-setup/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, conversationId } = body;

    if (!query) {
      return new NextResponse(
        JSON.stringify({ error: "Query is required" }),
        { status: 400 }
      );
    }

    if (!conversationId) {
      return new NextResponse(
        JSON.stringify({ error: "Conversation ID is required" }),
        { status: 400 }
      );
    }

    // Generate SQL and execute query
    const GeneratingSql_result = await createSqlGenerationChain(query);
    const executed_sql_result = await executeQuery(GeneratingSql_result.query);

    // Instead of returning 204, return 200 with the empty result and query info
    if (!executed_sql_result || (Array.isArray(executed_sql_result) && executed_sql_result.length === 0)) {
      return NextResponse.json({
        data: [],
        query: GeneratingSql_result.query,
        conversationId,
        message: "Query executed successfully but returned no results"
      }, { status: 200 });
    }

    return NextResponse.json({
      data: executed_sql_result,
      query: GeneratingSql_result.query,
      conversationId
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}