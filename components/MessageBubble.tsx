'use client'

import { motion } from 'framer-motion'
import { Bot, User, Info } from 'lucide-react'
import { Message } from '@/store/taskStore'
import MathRenderer from './MathRenderer'
import { formatDate } from '@/lib/utils'

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
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser 
            ? 'bg-primary-100 dark:bg-primary-900/30' 
            : isSystem
            ? 'bg-accent-100 dark:bg-accent-900/30'
            : 'bg-cyan-100 dark:bg-cyan-900/30'
          }
        `}>
          {isUser ? (
            <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          ) : isSystem ? (
            <Info className="w-4 h-4 text-accent-600 dark:text-accent-400" />
          ) : (
            <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          )}
        </div>

        {/* Message */}
        <div className="space-y-1">
          <div className={`
            rounded-2xl px-4 py-3
            ${isUser 
              ? 'bg-primary-600 text-white' 
              : isSystem
              ? 'bg-accent-50 dark:bg-accent-950/20 text-accent-900 dark:text-accent-100'
              : 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-dark-100'
            }
          `}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MathRenderer content={message.content} />
            </div>
            
            {/* Hint Level Indicator */}
            {message.hintLevel !== undefined && message.hintLevel > 0 && (
              <div className="mt-2 pt-2 border-t border-white/20">
                <p className="text-xs opacity-80">
                  💡 Poziom wskazówki: {message.hintLevel}
                </p>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <p className={`
            text-xs px-2
            ${isUser 
              ? 'text-right text-dark-500 dark:text-dark-400' 
              : 'text-left text-dark-500 dark:text-dark-400'
            }
          `}>
            {formatDate(message.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
