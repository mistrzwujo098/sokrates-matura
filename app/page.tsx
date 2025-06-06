'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import TaskInput from '@/components/TaskInput'
import SokratesChat from '@/components/SokratesChat'
import WorkSpace from '@/components/WorkSpace'
import { useTaskStore } from '@/store/taskStore'
import { Brain, Sparkles, BookOpen, Target } from 'lucide-react'

export default function Home() {
  const [isStarted, setIsStarted] = useState(false)
  const { currentTask } = useTaskStore()

  const features = [
    {
      icon: Brain,
      title: 'Metoda Sokratesa',
      description: 'Uczysz się przez pytania, nie gotowe odpowiedzi'
    },
    {
      icon: Sparkles,
      title: 'AI na poziomie 12/10',
      description: 'Inteligentny asystent, który naprawdę Cię rozumie'
    },
    {
      icon: BookOpen,
      title: 'Wszystkie działy',
      description: 'Od algebry po analizę - jesteśmy przy Tobie'
    },
    {
      icon: Target,
      title: 'Skuteczność',
      description: 'Metoda sprawdzona przez tysiące maturzystów'
    }
  ]

  if (!isStarted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary-600 to-cyan-600 opacity-30" />
                  <h1 className="relative text-6xl md:text-7xl font-bold mb-6">
                    <span className="gradient-text">SokratesMatura</span>
                  </h1>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xl md:text-2xl text-dark-600 dark:text-dark-300 mb-8 max-w-3xl mx-auto"
              >
                Inteligentny asystent, który uczy Cię myśleć, nie tylko rozwiązywać.
                Metoda Sokratesa w wydaniu AI.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onClick={() => setIsStarted(true)}
                className="btn-primary text-lg px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Rozpocznij naukę
              </motion.button>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="card p-6 text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900/30 dark:to-cyan-900/30 group-hover:from-primary-200 group-hover:to-cyan-200 dark:group-hover:from-primary-800/30 dark:group-hover:to-cyan-800/30 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Demo Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="card p-8 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-950/50 dark:to-cyan-950/50"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Zobacz jak to działa</h2>
              <div className="aspect-video rounded-xl bg-dark-900 flex items-center justify-center">
                <p className="text-white/60">Demo wideo (coming soon)</p>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!currentTask ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <TaskInput />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <WorkSpace />
              <SokratesChat />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
