import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Task {
  id: string
  content: string
  type: 'text' | 'image' | 'mixed'
  imageUrl?: string
  ocrText?: string
  latex?: string
  subject: string
  difficulty?: 'easy' | 'medium' | 'hard'
  createdAt: Date
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  hintLevel?: number
  isTyping?: boolean
}

export interface HintLevel {
  level: number
  label: string
  description: string
}

interface TaskStore {
  // Current task
  currentTask: Task | null
  setCurrentTask: (task: Task | null) => void
  
  // Task history
  taskHistory: Task[]
  addTaskToHistory: (task: Task) => void
  clearHistory: () => void
  
  // Chat messages
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  clearMessages: () => void
  
  // Hint system
  currentHintLevel: number
  incrementHintLevel: () => void
  resetHintLevel: () => void
  maxHintLevel: number
  
  // UI state
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  
  // Work space
  workspaceContent: string
  setWorkspaceContent: (content: string) => void
  
  // User progress
  solvedTasks: number
  incrementSolvedTasks: () => void
  
  // Analytics
  totalHintsUsed: number
  incrementHintsUsed: () => void
}

export const hintLevels: HintLevel[] = [
  { level: 0, label: 'Start', description: 'Zacznij od analizy zadania' },
  { level: 1, label: 'Ogólne pytanie', description: 'Co jest dane w zadaniu?' },
  { level: 2, label: 'Naprowadzenie', description: 'Jaką metodę możesz zastosować?' },
  { level: 3, label: 'Konkretna wskazówka', description: 'Spróbuj użyć tego wzoru...' },
  { level: 4, label: 'Krok po kroku', description: 'Rozwiążmy to razem' },
]

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Current task
        currentTask: null,
        setCurrentTask: (task) => set({ currentTask: task, currentHintLevel: 0 }),
        
        // Task history
        taskHistory: [],
        addTaskToHistory: (task) => 
          set((state) => ({ 
            taskHistory: [...state.taskHistory, task].slice(-50) // Keep last 50 tasks
          })),
        clearHistory: () => set({ taskHistory: [] }),
        
        // Chat messages
        messages: [],
        addMessage: (message) => 
          set((state) => ({ 
            messages: [...state.messages, {
              ...message,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: new Date()
            }]
          })),
        updateMessage: (id, updates) =>
          set((state) => ({
            messages: state.messages.map(msg => 
              msg.id === id ? { ...msg, ...updates } : msg
            )
          })),
        clearMessages: () => set({ messages: [] }),
        
        // Hint system
        currentHintLevel: 0,
        incrementHintLevel: () => 
          set((state) => ({ 
            currentHintLevel: Math.min(state.currentHintLevel + 1, state.maxHintLevel),
            totalHintsUsed: state.totalHintsUsed + 1
          })),
        resetHintLevel: () => set({ currentHintLevel: 0 }),
        maxHintLevel: hintLevels.length - 1,
        
        // UI state
        isProcessing: false,
        setIsProcessing: (value) => set({ isProcessing: value }),
        
        // Work space
        workspaceContent: '',
        setWorkspaceContent: (content) => set({ workspaceContent: content }),
        
        // User progress
        solvedTasks: 0,
        incrementSolvedTasks: () => 
          set((state) => ({ solvedTasks: state.solvedTasks + 1 })),
        
        // Analytics
        totalHintsUsed: 0,
        incrementHintsUsed: () => 
          set((state) => ({ totalHintsUsed: state.totalHintsUsed + 1 })),
      }),
      {
        name: 'sokrates-matura-storage',
        partialize: (state) => ({
          taskHistory: state.taskHistory,
          solvedTasks: state.solvedTasks,
          totalHintsUsed: state.totalHintsUsed,
        }),
      }
    )
  )
)
