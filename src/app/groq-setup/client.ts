import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import {schema} from "../api/groq/schema"
import { executeGeneratedQuery } from '@/app/auth/supabase-client'
const model = new ChatGroq({
  temperature: 0,
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
});

const sqlGenerationPrompt = new PromptTemplate({
  template: `You are an expert PostgreSQL query generator. Generate a precise and syntactically correct PostgreSQL query based on the provided database schema and user question.

  Database Schema:
  {schema}

  IMPORTANT RULES:
1. Always use table aliases (e.g., 'departments d', 'students s')
2. Use LEFT JOIN when counting to include zero counts
3. For aggregations, always include GROUP BY
4. Keep subqueries simple and avoid nested aggregates
5. Use DISTINCT only when necessary
6. Include meaningful column aliases
7. Only generate SELECT statements
8. Always use exact table and column names from the schema
9. Proper foreign key relationships:
   - students.major_id → departments.department_id
   - faculty.department_id → departments.department_id
   - courses.department_id → departments.department_id
   - enrollments.student_id → students.student_id
   - enrollments.course_id → courses.course_id

  Examples:
- User Question: "What is the average number of students per course?"
  JSON Response: {{ "user_question": "What is the average number of students per course?", "query": "SELECT AVG(student_count) AS avg_students_per_course FROM (SELECT COUNT(e.student_id) AS student_count FROM enrollments e GROUP BY e.course_id) subquery;" }}

- User Question: "Show me all courses and their enrollment counts with course names."
  JSON Response: {{ "user_question": "Show me all courses and their enrollment counts with course names", "query": "SELECT c.name, COUNT(e.enrollment_id) AS enrollment_count FROM courses c LEFT JOIN enrollments e ON c.course_id = e.course_id GROUP BY c.name ORDER BY enrollment_count DESC;" }}

  EXAMPLE QUERIES:

1. Basic Join Query:
Question: "Show courses with their department names"
Valid Query:
SELECT 
    c.name as course_name, 
    d.name as department_name
FROM courses c
JOIN departments d ON c.department_id = d.department_id;

2. Multiple Join Query:
Question: "Show courses with department names and faculty names"
Valid Query:
SELECT 
    c.name as course_name,
    d.name as department_name,
    f.first_name || ' ' || f.last_name as faculty_name
FROM courses c
JOIN departments d ON c.department_id = d.department_id
JOIN faculty f ON d.department_id = f.department_id;

3. Left Join Query:
Question: "Show all departments and their courses"
Valid Query:
SELECT 
    d.name as department_name,
    c.name as course_name
FROM departments d
LEFT JOIN courses c ON d.department_id = c.department_id;


2. GROUP BY WITH JOIN:
Question: "How many students are enrolled in each department?"
Valid Query:
SELECT d.name as department_name, COUNT(s.student_id) as student_count
FROM departments d
LEFT JOIN students s ON d.department_id = s.major_id
GROUP BY d.name;

3. SUBQUERY IN WHERE:
Question: "Find courses with more than average number of enrollments"
Valid Query:
SELECT c.name, COUNT(e.enrollment_id) as enrollment_count
FROM courses c
LEFT JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.name
HAVING COUNT(e.enrollment_id) > (
    SELECT AVG(enrollment_count)
    FROM (
        SELECT COUNT(enrollment_id) as enrollment_count
        FROM enrollments
        GROUP BY course_id
    ) as avg_counts
);

4. DISTINCT WITH JOIN:
Question: "Show unique departments where students got an A grade"
Valid Query:
SELECT DISTINCT d.name as department_name
FROM departments d
JOIN courses c ON d.department_id = c.department_id
JOIN enrollments e ON c.course_id = e.course_id
WHERE e.grade = 'A';

5. UNION:
Question: "List all department names and the number of associated faculty and students"
Valid Query:
SELECT d.name as department_name, 'Faculty' as type, COUNT(f.faculty_id) as count
FROM departments d
LEFT JOIN faculty f ON d.department_id = f.department_id
GROUP BY d.name
UNION ALL
SELECT d.name as department_name, 'Students' as type, COUNT(s.student_id) as count
FROM departments d
LEFT JOIN students s ON d.department_id = s.major_id
GROUP BY d.name;

  User Question: {user_question}
  
  JSON Response:`,
  inputVariables: ["user_question", "schema"],
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
  


export async function executeQuery(sql: string) {
  const response  = await executeGeneratedQuery(sql);
  if(!response){
    throw new Error("No response from Supabase")
  }
  return response

}