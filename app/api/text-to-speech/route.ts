import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'No se recibió texto' },
        { status: 400 }
      );
    }

    // voice puede ser "alloy" (femenina) o "onyx" (masculina)
    const selectedVoice = voice === 'male' ? 'onyx' : 'alloy';

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: selectedVoice,
      input: text,
      speed: 0.9, // Velocidad un poco más lenta para mejor comprensión
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[v0] Error en TTS:', error);
    return NextResponse.json(
      { error: 'Error al generar el audio' },
      { status: 500 }
    );
  }
}
