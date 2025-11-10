/**
 * Ghost Publish API
 * Publishes AI-generated content to Ghost CMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGhostPublisher } from '@/lib/integrations/ghost';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      config,
      content,
      options 
    } = body;

    // Validate required fields
    if (!config?.url || !config?.contentApiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Ghost configuration' },
        { status: 400 }
      );
    }

    if (!content?.title || !content?.content) {
      return NextResponse.json(
        { success: false, error: 'Missing content title or body' },
        { status: 400 }
      );
    }

    // Create Ghost publisher
    const publisher = createGhostPublisher(config);

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
