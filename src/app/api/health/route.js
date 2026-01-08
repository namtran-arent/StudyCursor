import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: {
      configured: !!(supabaseUrl && supabaseAnonKey),
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'not set',
      connected: false,
      error: null,
    },
  };

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        ...health,
        status: 'error',
        supabase: {
          ...health.supabase,
          error: 'Environment variables not configured',
        },
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by querying api_keys table
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          ...health,
          status: 'error',
          supabase: {
            ...health.supabase,
            connected: false,
            error: error.message,
            errorCode: error.code,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...health,
      supabase: {
        ...health.supabase,
        connected: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ...health,
        status: 'error',
        supabase: {
          ...health.supabase,
          connected: false,
          error: error.message,
        },
      },
      { status: 500 }
    );
  }
}
