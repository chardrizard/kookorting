
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TIMEOUT_MS = 60_000;

export async function callOpenAI(userMessage: string, systemPrompt: string): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const { data, error } = await supabase.functions.invoke('generate-recipes', {
      body: { userMessage, systemPrompt },
    });

    clearTimeout(timeoutId);

    if (error) {
      if (error.message?.includes('Rate limit') || (data as any)?.status === 'rate_limited') {
        toast.error('Limiet bereikt. Probeer het over een uur opnieuw.');
      } else {
        toast.error('Kon geen recepten genereren. Probeer het opnieuw.');
      }
      throw new Error(error.message || 'Error calling OpenAI API');
    }

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      toast.error('Ongeldig formaat van gegenereerde recepten');
      throw new Error('Invalid response format from OpenAI');
    }

    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (e) {
      toast.error('Kon de gegenereerde recepten niet verwerken');
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      toast.error('Het genereren van recepten duurde te lang. Probeer het opnieuw.');
      throw new Error('Request timeout after 60 seconds');
    }

    if (!error.message?.includes('timeout')) {
      toast.error('Er ging iets mis bij het genereren van recepten');
    }

    throw error;
  }
}
