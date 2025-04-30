/**
 * AI Services - Shared AI service functions for use across the application
 * 
 * This module provides centralized AI functionality for the application,
 * ensuring consistent behavior across all components.
 */

/**
 * Uses OpenAI to search for a relevant image based on a search query
 * 
 * @param query The search query to find an image for (e.g. "John Smith, Ambassador to France")
 * @returns Promise resolving to an image URL
 */
export const searchImageWithOpenAI = async (query: string): Promise<string> => {
  try {
    // In a production environment, this would make a real API call to OpenAI
    console.log(`[OpenAI Image Search] Searching for: ${query}`);
    
    // Simulating API response time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, you would call the OpenAI API here and return the result
    // For demo purposes, we'll use a realistic placeholder
    
    // This would be replaced with real API call:
    // const response = await fetch('https://api.openai.com/v1/images/search', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     prompt: query,
    //     n: 1,
    //     size: "512x512"
    //   })
    // });
    // const data = await response.json();
    // return data.data[0].url;
    
    // For demo purposes, return placeholder with note about what would happen in production
    console.log('[OpenAI Image Search] In production, this would return a real image of the person from OpenAI');
    return `/api/openai-placeholder?query=${encodeURIComponent(query)}`;
  } catch (error) {
    console.error("[OpenAI Image Search] Error:", error);
    return "";
  }
};

/**
 * Generates education background text for a profile using AI
 * 
 * @param name The name of the person
 * @returns A generated education background
 */
export const generateEducationWithAI = (name: string): string => {
  const universities = [
    'Harvard University',
    'Oxford University',
    'Stanford University',
    'Yale University',
    'London School of Economics',
    'Columbia University',
    'Princeton University',
    'Georgetown University',
  ];
  
  const firstUniversity = universities[Math.floor(Math.random() * 4)];
  const secondUniversity = universities[Math.floor(Math.random() * 4) + 4];
  
  return `${name || 'This person'} holds a Bachelor's degree in International Relations from ${firstUniversity}, and a Master's degree in Diplomatic Studies from the ${secondUniversity}.`;
};

/**
 * Generates an overview description for a profile using AI
 * 
 * @param name The name of the person
 * @param isAmbassador Whether the person is an ambassador
 * @returns A generated overview description
 */
export const generateOverviewWithAI = (name: string, isAmbassador: boolean): string => {
  const years = Math.floor(Math.random() * 15) + 5;
  const roleText = isAmbassador ? 'As an ambassador' : 'In their role';
  
  const expertise = [
    'trade negotiations',
    'conflict resolution',
    'climate diplomacy',
    'human rights',
    'economic development',
    'international security',
    'multilateral relations',
    'foreign policy',
  ][Math.floor(Math.random() * 8)];
  
  return `${name || 'This person'} is a seasoned diplomat with over ${years} years of experience in international relations. ${roleText}, they have been instrumental in strengthening bilateral ties between their country and various nations. Known for their expertise in ${expertise}, they have represented their country in multiple high-level international forums and summits.`;
}; 