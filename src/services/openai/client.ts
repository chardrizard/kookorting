
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function callOpenAI(userMessage: string, systemPrompt: string): Promise<any> {
  console.log('Calling OpenAI API through Supabase Edge Function');
  
  try {
    // Set a reasonable timeout for the entire operation
    let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
      timeoutId = null;
      toast.error('Het genereren van recepten duurde te lang. Probeer het opnieuw.');
      throw new Error('Request timeout after 60 seconds');
    }, 60000); // 60 second timeout

    const { data, error } = await supabase.functions.invoke('generate-recipes', {
      body: {
        userMessage,
        systemPrompt
      }
    });
    
    // Clear timeout if request completed
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (error) {
      console.error('Supabase Edge Function Error:', error);
      toast.error('Kon geen recepten genereren. Probeer het opnieuw.');
      throw new Error(error.message || 'Error calling OpenAI API');
    }
    
    console.log('Edge function response:', data);
    
    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid response format from OpenAI:', data);
      toast.error('Ongeldig formaat van gegenereerde recepten');
      throw new Error('Invalid response format from OpenAI');
    }
    
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      console.log('Raw response content:', content);
      toast.error('Kon de gegenereerde recepten niet verwerken');
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    // Don't show toast error for timeout as it's already handled
    if (!error.message?.includes('timeout')) {
      console.error('Error in OpenAI API call:', error);
      toast.error('Er ging iets mis bij het genereren van recepten');
    }
    throw error;
  }
}
