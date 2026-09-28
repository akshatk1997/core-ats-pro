import { NextRequest, NextResponse } from 'next/server';
import { calculateATSScore } from '@/lib/atsEngine';
import { matchResumeToJob } from '@/lib/jobMatcher';
import { sampleJobDescription, defaultResumeVersion } from '@/lib/mockData';
import { StructuredResume, JobDescription } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resumeContent: StructuredResume = body.resumeContent || defaultResumeVersion.content;
    const targetJob: JobDescription = body.targetJob || sampleJobDescription;

    const { breakdown, issues } = calculateATSScore(resumeContent, targetJob);
    const jobMatch = matchResumeToJob(resumeContent, targetJob);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      atsScore: breakdown.overall,
      breakdown,
      issues,
      jobMatch,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process resume analysis request.',
      },
      { status: 500 }
    );
  }
}
