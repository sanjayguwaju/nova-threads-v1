'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils/cn'

export function ToastStack() {
  const { toasts, dismissToast } = useUIStore()

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => dismissToast(t.id), 4000))
    return () => timers.forEach(clearTimeout)
  }, [toasts, dismissToast])

  return (
    <div className="fixed top-24 right-16 z-[100] flex flex-col gap-8 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              'pointer-events-auto flex items-center gap-12 px-16 py-12 min-w-[280px] shadow-lg',
              t.type === 'success' && 'bg-success text-paper',
              t.type === 'error' && 'bg-signal text-paper',
              t.type === 'info' && 'bg-ink text-paper'
            )}
          >
            <span className="text-[14px] flex-1">{t.message}</span>
            <button onClick={() => dismissToast(t.id)}><X size={16} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
