import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

/**
 * Generate a summary of GitHub repository from README content using OpenAI
 * @param {string} readmeContent - The content of the README.md file
 * @returns {Promise<{summary: string, cool_facts: string[]}>} Object with summary and cool_facts
 */
export async function summarizeReadme(readmeContent) {
  // Check for OpenAI API key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey || openaiApiKey.includes('your-') || openaiApiKey.includes('sk-your-')) {
    throw new Error('OPENAI_API_KEY is not configured. Please set a valid OpenAI API key in your .env.local file. Get your API key at https://platform.openai.com/account/api-keys');
  }

  // Initialize the OpenAI model
  const model = new ChatOpenAI({ 
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    openAIApiKey: openaiApiKey,
  });

  // Define the response schema using Zod for validation
  const responseSchema = z.object({
    summary: z.string().describe("A concise summary of the GitHub repository"),
    cool_facts: z.array(z.string()).describe("A list of interesting facts about the repository")
  });

  // Create the prompt template with JSON format instruction
  const prompt = PromptTemplate.fromTemplate(
    `Summarize this github repository from this readme file content.

Return your answer as a JSON object with:
- "summary": a short summary string of the project and its purpose
- "cool_facts": an array of interesting or cool facts about the repository (at least 3 facts)

Format your response as valid JSON only, no additional text.

README CONTENT:
{readmeContent}`
  );

  // Create JSON output parser
  const outputParser = new JsonOutputParser();

  // Create the chain: prompt -> model -> parser
  const chain = prompt.pipe(model).pipe(outputParser);

  // Invoke the chain with the readme content
  const result = await chain.invoke({
    readmeContent: readmeContent
  });

  // Validate the result against the schema
  const validatedResult = responseSchema.parse(result);

  return validatedResult;
}
