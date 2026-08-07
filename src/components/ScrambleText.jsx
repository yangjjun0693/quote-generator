import { useState, useEffect, useRef } from 'react'

function FlipChar({ char, shouldFlip }) {
  const [displayChar, setDisplayChar] = useState(char)
  const [nextChar, setNextChar] = useState(char)
  const [flipping, setFlipping] = useState(false)
  const prevShouldFlipRef = useRef(shouldFlip)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (prevShouldFlipRef.current === shouldFlip) {
      setDisplayChar(char)
      setNextChar(char)
      return
    }
    prevShouldFlipRef.current = shouldFlip

    if (char === displayChar) {
      setDisplayChar(char)
      setNextChar(char)
      return
    }

    setNextChar(char)
    setFlipping(true)

    timeoutRef.current = setTimeout(() => {
      setDisplayChar(char)
      setFlipping(false)
    }, 350)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [char, shouldFlip])

  if (char === ' ' && displayChar === ' ') {
    return <span className="inline-block w-[0.4em]" aria-hidden="true">&nbsp;</span>
  }

  return (
    <span className="relative inline-block align-middle" style={{ width: '0.62em', height: '1.1em' }}>
      <span className="invisible block leading-[1.1em]">M</span>

      <span
        className="absolute inset-0 flex items-center justify-center leading-[1.1em]"
        style={{
          transform: flipping ? 'rotateX(-90deg)' : 'rotateX(0deg)',
          transformOrigin: 'center center',
          transition: 'transform 0.35s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.35s ease-in',
          opacity: flipping ? 0 : 1,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        aria-hidden="true"
      >
        {displayChar}
      </span>

      <span
        className="absolute inset-0 flex items-center justify-center leading-[1.1em]"
        style={{
          transform: flipping ? 'rotateX(0deg)' : 'rotateX(90deg)',
          transformOrigin: 'center center',
          transition: 'transform 0.35s cubic-bezier(0.45, 0, 0.55, 1) 0.1s, opacity 0.35s ease-out 0.1s',
          opacity: flipping ? 1 : 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
        aria-hidden="true"
      >
        {nextChar}
      </span>
    </span>
  )
}

export function FidsText({ text, trigger, className = '', as: Component = 'span' }) {
  const chars = [...text]
  return (
    <Component className={className}>
      {chars.map((char, i) => (
        <FlipChar key={`${trigger}-${i}`} char={char} shouldFlip={trigger} />
      ))}
    </Component>
  )
}
