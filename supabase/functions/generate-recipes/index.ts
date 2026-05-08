
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 5 generations per user per hour
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const ALLOWED_ORIGINS = [
  'https://chardrizard.github.io',
  'http://localhost:8080',
  'http://localhost:5173',
];

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function getGeminiResponseText(data: GeminiResponse): string | null {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  const text = parts
    .map((part) => part?.text)
    .filter((partText) => typeof partText === 'string')
    .join('');

  return text || null;
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key is not configured', status: 'error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify caller has a valid Supabase session (anon or authenticated)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', status: 'error' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Validate the JWT and extract user id
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid session', status: 'error' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side rate limiting: 5 generations per user per hour
    const now = Date.now();
    const { data: rateRecord } = await supabaseAdmin
      .from('recipe_rate_limits')
      .select('count, window_start')
      .eq('user_id', user.id)
      .maybeSingle();

    const windowStart = rateRecord?.window_start ? new Date(rateRecord.window_start).getTime() : 0;
    const inWindow = now - windowStart < RATE_LIMIT_WINDOW_MS;
    const currentCount = inWindow ? (rateRecord?.count ?? 0) : 0;

    if (inWindow && currentCount >= RATE_LIMIT_MAX) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again later.', status: 'rate_limited' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert the rate limit record
    await supabaseAdmin.from('recipe_rate_limits').upsert({
      user_id: user.id,
      count: currentCount + 1,
      window_start: inWindow ? rateRecord!.window_start : new Date().toISOString(),
    });

    const { userMessage, systemPrompt } = await req.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8000,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Unknown API error');
      }

      const data = await response.json();
      const content = getGeminiResponseText(data);

      if (!content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return new Response(JSON.stringify({
        choices: [
          {
            message: { content },
          },
        ],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error', status: 'error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
