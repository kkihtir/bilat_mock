import { NextRequest, NextResponse } from 'next/server';

/**
 * This API endpoint simulates an OpenAI image generation response
 * In a production application, this would make a real call to OpenAI's API
 * 
 * @param req The request object
 * @returns A simulated OpenAI image response
 */
export async function GET(req: NextRequest) {
  try {
    // Get the query parameter
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query') || '';

    // Log what would happen in production
    console.log(`[API] In production, would call OpenAI API with: "${query}"`);

    // Return temporary redirect to a placeholder image based on a hash of the query
    // This ensures consistent results for the same query
    
    // Create a simple hash from the query string
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      hash = ((hash << 5) - hash) + query.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Use the hash to pick a consistent image for the same query
    const index = Math.abs(hash) % 10;
    
    // Use high-quality professional images (not randomuser.me)
    const professionalImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1559548331-f9cb98280344?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8475f639467?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=300&fit=crop',
      'https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=300&fit=crop',
    ];
    
    // Return the URL through a redirect response
    return NextResponse.redirect(professionalImages[index]);
  } catch (error) {
    console.error('Error in OpenAI placeholder API:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 