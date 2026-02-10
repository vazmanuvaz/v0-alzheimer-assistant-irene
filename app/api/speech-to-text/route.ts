import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No se recibió archivo de audio' },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('[v0] Error en STT:', error);
    return NextResponse.json(
      { error: 'Error al procesar el audio' },
      { status: 500 }
    );
  }
}
