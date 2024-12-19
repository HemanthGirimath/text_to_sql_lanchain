import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import {schema} from "../api/groq/schema"

const model = new ChatGroq({
  temperature: 0,
  model: "llama3-8b-8192",
  apiKey: process.env.GROQ_API_KEY,
});

const sqlGenerationPrompt = new PromptTemplate({
    template: `You are an expert PostgreSQL query generator. Generate a precise PostgreSQL SQL query for PostgreSQL based on the provided database schema and user question.
  
    Database Schema:
    {schema}
  
    Rules:
    - Output the response as JSON in the format: {{ "user_question": "<user_question>", "query": "<SQL_query>" }}
    - Do not include any additional text or explanation.
    - Generate ONLY the JSON object.
  
    User Question: {user_question}
    
    JSON Response:`,
    inputVariables: ["user_question","schema"],
  });
  
const SqlQueryResponseSchema = z.object({
  user_question: z.string(),
  query: z.string().trim(),
});

const structuredLLM = model.withStructuredOutput(SqlQueryResponseSchema);

export async function createSqlGenerationChain( user_question:string) {
    const chain = sqlGenerationPrompt.pipe(structuredLLM);
  
    try {
    //   console.log("Input Schema:", schema);
    //   console.log("User Question:", user_question);

      const response = await chain.invoke({ user_question,schema });
      console.log("Structured LLM Response:", response);
      return response;
    } catch (error) {
      console.error("Error creating SQL generation chain:", error);
      throw new Error("Failed to generate or validate SQL query.");
    }
  }
  


