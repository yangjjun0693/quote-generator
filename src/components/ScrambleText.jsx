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
  const length = REEL_CHARS.length

  const [position, setPosition] = useState(targetIndex)
  const prevTriggerRef = useRef(null)
  const startTimeoutRef = useRef(null)
  const endTimeoutRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (prevTriggerRef.current === trigger) return
    const isInitial = prevTriggerRef.current === null
    prevTriggerRef.current = trigger

    if (isInitial) return
    if (targetIndex === position) return

    const startIdx = position
    const fullCycles = 3
    const steps = fullCycles * length + ((targetIndex - startIdx + length) % length)
    const duration = 900

    setPosition(startIdx)

    startTimeoutRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => {
        setPosition(steps)
      })
    }, 20)

    endTimeoutRef.current = setTimeout(() => {
      setPosition(targetIndex)
    }, duration + 40)

    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current)
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [char, trigger, targetIndex])

  const offsetPercent = (position / length) * 100

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
          transition: `transform ${900}ms cubic-bezier(0.16, 1, 0.3, 1)`,
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
