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

  const [renderIndex, setRenderIndex] = useState(targetIndex)
  const [transitionOn, setTransitionOn] = useState(false)
  const prevTriggerRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    if (prevTriggerRef.current === trigger) return
    const isInitial = prevTriggerRef.current === null
    prevTriggerRef.current = trigger

    if (isInitial) return
    if (targetIndex === renderIndex) return

    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    const startIdx = renderIndex
    const fullCycles = 3
    const delta = (targetIndex - startIdx + length) % length
    const endIdx = fullCycles * length + delta

    setTransitionOn(false)
    setRenderIndex(startIdx)

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionOn(true)
        setRenderIndex(endIdx)
      })
    })

    const t1 = setTimeout(() => {
      setTransitionOn(false)
      setRenderIndex(targetIndex)
    }, 950)

    timersRef.current.push(t1)

    return () => {
      clearTimeout(t1)
      cancelAnimationFrame(rafId)
    }
  }, [char, trigger, targetIndex])

  const offsetPercent = (renderIndex / length) * 100

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
          transition: transitionOn
            ? 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
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
