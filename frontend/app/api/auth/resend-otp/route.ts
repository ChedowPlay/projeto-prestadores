// app/api/auth/resend-otp/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, token } = await request.json();

  try {
    const url = 'https://dev-diboaclub.onrender.com/auth/send-otp';
    const body = token ? { token } : { email };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro no reenvio";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
