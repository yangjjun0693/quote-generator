import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~'

function getRandomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export function useScramble(text, options = {}) {
  const {
    duration = 600,
    speed = 30,
    startDelay = 0,
  } = options

  const [displayText, setDisplayText] = useState(text)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const targetTextRef = useRef(text)

  useEffect(() => {
    targetTextRef.current = text

    if (!text) {
      setDisplayText('')
      return
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + startDelay
      }

      const elapsed = timestamp - startTimeRef.current

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      const target = targetTextRef.current

      let result = ''
      for (let i = 0; i < target.length; i++) {
        const charProgress = (progress * target.length) - i
        if (charProgress >= 1) {
          result += target[i]
        } else if (charProgress > 0) {
          result += getRandomChar()
        } else {
          result += target[i]
        }
      }

      setDisplayText(result)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayText(target)
        startTimeRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startTimeRef.current = null
    }
  }, [text, duration, startDelay])

  return displayText
}

export function ScrambleText({ text, className = '', as: Component = 'span' }) {
  const displayText = useScramble(text, { duration: 700 })
  return <Component className={className}>{displayText}</Component>
}
