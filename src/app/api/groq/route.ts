
import { createSqlGenerationChain, executeQuery } from '../../groq-setup/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { message: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('User Question:', query);
    const GeneratingSql_result = await createSqlGenerationChain(query);
    console.log('Generated SQL:', GeneratingSql_result.query);

    const executed_sql_result = await executeQuery(GeneratingSql_result.query);
    console.log('Execution Result:', executed_sql_result);

    // Instead of returning 204, return 200 with the empty result and query info
    if (!executed_sql_result || (Array.isArray(executed_sql_result) && executed_sql_result.length === 0)) {
      return NextResponse.json({
        message: 'Query returned no results',
        query: GeneratingSql_result.query,
        data: []
      }, { status: 200 });
    }

    return NextResponse.json({
      data: executed_sql_result,
      query: GeneratingSql_result.query
    }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      message: "Query execution failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}