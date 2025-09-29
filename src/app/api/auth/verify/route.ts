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
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
    });

    if (fields.nonce !== session.nonce) {
      return NextResponse.json({ message: 'Invalid nonce.' }, { status: 422 });
    }

    session.siwe = fields;
    await session.save();

    return NextResponse.json({ ok: true, address: fields.address });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
