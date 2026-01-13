import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { summarizeReadme } from '@/lib/chain';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// POST - GitHub Summarizer endpoint with API key validation
export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { githubUrl } = body;

    // Lấy key từ header x-api-hey
    const key = request.headers.get('x-api-key');

    // Kiểm tra key
    if (!key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Trim the key to remove any whitespace
    const trimmedKey = key.trim();

    // Check if API key exists in database
    // Use maybeSingle() instead of single() to avoid throwing error when not found
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, type')
      .eq('key', trimmedKey)
      .maybeSingle();

    // If error occurred, return 401 Unauthorized
    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to validate API key' },
        { status: 401 }
      );
    }

    // If no data found, return 401 Unauthorized
    if (!data) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check if githubUrl is provided
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'githubUrl is required' },
        { status: 400 }
      );
    }

    console.log('Fetching README for:', githubUrl);
    
    let readmeContent;
    try {
      readmeContent = await getReadmeContent(githubUrl);
      console.log('README Content Length:', readmeContent.length);
    } catch (readmeError) {
      console.error('Error fetching README:', readmeError);
      return NextResponse.json(
        { error: `Failed to fetch README: ${readmeError.message}` },
        { status: 500 }
      );
    }

    // Generate summary using LangChain
    try {
      const summaryResult = await summarizeReadme(readmeContent);
      console.log('Summary Result:', summaryResult);

      // Return summary result
      return NextResponse.json(
        {
          summary: summaryResult.summary,
          cool_facts: summaryResult.cool_facts
        },
        { status: 200 }
      );
    } catch (summaryError) {
      console.error('Error generating summary:', summaryError);
      
      // Handle specific OpenAI API errors
      const errorMessage = summaryError.message || '';
      let statusCode = 500;
      let userMessage = `Failed to generate summary: ${errorMessage}`;
      
      // Check for quota/rate limit errors (429)
      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        statusCode = 429;
        userMessage = 'OpenAI API quota exceeded or rate limit reached. Please check your OpenAI account billing and usage limits at https://platform.openai.com/account/billing. You may need to upgrade your plan or wait before making more requests.';
      }
      // Check for authentication errors (401)
      else if (errorMessage.includes('401') || errorMessage.includes('Incorrect API key') || errorMessage.includes('OPENAI_API_KEY')) {
        statusCode = 401;
        userMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local file. Get your API key at https://platform.openai.com/account/api-keys';
      }
      
      return NextResponse.json(
        { error: userMessage },
        { status: statusCode }
      );
    }
  } catch (error) {
    console.error('Exception in github-summarizer API:', error);
    return NextResponse.json(
      { error: `Failed to validate API key: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Function to read README.md content from a GitHub URL
 * @param {string} githubUrl - The GitHub repository URL (e.g., https://github.com/owner/repo)
 * @returns {Promise<string>} The raw content of the README.md file
 * @throws {Error} If the README cannot be fetched
 */
async function getReadmeContent(githubUrl) {
  const owner = githubUrl.split('/')[3];
  const repo = githubUrl.split('/')[4];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.statusText}`);
  }

  return await response.text();
}