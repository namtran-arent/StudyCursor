import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      .select('id, name, key, type, usage, monthly_limit, limit_enabled')
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

    // Rate limiting check
    // If limit is enabled, check if usage has reached the limit
    if (data.limit_enabled && data.monthly_limit !== null) {
      const currentUsage = data.usage || 0;
      const limit = data.monthly_limit;
      
      if (currentUsage >= limit) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. You have reached your monthly API usage limit.',
            usage: currentUsage,
            limit: limit
          },
          { status: 429 }
        );
      }
    }

    // Check if githubUrl is provided
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'githubUrl is required' },
        { status: 400 }
      );
    }

    console.log('Fetching repository info for:', githubUrl);
    
    // Parse GitHub URL
    const urlParts = githubUrl.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    
    // Fetch repository information (stars, license, etc.)
    let repoInfo = null;
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (repoResponse.ok) {
        repoInfo = await repoResponse.json();
        console.log('Repository info fetched:', {
          stars: repoInfo.stargazers_count,
          license: repoInfo.license?.name || 'No license',
        });
      } else {
        console.warn('Failed to fetch repository info:', repoResponse.statusText);
      }
    } catch (repoInfoError) {
      console.warn('Error fetching repository info:', repoInfoError);
      // Continue even if repo info fails
    }
    
    // Fetch README content
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

    // Increment API key usage after successful README fetch
    try {
      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ usage: (data.usage || 0) + 1 })
        .eq('id', data.id);

      if (updateError) {
        // Log error but don't fail the request
        console.error('Failed to increment API key usage:', updateError);
      } else {
        console.log(`API key usage incremented for key ID: ${data.id}`);
      }
    } catch (incrementError) {
      // Log error but don't fail the request
      console.error('Exception while incrementing API key usage:', incrementError);
    }

    // Return README content with repository info
    return NextResponse.json(
      {
        readme: readmeContent,
        githubUrl: githubUrl,
        stars: repoInfo?.stargazers_count || 0,
        license: repoInfo?.license?.name || null,
        description: repoInfo?.description || null,
        language: repoInfo?.language || null,
        forks: repoInfo?.forks_count || 0,
        watchers: repoInfo?.watchers_count || 0,
      },
      { status: 200 }
    );
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