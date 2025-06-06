import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Inicjalizacja OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // Sprawdzenie klucza API
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Brak konfiguracji API' },
        { status: 500 }
      )
    }

    const { task, messages, userMessage, hintLevel } = await req.json()

    // Walidacja danych
    if (!task || !userMessage) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    // Przygotowanie systemowego promptu
    const systemPrompt = `Jesteś Sokratesem - mądrym nauczycielem matematyki używającym metody majeutycznej.
    
ZADANIE: ${task.content}
Odpowiedź: ${task.answer || 'Nieznana'}
Rozwiązanie: ${task.solution || 'Brak'}

POZIOM WSKAZÓWKI: ${hintLevel}
- 0: Pytania naprowadzające, zero konkretów
- 1: Delikatne sugestie kierunku myślenia
- 2: Konkretne wskazówki co do metody
- 3: Częściowe rozwiązanie z wyjaśnieniem
- 4: Pełne rozwiązanie krok po kroku

ZASADY:
1. NIGDY nie podawaj gotowej odpowiedzi na początku
2. Zadawaj pytania naprowadzające
3. Buduj zrozumienie krok po kroku
4. Chwal za dobre myślenie
5. Używaj matematycznego formatu gdy to konieczne
6. Bądź cierpliwy i wspierający`

    // Przygotowanie historii konwersacji
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    // Wywołanie API OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 
      'Przepraszam, nie mogę teraz odpowiedzieć.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Błąd API:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania' },
      { status: 500 }
    )
  }
}
