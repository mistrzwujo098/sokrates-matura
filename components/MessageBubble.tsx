'use client'

import { motion } from 'framer-motion'
import { User, Bot, Info } from 'lucide-react'
import MathRenderer from './MathRenderer'
import { Message } from '@/store/taskStore'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser 
            ? 'bg-primary-100 dark:bg-primary-900/30' 
            : isSystem
            ? 'bg-amber-100 dark:bg-amber-900/30'
            : 'bg-blue-100 dark:bg-blue-900/30'
          }
        `}>
          {isUser ? (
            <User className="w-4 h-4 text-primary-700 dark:text-primary-300" />
          ) : isSystem ? (
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-300" />
          ) : (
            <Bot className="w-4 h-4 text-blue-700 dark:text-blue-300" />
          )}
        </div>

        {/* Message Content */}
        <div className={`
          px-4 py-2 rounded-2xl
          ${isUser 
            ? 'bg-primary-600 text-white' 
            : isSystem
            ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100'
            : 'bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 border border-dark-200 dark:border-dark-700'
          }
        `}>
          <div className={`prose prose-sm ${isUser ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}>
            <MathRenderer content={message.content} />
          </div>
          
          {/* Hint Level Badge */}
          {message.hintLevel !== undefined && !isUser && !isSystem && (
            <div className="mt-2 pt-2 border-t border-dark-200 dark:border-dark-700">
              <span className="text-xs text-dark-500 dark:text-dark-400">
                Poziom wskazówki: {message.hintLevel + 1}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
