import { NextRequest, NextResponse } from 'next/server';
import { Application } from '~~/types/meritbase/types';
import { randomUUID } from 'crypto';

const getStore = () => {
  if (!(globalThis as any).__merit_applications) (globalThis as any).__merit_applications = new Map<string, Application>();
  return (globalThis as any).__merit_applications as Map<string, Application>;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const application: Application = {
    id: randomUUID(),
    ...body,
    createdAt: Date.now(),
  };
  const store = getStore();
  store.set(application.id, application);
  return NextResponse.json({ ok: true, application });
}

export async function GET() {
  const store = getStore();
  const applications = Array.from(store.values());
  return NextResponse.json({ ok: true, applications });
}
