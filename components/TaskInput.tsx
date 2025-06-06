'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, Type, Wand2, Loader2, X } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import MathEditor from './MathEditor'
import { processImage } from '@/lib/ocr'
import { generateTaskId } from '@/lib/utils'
import Image from 'next/image'

type InputMode = 'upload' | 'text' | 'camera'

export default function TaskInput() {
  const [inputMode, setInputMode] = useState<InputMode>('upload')
  const [taskText, setTaskText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<string>('')
  
  const { setCurrentTask, addTaskToHistory, setIsProcessing: setGlobalProcessing } = useTaskStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  })

  const processImageWithOCR = async () => {
    if (!imageFile) return

    setIsProcessing(true)
    setGlobalProcessing(true)

    try {
      const text = await processImage(imageFile)
      setOcrResult(text)
      setTaskText(text)
      
      // Automatically switch to text mode to allow editing
      setInputMode('text')
    } catch (error) {
      console.error('OCR failed:', error)
      // Show error toast here
    } finally {
      setIsProcessing(false)
      setGlobalProcessing(false)
    }
  }

  const handleSubmit = () => {
    if (!taskText.trim() && !imagePreview) return

    const newTask = {
      id: generateTaskId(),
      content: taskText,
      type: imagePreview ? 'mixed' : 'text' as const,
      imageUrl: imagePreview || undefined,
      ocrText: ocrResult || undefined,
      subject: 'matematyka',
      createdAt: new Date()
    }

    setCurrentTask(newTask)
    addTaskToHistory(newTask)
    
    // Reset form
    setTaskText('')
    setImageFile(null)
    setImagePreview(null)
    setOcrResult('')
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setOcrResult('')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
          Wprowadź zadanie matematyczne
        </h2>

        {/* Input Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-dark-100 dark:bg-dark-800 p-1">
            {[
              { mode: 'upload' as const, icon: Upload, label: 'Wgraj zdjęcie' },
              { mode: 'text' as const, icon: Type, label: 'Wpisz tekst' },
              { mode: 'camera' as const, icon: Camera, label: 'Zrób zdjęcie' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${inputMode === mode 
                    ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-md' 
                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-dark-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Upload Mode */}
          {inputMode === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {!imagePreview ? (
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragActive 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
                      : 'border-dark-300 dark:border-dark-700 hover:border-primary-400'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-dark-400" />
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Upuść tutaj' : 'Przeciągnij zdjęcie zadania'}
                  </p>
                  <p className="text-sm text-dark-500">
                    lub kliknij, aby wybrać plik
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Uploaded task"
                      className="w-full h-auto max-h-96 object-contain bg-dark-50 dark:bg-dark-900"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={processImageWithOCR}
                    disabled={isProcessing}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Rozpoznawanie tekstu...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Rozpoznaj tekst (OCR)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Text Mode */}
          {inputMode === 'text' && (
            <motion.div
              key="text"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <MathEditor
                value={taskText}
                onChange={setTaskText}
                placeholder="Wpisz treść zadania. Używaj LaTeX dla wzorów matematycznych, np. $x^2 + 2x + 1 = 0$"
              />
              
              {ocrResult && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✨ Tekst rozpoznany z obrazu. Możesz go edytować powyżej.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Camera Mode */}
          {inputMode === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12"
            >
              <Camera className="w-16 h-16 mx-auto mb-4 text-dark-400" />
              <p className="text-lg font-medium mb-2">Funkcja aparatu</p>
              <p className="text-sm text-dark-500">
                Wkrótce będziesz mógł zrobić zdjęcie bezpośrednio z aplikacji
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image preview in text mode */}
        {inputMode === 'text' && imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-sm text-dark-500 mb-2">Załączone zdjęcie:</p>
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Attached task"
                className="h-24 w-auto rounded-lg border border-dark-200 dark:border-dark-700"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={handleSubmit}
            disabled={!taskText.trim() && !imagePreview}
            className={`
              btn-primary flex items-center space-x-2
              ${(!taskText.trim() && !imagePreview) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Wand2 className="w-5 h-5" />
            <span>Rozpocznij naukę</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-dark-500 dark:text-dark-400">
          Lub wybierz jedno z przykładowych zadań:
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            'Oblicz pochodną funkcji $f(x) = x^3 - 3x^2 + 2$',
            'Rozwiąż równanie $\\sin(2x) = \\frac{1}{2}$ dla $x \\in [0, 2\\pi]$',
            'Znajdź granicę $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$',
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setTaskText(example)
                setInputMode('text')
              }}
              className="px-4 py-2 text-sm rounded-lg bg-dark-100 dark:bg-dark-800 
                       hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
            >
              Przykład {index + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
