import { useState, useEffect, useRef } from 'react'

const REEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?-—'

function findCharIndex(char) {
  if (char === ' ') return REEL_CHARS.indexOf(' ')
  const idx = REEL_CHARS.indexOf(char)
  if (idx !== -1) return idx
  return REEL_CHARS.indexOf(char.toUpperCase()) !== -1
    ? REEL_CHARS.indexOf(char.toUpperCase())
    : 0
}

function RollChar({ char, shouldFlip, direction = 'down' }) {
  const targetIndex = findCharIndex(char)
  const [currentIndex, setCurrentIndex] = useState(targetIndex)
  const [isRolling, setIsRolling] = useState(false)
  const prevShouldFlipRef = useRef(shouldFlip)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const counterRef = useRef(0)

  useEffect(() => {
    if (prevShouldFlipRef.current === shouldFlip) return
    prevShouldFlipRef.current = shouldFlip

    if (targetIndex === currentIndex) return

    setIsRolling(true)
    counterRef.current = 0

    const rollSpeed = 35
    const totalSteps = 18 + targetIndex

    intervalRef.current = setInterval(() => {
      counterRef.current += 1
      const next = direction === 'down'
        ? (currentIndex + counterRef.current) % REEL_CHARS.length
        : (currentIndex - counterRef.current + REEL_CHARS.length * 10) % REEL_CHARS.length
      setCurrentIndex(next)
    }, rollSpeed)

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current)
      setCurrentIndex(targetIndex)
      setIsRolling(false)
    }, totalSteps * rollSpeed + 50)

    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [char, shouldFlip, targetIndex])

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
          transition: isRolling
            ? 'transform 0s linear'
            : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {REEL_CHARS.split('').map((c, i) => (
          <span
            key={i}
            className="flex items-center justify-center leading-[1.1em]"
            style={{ height: '1.1em' }}
          >
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
      </span>
    </span>
  )
}

export function FidsText({ text, trigger, className = '', as: Component = 'span', direction = 'down' }) {
  const chars = [...text]
  return (
    <Component className={className} aria-label={text}>
      {chars.map((char, i) => (
        <RollChar key={`${trigger}-${i}`} char={char} shouldFlip={trigger} direction={direction} />
      ))}
    </Component>
  )
}
