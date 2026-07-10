import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // We only validate the request here. 
    // The actual inference is expected to happen client-side via TFJS.
    // This endpoint serves as a structural placeholder for future Server-Side Inference
    // using @tensorflow/tfjs-node if required.
    
    const body = await req.json();
    
    if (!body || !body.history || !Array.isArray(body.history)) {
      return NextResponse.json({ error: 'Invalid payload: expected history array' }, { status: 400 });
    }

    if (body.history.length < 48) {
      return NextResponse.json({ error: `Insufficient data: expected 48 readings, got ${body.history.length}` }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Server-side inference is currently disabled. Please run predictions client-side using lib/flood-model.ts',
      status: 'pending_implementation'
    }, { status: 501 });

  } catch (error) {
    console.error("API Error in /api/flood-predict:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
