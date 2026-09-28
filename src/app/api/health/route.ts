import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Core ATS Resume Checker & Intelligence Platform Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'POST /api/analyze-resume',
      'POST /api/ai-improve',
      'POST /api/export-latex'
    ]
  });
}
