'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Brain, Lightbulb, HelpCircle, ChevronUp, Loader2, Sparkles } from 'lucide-react'
import { useTaskStore, hintLevels, Message } from '@/store/taskStore'
import { getSokraticResponse } from '@/lib/ai'
import MessageBubble from './MessageBubble'
import HintLevelIndicator from './HintLevelIndicator'

export default function SokratesChat() {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const {
    currentTask,
    messages,
    addMessage,
    updateMessage,
    currentHintLevel,
    incrementHintLevel,
    isProcessing,
    setIsProcessing,
  } = useTaskStore()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Send initial greeting when task is loaded
    if (currentTask && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: `Witaj! Widzę, że masz zadanie z ${currentTask.subject}. Zanim zaczniemy, spójrz na nie uważnie. Co możesz mi powiedzieć o tym zadaniu? Co jest dane, a czego szukamy?`,
      })
    }
  }, [currentTask])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    })

    // Show typing indicator
    setIsProcessing(true)
    setIsTyping(true)

    try {
      // Get AI response
      const response = await getSokraticResponse(
        currentTask!,
        messages,
        userMessage,
        currentHintLevel
      )

      // Simulate typing delay
      const typingDelay = Math.min(response.length * 10, 2000)
      await new Promise(resolve => setTimeout(resolve, typingDelay))

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: response,
        hintLevel: currentHintLevel,
      })
    } catch (error) {
      console.error('Error getting response:', error)
      addMessage({
        role: 'assistant',
        content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
      })
    } finally {
      setIsProcessing(false)
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const requestHint = () => {
    if (currentHintLevel < hintLevels.length - 1) {
      incrementHintLevel()
      addMessage({
        role: 'system',
        content: `🎯 Przechodzimy na poziom wskazówki: ${hintLevels[currentHintLevel + 1].label}`,
      })
    }
  }

  return (
    <div className="flex flex-col h-full card">
      {/* Header */}
      <div className="p-4 border-b border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold">Sokrates AI</h3>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Twój matematyczny mentor
              </p>
            </div>
          </div>
          <HintLevelIndicator />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 text-dark-500 dark:text-dark-400"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-sm">Sokrates myśli...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={requestHint}
              disabled={currentHintLevel >= hintLevels.length - 1}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg
                       bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400
                       hover:bg-accent-200 dark:hover:bg-accent-900/30 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Potrzebuję wskazówki</span>
            </button>
            
            <button
              className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg
                       bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400
                       hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Nie rozumiem</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-dark-500 dark:text-dark-400">
            <Sparkles className="w-3 h-3" />
            <span>Poziom {currentHintLevel + 1}/{hintLevels.length}</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-200 dark:border-dark-800">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napisz swoją odpowiedź lub zadaj pytanie..."
            className="flex-1 input min-h-[80px] max-h-[200px] resize-none"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="self-end btn-primary rounded-full p-3"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <p className="mt-2 text-xs text-dark-500 dark:text-dark-400">
          💡 Wskazówka: Naciśnij Enter aby wysłać, Shift+Enter dla nowej linii
        </p>
      </div>
    </div>
  )
}
