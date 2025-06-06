'use client'

import { useTaskStore, hintLevels } from '@/store/taskStore'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function HintLevelIndicator() {
  const { currentHintLevel } = useTaskStore()
  const currentLevel = hintLevels[currentHintLevel]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 
                 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800"
    >
      <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
        {currentLevel.label}
      </span>
      <div className="flex space-x-1">
        {hintLevels.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentHintLevel
                ? 'bg-primary-500 dark:bg-primary-400'
                : 'bg-dark-300 dark:bg-dark-700'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}
