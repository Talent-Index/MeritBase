import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '~~/types/meritbase/types';

const getStore = () => {
  if (!(globalThis as any).__merit_profiles) (globalThis as any).__merit_profiles = new Map<string, Profile>();
  return (globalThis as any).__merit_profiles as Map<string, Profile>;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const profile: Profile = {
    ...body,
    createdAt: Date.now(),
  };
  const store = getStore();
  store.set(profile.address.toLowerCase(), profile);
  return NextResponse.json({ ok: true, profile });
}

export async function GET() {
  const store = getStore();
  const profiles = Array.from(store.values());
  return NextResponse.json({ ok: true, profiles });
}
