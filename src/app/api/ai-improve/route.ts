import { NextRequest, NextResponse } from 'next/server';
import { analyzeBulletPoint } from '@/lib/aiImprover';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bulletText, targetRole } = body;

    if (!bulletText || typeof bulletText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid bulletText string parameter is required.' },
        { status: 400 }
      );
    }

    const analysis = analyzeBulletPoint(bulletText);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      original: bulletText,
      targetRole: targetRole || 'Professional Role',
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate AI bullet improvements.',
      },
      { status: 500 }
    );
  }
}
