'use client'
import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [dir, setDir] = useState<'up' | 'down'>('up')
  const [atTop, setAtTop] = useState(true)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setAtTop(y < 10)
      if (Math.abs(y - last) < 10) return
      setDir(y > last ? 'down' : 'up')
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return { dir, atTop }
}
