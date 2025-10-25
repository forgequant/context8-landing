import { NextResponse } from 'next/server';

/**
 * Health Check API Route
 *
 * Used by Docker healthcheck and monitoring systems
 * Returns 200 OK if the application is healthy
 */

export async function GET() {
  try {
    // Basic health check - app is responding
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || 'unknown',
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: HEAD request for lightweight checks
export async function HEAD() {
  return new Response(null, { status: 200 });
}
