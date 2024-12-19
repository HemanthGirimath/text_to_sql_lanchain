import { createSqlGenerationChain } from '../../groq-setup/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;  // Changed from userQuestion to query to match your client-side

    if (!query) {
      return NextResponse.json(
        { message: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await createSqlGenerationChain(query);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("SQL Generation Error:", error);
    return NextResponse.json(
      {
        message: "Failed to generate SQL query",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
