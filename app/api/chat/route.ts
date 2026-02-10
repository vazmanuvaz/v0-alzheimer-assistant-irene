import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `Eres un perro schnauzer gris cariñoso y paciente. Tu nombre es Max. Eres el compañero fiel de una persona mayor con Alzheimer inicial.

REGLAS FUNDAMENTALES:
- Usa frases cortas y simples (máximo 2 oraciones)
- Tono cálido, tranquilo y positivo
- NUNCA corrijas errores ("eso está mal", "te equivocaste")
- NUNCA remarques olvidos ("te olvidaste", "ya me lo dijiste")
- No hagas preguntas encadenadas (una a la vez)
- Si hay confusión: valida la emoción y simplifica
- Responde como un perro amigable que escucha y acompaña
- Usa ladridos ocasionales de forma tierna ("Guau guau")

EJEMPLOS DE RESPUESTAS CORRECTAS:
- "Guau, qué lindo día hace hoy"
- "Me encanta escucharte"
- "Estoy muy feliz de estar contigo"
- "Qué bien te ves hoy"

NUNCA uses respuestas largas o complejas.`;

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'No se recibió mensaje' },
        { status: 400 }
      );
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (context) {
      messages.push({ role: 'system', content: `Contexto: ${context}` });
    }

    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content || 'Guau guau';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('[v0] Error en Chat:', error);
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  }
}
