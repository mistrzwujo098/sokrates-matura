'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Eraser, 
  Download, 
  Undo, 
  Redo, 
  Palette,
  PenTool,
  Circle,
  Square,
  Triangle
} from 'lucide-react'

interface DrawingCanvasProps {
  onSave?: (dataUrl: string) => void
  className?: string
}

type Tool = 'pen' | 'eraser' | 'circle' | 'square' | 'triangle'

export default function DrawingCanvas({ onSave, className = '' }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#1e40af')
  const [lineWidth, setLineWidth] = useState(2)
  const [tool, setTool] = useState<Tool>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial style
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Save initial state
    saveToHistory()
  }, [])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = color
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const undo = () => {
    if (historyStep <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep - 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const redo = () => {
    if (historyStep >= history.length - 1) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep + 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'szkic-matematyczny.png'
    link.href = dataUrl
    link.click()

    if (onSave) {
      onSave(dataUrl)
    }
  }

  const colors = ['#1e40af', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', '#0d9488', '#000000']

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-900 rounded-lg shadow-sm">
        {/* Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded ${tool === 'pen' ? 'bg-primary-100 dark:bg-primary-900' : ''}`}
            title="Rysuj"
          >
            <PenTool className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-primary-100 dark:bg-primary-900' : ''}`}
            title="Gumka"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2" />
          
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-2 rounded disabled:opacity-50"
            title="Cofnij"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded disabled:opacity-50"
            title="Ponów"
          >
            <Redo className="w-5 h-5" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === c ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Line Width */}
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-4">{lineWidth}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={clearCanvas}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            title="Wyczyść"
          >
            Wyczyść
          </button>
          <button
            onClick={downloadCanvas}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
            title="Pobierz"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <motion.canvas
        ref={canvasRef}
        className="w-full h-96 bg-white dark:bg-dark-800 rounded-lg shadow-inner cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
