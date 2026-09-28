import { NextRequest, NextResponse } from 'next/server';
import { generateLaTeXResume } from '@/lib/latexExporter';
import { defaultResumeVersion } from '@/lib/mockData';
import { StructuredResume } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resumeContent: StructuredResume = body.resumeContent || defaultResumeVersion.content;

    const latexCode = generateLaTeXResume(resumeContent);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      latexCode,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to export LaTeX document.',
      },
      { status: 500 }
    );
  }
}
