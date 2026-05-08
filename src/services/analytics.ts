
// Google Analytics service
// This service handles all analytics tracking events

// Check if Google Analytics is loaded
const isGaAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
};

// Validate analytics parameters to prevent injection
const sanitizeAnalyticsParams = (params: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(params)) {
    // Skip null or undefined values
    if (value === null || value === undefined) {
      continue;
    }
    
    // Sanitize strings to prevent XSS
    if (typeof value === 'string') {
      sanitized[key] = value
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .slice(0, 1000); // Limit string length
    }
    // Handle numbers directly
    else if (typeof value === 'number') {
      sanitized[key] = value;
    }
    // Handle booleans directly
    else if (typeof value === 'boolean') {
      sanitized[key] = value;
    }
    // For objects and arrays, convert to string to be safe
    else {
      sanitized[key] = JSON.stringify(value).slice(0, 1000);
    }
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
      console.log(`Analytics: ${eventName}`, enhancedParams);
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
