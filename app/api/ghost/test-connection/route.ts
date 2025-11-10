/**
 * Ghost Connection Test API
 * Tests connectivity to a Ghost site
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGhostClient } from '@/lib/integrations/ghost';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, contentApiKey, adminApiKey } = body;

    // Validate required fields
    if (!url || !contentApiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: url and contentApiKey' },
        { status: 400 }
      );
    }

    // Create Ghost client
    const client = createGhostClient({
      url,
      contentApiKey,
      adminApiKey
    });

    // Test connection
    const result = await client.testConnection();

    if (result.success) {
      const siteInfo = await client.getSiteInfo();
      
      return NextResponse.json({
        success: true,
        message: result.message,
        siteName: siteInfo.success ? siteInfo.settings?.title : undefined,
        version: result.version
      });
    }

    return NextResponse.json({
      success: false,
      error: result.message || 'Failed to connect to Ghost'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Ghost connection test error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
