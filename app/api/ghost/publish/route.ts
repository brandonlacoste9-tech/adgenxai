/**
 * Ghost Publish API
 * Publishes AI-generated content to Ghost CMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGhostPublisher } from '@/lib/integrations/ghost';

const serverGhostConfig = {
  url: process.env.GHOST_URL || '',
  contentApiKey: process.env.GHOST_CONTENT_API_KEY || '',
  adminApiKey: process.env.GHOST_ADMIN_API_KEY || ''
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, options } = body;

    if (!serverGhostConfig.url || !serverGhostConfig.contentApiKey || !serverGhostConfig.adminApiKey) {
      return NextResponse.json(
        { success: false, error: 'Ghost CMS is not configured on the server' },
        { status: 500 }
      );
    }

    if (!content?.title || !content?.content) {
      return NextResponse.json(
        { success: false, error: 'Missing content title or body' },
        { status: 400 }
      );
    }

    // Create Ghost publisher using secure server-side config
    const publisher = createGhostPublisher(serverGhostConfig);

    // Publish content
    const result = await publisher.publishAIContent(content, options);

    if (result.success) {
      return NextResponse.json({
        success: true,
        postUrl: result.postUrl,
        postId: result.postId,
        message: 'Content published successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: result.error || 'Failed to publish content'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Ghost publish error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
