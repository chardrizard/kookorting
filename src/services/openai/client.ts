
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TIMEOUT_MS = 60_000;

type RecipeGenerationResponse = {
  status?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export async function callRecipeModel(userMessage: string, systemPrompt: string): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const { data, error } = await supabase.functions.invoke('generate-recipes', {
      body: { userMessage, systemPrompt },
    });

    clearTimeout(timeoutId);

    const responseData = data as RecipeGenerationResponse | null;

    if (error) {
      if (error.message?.includes('Rate limit') || responseData?.status === 'rate_limited') {
        toast.error('Limiet bereikt. Probeer het over een uur opnieuw.');
      } else {
        toast.error('Kon geen recepten genereren. Probeer het opnieuw.');
      }
      throw new Error(error.message || 'Error calling recipe generation API');
    }

    if (!responseData?.choices?.[0]?.message?.content) {
      toast.error('Ongeldig formaat van gegenereerde recepten');
      throw new Error('Invalid response format from recipe generation API');
    }

    const content = responseData.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (e) {
      toast.error('Kon de gegenereerde recepten niet verwerken');
      throw new Error('Failed to parse recipe generation response');
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      toast.error('Het genereren van recepten duurde te lang. Probeer het opnieuw.');
      throw new Error('Request timeout after 60 seconds');
    }

    if (!getErrorMessage(error).includes('timeout')) {
      toast.error('Er ging iets mis bij het genereren van recepten');
    }

    throw error;
  }
}
