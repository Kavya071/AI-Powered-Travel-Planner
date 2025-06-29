// src/app/api/generate/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { prompt } = await request.json();

  try {
    const cohereRes = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-xlarge',
        prompt,
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    if (!cohereRes.ok) {
      const text = await cohereRes.text();
      return NextResponse.json({ error: text }, { status: cohereRes.status });
    }

    const data = await cohereRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Cohere proxy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
