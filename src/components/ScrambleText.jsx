import { useState, useEffect, useRef } from 'react'

const REEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?-—'

function findCharIndex(char) {
  if (char === ' ') return REEL_CHARS.indexOf(' ')
  const idx = REEL_CHARS.indexOf(char)
  if (idx !== -1) return idx
  const upperIdx = REEL_CHARS.indexOf(char.toUpperCase())
  return upperIdx !== -1 ? upperIdx : 0
}

function RollChar({ char, trigger }) {
  const targetIndex = findCharIndex(char)
  const [currentIndex, setCurrentIndex] = useState(targetIndex)
  const prevTriggerRef = useRef(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const counterRef = useRef(0)
  const startIndexRef = useRef(targetIndex)

  useEffect(() => {
    if (prevTriggerRef.current === trigger) return
    const isInitial = prevTriggerRef.current === null
    prevTriggerRef.current = trigger

    if (isInitial) {
      startIndexRef.current = targetIndex
      return
    }

    if (targetIndex === startIndexRef.current) {
      startIndexRef.current = targetIndex
      return
    }

    const startIdx = startIndexRef.current
    startIndexRef.current = targetIndex
    counterRef.current = 0
    setCurrentIndex(startIdx)

    const rollSpeed = 40
    const totalSteps = 16

    intervalRef.current = setInterval(() => {
      counterRef.current += 1
      const next = (startIdx + counterRef.current) % REEL_CHARS.length
      setCurrentIndex(next)
    }, rollSpeed)

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setCurrentIndex(targetIndex)
    }, totalSteps * rollSpeed + 30)

    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [char, trigger, targetIndex])

  const offsetPercent = (currentIndex / REEL_CHARS.length) * 100

  return (
    <span
      className="relative inline-block overflow-hidden align-middle"
      style={{ width: '0.62em', height: '1.1em' }}
      aria-hidden="true"
    >
      <span
        className="absolute left-0 right-0 flex flex-col"
        style={{
          transform: `translateY(-${offsetPercent}%)`,
          transition: 'none',
          willChange: 'transform',
        }}
      >
        {REEL_CHARS.split('').map((c, i) => (
          <span
            key={i}
            className="flex items-center justify-center"
            style={{ height: '1.1em', lineHeight: '1.1em' }}
          >
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
      </span>
    </span>
  )
}

export function FidsText({ text, trigger, className = '', as: Component = 'span' }) {
  const chars = [...text]
  return (
    <Component className={className} aria-label={text}>
      {chars.map((char, i) => (
        <RollChar key={i} char={char} trigger={trigger} />
      ))}
    </Component>
  )
}
