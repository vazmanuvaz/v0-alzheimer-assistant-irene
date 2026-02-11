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

    console.log('[v0] Audio file size:', audioFile.size, 'bytes');
    console.log('[v0] Audio file type:', audioFile.type);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
    });

    console.log('[v0] Transcription result:', transcription.text);

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('[v0] Error en STT:', error);
    console.error('[v0] Error message:', error?.message);
    console.error('[v0] Error response:', error?.response?.data);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar el audio' },
      { status: 500 }
    );
  }
}
