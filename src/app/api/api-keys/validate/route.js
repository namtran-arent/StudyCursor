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

// POST - Validate an API key
export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if API key exists in database
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, type')
      .eq('key', key)
      .single();

    // If error or no data found, return 401 Unauthorized
    if (error || !data) {
      // Check if it's a "not found" error (PGRST116) or any other error
      if (error?.code === 'PGRST116' || !data) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      // Other database errors
      return NextResponse.json(
        { error: error?.message || 'Failed to validate API key' },
        { status: 401 }
      );
    }

    // Valid API key found
    return NextResponse.json(
      { valid: true, key: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
