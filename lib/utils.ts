import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function extractLatexExpressions(text: string): string[] {
  const regex = /\$([^$]+)\$/g
  const matches = []
  let match
  
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1])
  }
  
  return matches
}

export function detectMathSubject(text: string): string {
  const subjects = {
    'algebra': ['równanie', 'wielomian', 'funkcja', 'dziedzina', 'zbiór', 'nierówność'],
    'analiza': ['pochodna', 'całka', 'granica', 'ciągłość', 'ekstremum', 'asymptota'],
    'geometria': ['trójkąt', 'okrąg', 'prosta', 'płaszczyzna', 'wektor', 'kąt'],
    'trygonometria': ['sinus', 'cosinus', 'tangens', 'cotangens', 'sin', 'cos', 'tan', 'ctg'],
    'prawdopodobieństwo': ['prawdopodobieństwo', 'zdarzenie', 'losowy', 'kombinatoryka', 'permutacja'],
    'statystyka': ['średnia', 'mediana', 'odchylenie', 'wariancja', 'histogram', 'wykres'],
  }
  
  const lowercaseText = text.toLowerCase()
  let bestMatch = 'matematyka'
  let maxMatches = 0
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword)).length
    if (matches > maxMatches) {
      maxMatches = matches
      bestMatch = subject
    }
  }
  
  return bestMatch
}

export function estimateDifficulty(text: string): 'easy' | 'medium' | 'hard' {
  // Simple heuristic based on complexity indicators
  const complexityIndicators = {
    hard: ['całka', 'pochodna cząstkowa', 'szereg', 'przestrzeń', 'dowód', 'udowodnij'],
    medium: ['pochodna', 'granica', 'równanie różniczkowe', 'macierz', 'wyznacznik'],
    easy: ['oblicz', 'znajdź', 'rozwiąż równanie', 'uprość'],
  }
  
  const lowercaseText = text.toLowerCase()
  
  for (const indicator of complexityIndicators.hard) {
    if (lowercaseText.includes(indicator)) return 'hard'
  }
  
  for (const indicator of complexityIndicators.medium) {
    if (lowercaseText.includes(indicator)) return 'medium'
  }
  
  return 'easy'
}
