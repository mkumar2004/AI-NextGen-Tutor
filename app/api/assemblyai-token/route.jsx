import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://api.assemblyai.com/v2/realtime/token', {
    method: 'POST',
    headers: {
      'authorization': process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
    },
    body: JSON.stringify({ expires_in: 3600 })
  });
  
  const data = await response.json();
  return NextResponse.json({ token: data.token });
}
