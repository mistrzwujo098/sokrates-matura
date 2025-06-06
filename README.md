# SokratesMatura - Inteligentny Asystent Matematyczny

Aplikacja wykorzystująca metodę sokratejską do nauki matematyki, stworzona dla maturzystów.

## 🚀 Uruchomienie lokalne

### 1. Instalacja zależności
```bash
npm install
```

**Uwaga**: Po aktualizacji package.json (np. dodaniu nowych typów) konieczne jest ponowne uruchomienie:
```bash
npm install
```

### 2. Konfiguracja API
1. Skopiuj plik `.env.example` do `.env.local`
2. Wpisz swój klucz API OpenAI (wymagany)
3. Opcjonalnie dodaj klucze Supabase dla trwałości danych

### 3. Uruchomienie aplikacji
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🌐 Deployment

### Deployment na Vercel (zalecany)
1. Wgraj projekt na GitHub
2. Połącz z Vercel
3. Dodaj zmienne środowiskowe w panelu Vercel:
   - `OPENAI_API_KEY` - twój klucz API

### Deployment na tiiny.host
**UWAGA**: tiiny.host jest przeznaczony dla statycznych stron HTML. 
Ta aplikacja wymaga serwera Node.js, więc **NIE będzie działać na tiiny.host**.

Alternatywy:
- Vercel (darmowy dla projektów osobistych)
- Netlify (z funkcjami)
- Railway.app
- Render.com

## 🔐 Bezpieczeństwo

### Zabezpieczenie klucza API:
1. **NIGDY** nie umieszczaj klucza API w kodzie źródłowym
2. Używaj zmiennych środowiskowych (.env.local)
3. Klucz jest używany tylko po stronie serwera (API routes)
4. Dodaj limity użycia w panelu OpenAI
5. Rozważ dodanie autoryzacji użytkowników

### Dodatkowe zabezpieczenia (opcjonalne):
```typescript
// W app/api/sokrates/route.ts możesz dodać:

// Rate limiting
import { rateLimit } from '@/lib/rate-limit'

// CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST',
}

// Autoryzacja
const authToken = req.headers.get('Authorization')
if (!authToken || authToken !== `Bearer ${process.env.API_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## 📁 Struktura projektu
```
SokratesMatura/
├── app/
│   ├── api/
│   │   └── sokrates/
│   │       └── route.ts      # API endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SokratesChat.tsx      # Główny komponent czatu
│   ├── HintLevelIndicator.tsx # Wskaźnik poziomu wskazówek
│   └── ...
├── lib/
│   ├── ai.ts                 # Komunikacja z API
│   └── ...
├── types/
│   └── react-katex.d.ts    # Własne deklaracje typów
├── .env.local               # Twoje klucze API (nie commituj!)
└── .env.example             # Przykład konfiguracji
```

## ⚙️ Konfiguracja produkcyjna

Przed deploymentem:
1. Ustaw odpowiedni model GPT w `app/api/sokrates/route.ts`
2. Dodaj rate limiting
3. Skonfiguruj CORS
4. Rozważ cache dla powtarzalnych zapytań
5. Monitoruj użycie API w panelu OpenAI

## 📝 Licencja
MIT
