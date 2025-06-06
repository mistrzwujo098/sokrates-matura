'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image as ImageIcon, Eraser, Download, Maximize2, X } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import MathRenderer from './MathRenderer'
import DrawingCanvas from './DrawingCanvas'

export default function WorkSpace() {
  const { currentTask, workspaceContent, setWorkspaceContent } = useTaskStore()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'task' | 'notes' | 'drawing'>('task')

  const tabs = [
    { id: 'task' as const, label: 'Zadanie', icon: FileText },
    { id: 'notes' as const, label: 'Notatki', icon: FileText },
    { id: 'drawing' as const, label: 'Rysunek', icon: ImageIcon },
  ]

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <motion.div
      className={`card flex flex-col ${
        isFullscreen 
          ? 'fixed inset-4 z-50' 
          : 'h-full'
      }`}
      layout
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Przestrzeń robocza</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <X className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-200 dark:border-dark-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-4 py-2
              transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'hover:bg-dark-50 dark:hover:bg-dark-800/50'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Task Tab */}
        {activeTab === 'task' && currentTask && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* Task Image */}
              {currentTask.imageUrl && (
                <div className="mb-6">
                  <img
                    src={currentTask.imageUrl}
                    alt="Task"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Task Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MathRenderer content={currentTask.content} />
              </div>

              {/* OCR Result */}
              {currentTask.ocrText && (
                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Rozpoznany tekst (OCR):
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {currentTask.ocrText}
                  </p>
                </div>
              )}

              {/* Task Metadata */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {currentTask.subject}
                </span>
                {currentTask.difficulty && (
                  <span className={`
                    px-3 py-1 text-xs font-medium rounded-full
                    ${currentTask.difficulty === 'easy' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : currentTask.difficulty === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }
                  `}>
                    {currentTask.difficulty === 'easy' ? 'Łatwe' : 
                     currentTask.difficulty === 'medium' ? 'Średnie' : 'Trudne'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="h-full p-4">
            <textarea
              value={workspaceContent}
              onChange={(e) => setWorkspaceContent(e.target.value)}
              placeholder="Tutaj możesz robić notatki, obliczenia, zapisywać pomysły..."
              className="w-full h-full input resize-none font-mono text-sm"
            />
          </div>
        )}

        {/* Drawing Tab */}
        {activeTab === 'drawing' && (
          <div className="h-full">
            <DrawingCanvas />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-dark-200 dark:border-dark-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-500 dark:text-dark-400">
            {activeTab === 'task' && 'Przeanalizuj zadanie dokładnie'}
            {activeTab === 'notes' && 'Twoje notatki są automatycznie zapisywane'}
            {activeTab === 'drawing' && 'Narysuj diagram lub szkic rozwiązania'}
          </p>
          
          {activeTab === 'drawing' && (
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm flex items-center space-x-1">
                <Eraser className="w-4 h-4" />
                <span>Wyczyść</span>
              </button>
              <button className="btn-secondary text-sm flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Pobierz</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
