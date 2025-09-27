import { NextRequest, NextResponse } from 'next/server';
import { Job, Application } from '~~/types/meritbase/types';
import { randomUUID } from 'crypto';

const getJobs = () => {
  if (!(globalThis as any).__merit_jobs) (globalThis as any).__merit_jobs = new Map<string, Job>();
  return (globalThis as any).__merit_jobs as Map<string, Job>;
};

const getProfiles = () => {
  if (!(globalThis as any).__merit_profiles) (globalThis as any).__merit_profiles = new Map();
  return (globalThis as any).__merit_profiles as Map<string, any>;
};

const getApplications = () => {
  if (!(globalThis as any).__merit_applications) (globalThis as any).__merit_applications = new Map();
  return (globalThis as any).__merit_applications as Map<string, any>;
};

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  const jobs = getJobs();
  const job = jobs.get(jobId);
  if (!job) return NextResponse.json({ ok: false, error: 'Job not found' }, { status: 404 });

  const profiles = Array.from(getProfiles().values());

  // naive matching: count overlaps between requirements and skills/workCategories
  const matches: any[] = [];
  for (const p of profiles) {
    const skills = (p.skills || []).map((s: string) => s.toLowerCase());
    const cats = (p.workCategories || []).map((c: string) => c.toLowerCase());
    const reqs = (job.requirements || []).map((r: string) => r.toLowerCase());
    let score = 0;
    for (const r of reqs) {
      if (skills.includes(r)) score += 2;
      if (cats.includes(r)) score += 1;
    }
    if (score > 0) matches.push({ profile: p, score });
  }

  // sort matches by score desc
  matches.sort((a, b) => b.score - a.score);

  // auto-apply up to 3 best matches
  const applications = [];
  const appStore = getApplications();
  for (let i = 0; i < Math.min(3, matches.length); i++) {
    const m = matches[i];
    const application: Application = {
      id: randomUUID(),
      jobId: job.id,
      applicant: m.profile.address,
      status: 'pending',
      createdAt: Date.now(),
    };
    appStore.set(application.id, application);
    applications.push(application);
  }

  return NextResponse.json({ ok: true, applications, matches });
}
