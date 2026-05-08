
// Google Analytics service
// This service handles all analytics tracking events

import { sanitizeInput } from '@/lib/sanitize';

const isGaAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
};

const sanitizeAnalyticsParams = (params: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string') sanitized[key] = sanitizeInput(value, 1000);
    else if (typeof value === 'number' || typeof value === 'boolean') sanitized[key] = value;
    else sanitized[key] = JSON.stringify(value).slice(0, 1000);
  }
  return sanitized;
};

// Track a custom event
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}): void => {
  if (!eventName || typeof eventName !== 'string') {
    console.error('Invalid event name provided');
    return;
  }
  
  if (isGaAvailable()) {
    try {
      // Add page context to all events
      const enhancedParams = {
        ...sanitizeAnalyticsParams(parameters),
        page_location: window.location.href,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      };
      
      (window as any).gtag('event', eventName, enhancedParams);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
};

// Recipe discovery events
export const trackSupermarketSelection = (supermarketName: string): void => {
  trackEvent('select_supermarket', { supermarket_name: supermarketName });
};

export const trackViewMoreSupermarkets = (): void => {
  trackEvent('view_more_supermarkets');
};

export const trackCuisineSelection = (cuisineName: string): void => {
  trackEvent('select_cuisine', { cuisine_name: cuisineName });
};

export const trackPortionSize = (adults: number, children: number): void => {
  trackEvent('set_portion_size', {
    adults,
    children,
    total_people: adults + children
  });
};

export const trackAddIngredient = (ingredientName: string): void => {
  trackEvent('add_extra_ingredient', { ingredient_name: ingredientName });
};

export const trackGenerateRecipe = (data: {
  protein: string;
  cuisine: string;
  adults: number;
  children: number;
  ingredients: string[];
}): void => {
  trackEvent('generate_recipe', data);
};

// Additional tracking events
export const trackLoadingScreenView = (): void => {
  trackEvent('loading_screen_viewed');
};

export const trackLoadingComplete = (durationInSeconds: number): void => {
  trackEvent('loading_complete', { duration_seconds: durationInSeconds });
};
