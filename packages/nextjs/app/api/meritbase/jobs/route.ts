import { NextRequest, NextResponse } from 'next/server';
import { Job } from '~~/types/meritbase/types';
import { randomUUID } from 'crypto';

const getStore = () => {
  if (!(globalThis as any).__merit_jobs) (globalThis as any).__merit_jobs = new Map<string, Job>();
  return (globalThis as any).__merit_jobs as Map<string, Job>;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const job: Job = {
    id: randomUUID(),
    ...body,
    createdAt: Date.now(),
    status: 'open',
  };
  const store = getStore();
  store.set(job.id, job);
  return NextResponse.json({ ok: true, job });
}

export async function GET() {
  const store = getStore();
  const jobs = Array.from(store.values());
  return NextResponse.json({ ok: true, jobs });
}
