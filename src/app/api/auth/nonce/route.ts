import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from 'siwe';
import { saveNonce, getNonce } from '@/lib/nonce-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ message: 'Address is required.' }, { status: 400 });
    }
    const nonce = generateNonce();
    saveNonce(address, nonce); // Save to our in-memory store

    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Failed to generate nonce:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
