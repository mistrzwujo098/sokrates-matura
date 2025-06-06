import { Task, Message, HintLevel } from '@/store/taskStore'

export async function getSokraticResponse(
  task: Task,
  messages: Message[],
  userMessage: string,
  hintLevel: number
): Promise<string> {
  try {
    const response = await fetch('/api/sokrates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        messages,
        userMessage,
        hintLevel,
      }),
    })

    if (!response.ok) {
      throw new Error('Błąd połączenia z API')
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data.response
  } catch (error) {
    console.error('Błąd pobierania odpowiedzi:', error)
    throw error
  }
}
