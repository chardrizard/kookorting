
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TIMEOUT_MS = 60_000;

type RecipeGenerationResponse = {
  status?: string;
  error?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

let anonymousSignInPromise: Promise<string> | null = null;

async function ensureSession(): Promise<string> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message || 'Could not read Supabase session');
  }

  if (session?.access_token) {
    return session.access_token;
  }

  anonymousSignInPromise ??= supabase.auth
    .signInAnonymously()
    .then(({ data, error }) => {
      if (error) {
        throw new Error(error.message || 'Could not start anonymous session');
      }

      if (!data.session?.access_token) {
        throw new Error('Anonymous session did not include an access token');
      }

      return data.session.access_token;
    })
    .finally(() => {
      anonymousSignInPromise = null;
    });

  return anonymousSignInPromise;
}

async function getFunctionErrorMessage(error: unknown, fallback = 'Error calling recipe generation API') {
  const context = error instanceof Error && 'context' in error ? error.context : null;

  if (context instanceof Response) {
    try {
      const body = await context.clone().json();
      if (typeof body?.error === 'string') {
        return body.error;
      }
    } catch {
      // Keep the original error message when the response body is not JSON.
    }
  }

  return getErrorMessage(error) || fallback;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

export async function callRecipeModel(userMessage: string, systemPrompt: string): Promise<unknown> {
  try {
    const accessToken = await ensureSession();
    const { data, error } = await withTimeout(
      supabase.functions.invoke('generate-recipes', {
        body: { userMessage, systemPrompt },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      TIMEOUT_MS
    );

    const responseData = data as RecipeGenerationResponse | null;

    if (error) {
      const errorMessage = await getFunctionErrorMessage(error);

      if (errorMessage.includes('Rate limit') || responseData?.status === 'rate_limited') {
        toast.error('Limiet bereikt. Probeer het over een uur opnieuw.');
      } else {
        toast.error('Kon geen recepten genereren. Probeer het opnieuw.');
      }
      throw new Error(errorMessage);
    }

    if (!responseData?.choices?.[0]?.message?.content) {
      const errorMessage = responseData?.error || 'Invalid response format from recipe generation API';
      toast.error('Ongeldig formaat van gegenereerde recepten');
      throw new Error(errorMessage);
    }

    const content = responseData.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (e) {
      toast.error('Kon de gegenereerde recepten niet verwerken');
      throw new Error('Failed to parse recipe generation response');
    }
  } catch (error) {
    if (getErrorMessage(error).includes('timeout')) {
      toast.error('Het genereren van recepten duurde te lang. Probeer het opnieuw.');
      throw error;
    }

    if (!getErrorMessage(error).includes('timeout')) {
      toast.error('Er ging iets mis bij het genereren van recepten');
    }

    throw error;
  }
}
