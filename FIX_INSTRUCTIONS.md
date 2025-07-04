# Instrukcja naprawy błędów TypeScript

## Problem 1: Brak deklaracji typów dla react-katex
Vercel nie mógł zbudować projektu z powodu braku deklaracji typów dla modułu 'react-katex'.

## Rozwiązanie problemu 1
Wykonałem następujące kroki:

1. **Dodałem @types/react-katex do package.json**
   - W pliku `package.json` w sekcji `devDependencies` dodałem: `"@types/react-katex": "^3.0.0"`

2. **Utworzyłem zapasowe rozwiązanie - własne typy**
   - Utworzyłem folder `types/`
   - Dodałem plik `types/react-katex.d.ts` z deklaracjami typów
   - Zaktualizowałem `tsconfig.json` aby uwzględnić folder `types/`

## Problem 2: Niezgodność typu dla pola 'type' w obiekcie Task
TypeScript zgłaszał błąd w pliku `components/TaskInput.tsx` - pole `type` było rozpoznawane jako `string` zamiast union type `'text' | 'image' | 'mixed'`.

## Rozwiązanie problemu 2

1. **Zaimportowałem typ Task**
   - Zmieniłem: `import { useTaskStore } from '@/store/taskStore'`
   - Na: `import { useTaskStore, Task } from '@/store/taskStore'`

2. **Dodałem explicit type annotation**
   - Zmieniłem: `const newTask = { ... }`
   - Na: `const newTask: Task = { ... }`
   - Usunąłem niepotrzebne `as const`

## Co teraz musisz zrobić

1. **Lokalnie:**
   ```bash
   npm install
   npm run build
   ```
   
2. **Sprawdź czy build przechodzi lokalnie**

3. **Zacommituj zmiany:**
   ```bash
   git add .
   git commit -m "Fix: Add TypeScript types for react-katex"
   git push
   ```

4. **Vercel automatycznie zbuduje projekt ponownie**

## Dlaczego to rozwiązanie działa?

- TypeScript wymaga deklaracji typów dla wszystkich importowanych modułów
- Pakiet `react-katex` nie zawiera wbudowanych typów TypeScript
- Dodanie `@types/react-katex` dostarcza te brakujące typy
- Zapasowe rozwiązanie (folder `types/`) gwarantuje, że projekt się zbuduje nawet jeśli pakiet @types nie istnieje

## Dodatkowe uwagi

- Upewnij się, że masz najnowszą wersję package-lock.json po uruchomieniu `npm install`
- Jeśli problem nadal występuje, sprawdź logi Vercel dla dokładniejszych informacji
