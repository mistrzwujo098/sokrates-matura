'use client'

import { useEffect, useRef, useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Sigma, Divide, X, Square } from 'lucide-react'

interface MathEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const mathSymbols = [
  { symbol: '\\frac{}{}', label: 'Ułamek', cursor: 6 },
  { symbol: 'x^{}', label: 'Potęga', cursor: 3 },
  { symbol: '\\sqrt{}', label: 'Pierwiastek', cursor: 6 },
  { symbol: '\\int_{}^{}', label: 'Całka', cursor: 5 },
  { symbol: '\\sum_{}^{}', label: 'Suma', cursor: 5 },
  { symbol: '\\lim_{}', label: 'Granica', cursor: 5 },
  { symbol: '\\sin()', label: 'Sinus', cursor: 5 },
  { symbol: '\\cos()', label: 'Cosinus', cursor: 5 },
  { symbol: '\\pi', label: 'Pi', cursor: 3 },
  { symbol: '\\infty', label: 'Nieskończoność', cursor: 6 },
  { symbol: '\\alpha', label: 'Alpha', cursor: 6 },
  { symbol: '\\beta', label: 'Beta', cursor: 5 },
]

export default function MathEditor({ value, onChange, placeholder, className }: MathEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showSymbols, setShowSymbols] = useState(false)
  const [renderedMath, setRenderedMath] = useState('')

  useEffect(() => {
    renderMath()
  }, [value])

  const renderMath = () => {
    try {
      // Replace LaTeX delimiters and render each math expression
      const rendered = value.replace(/\$([^$]+)\$/g, (match, math) => {
        try {
          const html = katex.renderToString(math, {
            throwOnError: false,
            displayMode: false,
          })
          return `<span class="math-inline">${html}</span>`
        } catch (e) {
          return match
        }
      })
      setRenderedMath(rendered)
    } catch (error) {
      setRenderedMath(value)
    }
  }

  const insertSymbol = (symbol: string, cursorOffset: number) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const newValue = value.substring(0, start) + symbol + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after symbol insertion
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + cursorOffset
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-close brackets and parentheses
    const pairs: { [key: string]: string } = {
      '(': ')',
      '[': ']',
      '{': '}',
      '$': '$',
    }

    if (pairs[e.key]) {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = 
        value.substring(0, start) + 
        e.key + 
        value.substring(start, end) + 
        pairs[e.key] + 
        value.substring(end)
      onChange(newValue)
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start + 1, start + 1)
        }
      }, 0)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Symbol Toolbar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowSymbols(!showSymbols)}
          className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 
                   hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>Symbole matematyczne</span>
        </button>
      </div>

      {/* Symbol Panel */}
      <AnimatePresence>
        {showSymbols && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 rounded-lg bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700">
              {mathSymbols.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertSymbol(item.symbol, item.cursor)}
                  className="p-2 text-sm rounded-lg bg-white dark:bg-dark-800 hover:bg-dark-100 
                           dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-600 
                           transition-all duration-200 font-mono"
                  title={item.label}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input min-h-[120px] font-mono text-sm resize-none"
          spellCheck={false}
        />
      </div>

      {/* Live Preview */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800"
        >
          <p className="text-xs font-medium text-primary-700 dark:text-primary-300 mb-2">
            Podgląd na żywo:
          </p>
          <div 
            ref={previewRef}
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedMath }}
          />
        </motion.div>
      )}

      {/* Help Text */}
      <p className="text-xs text-dark-500 dark:text-dark-400">
        💡 Wskazówka: Użyj $ dla wzorów inline, np. $x^2$. 
        Naciśnij (, [, {"{"}lub $ aby automatycznie zamknąć nawias.
      </p>
    </div>
  )
}
