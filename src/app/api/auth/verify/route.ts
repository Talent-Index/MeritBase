import { SiweMessage } from 'siwe';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    const { data } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (data.nonce !== session.nonce) {
      return NextResponse.json({ message: 'Invalid nonce.' }, { status: 422 });
    }

    session.siwe = data;
    await session.save();

    return NextResponse.json({ ok: true, address: data.address });
  } catch (error: any) {
    console.error("Verification Error:", error);
    if (error instanceof Error && error.message.includes('signature')) {
       return NextResponse.json(
        { ok: false, message: `Verification failed: ${error.message}` },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { ok: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
