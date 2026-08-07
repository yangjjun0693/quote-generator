import { useState, useCallback, useEffect } from 'react'
import { FidsText } from './components/ScrambleText'

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
]

const THEMES = {
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    bg: 'bg-minimal-bg',
    card: 'bg-minimal-card border-minimal-border',
    text: 'text-minimal-text',
    textMuted: 'text-minimal-textMuted',
    accent: 'bg-minimal-accent hover:bg-blue-700 text-white',
    accentRing: 'focus-visible:ring-minimal-accent',
    btnBorder: 'border-minimal-border',
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    bg: 'bg-dark-bg',
    card: 'bg-dark-card border-dark-border',
    text: 'text-dark-text',
    textMuted: 'text-dark-textMuted',
    accent: 'bg-dark-accent hover:bg-blue-500 text-dark-bg',
    accentRing: 'focus-visible:ring-dark-accent',
    btnBorder: 'border-dark-border',
  },
  warm: {
    id: 'warm',
    label: 'Warm',
    bg: 'bg-warm-bg',
    card: 'bg-warm-card border-warm-border',
    text: 'text-warm-text',
    textMuted: 'text-warm-textMuted',
    accent: 'bg-warm-accent hover:bg-amber-700 text-white',
    accentRing: 'focus-visible:ring-warm-accent',
    btnBorder: 'border-warm-border',
  },
  mono: {
    id: 'mono',
    label: 'Mono',
    bg: 'bg-mono-bg',
    card: 'bg-mono-card border-mono-border',
    text: 'text-mono-text',
    textMuted: 'text-mono-textMuted',
    accent: 'bg-mono-accent hover:bg-gray-300 text-mono-bg',
    accentRing: 'focus-visible:ring-mono-accent',
    btnBorder: 'border-mono-border',
  },
}

function getRandomQuote(excludeIndex) {
  const availableIndices = QUOTES.map((_, i) => i).filter(i => i !== excludeIndex)
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
  return { quote: QUOTES[randomIndex], index: randomIndex }
}

function QuoteCard({ quote, theme, className = '', flipKey }) {
  const t = THEMES[theme]
  return (
    <blockquote className={`quote-card ${t.card} ${t.text} ${className}`} role="quote" aria-live="polite">
      <p className="quote-text text-balance fids-text">
        <span aria-hidden="true">"</span>
        <FidsText text={quote.text} trigger={flipKey} as="span" />
        <span aria-hidden="true">"</span>
      </p>
      <footer className={`quote-author ${t.textMuted} flex items-center gap-3 fids-text`}>
        <span aria-hidden="true">—</span>
        <cite>
          <FidsText text={quote.author} trigger={flipKey} as="span" />
        </cite>
      </footer>
    </blockquote>
  )
}

function ThemeSelector({ currentTheme, onThemeChange }) {
  const themeKeys = Object.keys(THEMES)

  return (
    <div className="flex flex-wrap gap-2 justify-center" role="radiogroup" aria-label="Select theme">
      {themeKeys.map(key => {
        const theme = THEMES[key]
        const isActive = currentTheme === key
        return (
          <button
            key={key}
            role="radio"
            aria-checked={isActive}
            aria-label={theme.label}
            onClick={() => onThemeChange(key)}
            className={`theme-btn ${theme.btnBorder} ${theme.text} ${theme.card} ${isActive ? 'theme-btn-active ring-2 ring-offset-2' : 'hover:ring-1'} ${theme.accentRing}`}
          >
            {theme.label}
          </button>
        )
      })}
    </div>
  )
}

function NewQuoteButton({ onClick, disabled, theme }) {
  const t = THEMES[theme]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${t.accent} ${t.accentRing} ${t.textMuted} ${t.btnBorder} border min-w-[160px]`}
      aria-label="Generate new quote"
    >
      New Quote
    </button>
  )
}

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('minimal')
  const [currentQuote, setCurrentQuote] = useState(null)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(-1)
  const [flipKey, setFlipKey] = useState(0)

  const theme = THEMES[currentTheme]

  const handleNewQuote = useCallback(() => {
    const { quote, index } = getRandomQuote(currentQuoteIndex)
    setCurrentQuote(quote)
    setCurrentQuoteIndex(index)
    setFlipKey(k => k + 1)
  }, [currentQuoteIndex])

  useEffect(() => {
    const { quote, index } = getRandomQuote(-1)
    setCurrentQuote(quote)
    setCurrentQuoteIndex(index)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.target.closest('button, input, textarea')) {
        e.preventDefault()
        handleNewQuote()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNewQuote])

  useEffect(() => {
    document.documentElement.className = ''
    document.documentElement.classList.add(theme.bg)
    document.body.className = theme.bg
  }, [theme])

  if (!currentQuote) return null

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <main className="w-full max-w-3xl flex flex-col items-center gap-8">
        <header className="w-full text-center animate-fade-in">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
            Random Quote Generator
          </h1>
          <p className={`${theme.textMuted} text-sm md:text-base`}>
            Curated wisdom at your fingertips
          </p>
        </header>

        <QuoteCard quote={currentQuote} theme={currentTheme} flipKey={flipKey} />

        <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
          <NewQuoteButton
            onClick={handleNewQuote}
            theme={currentTheme}
          />

          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
          />
        </div>

        <footer className="w-full text-center mt-auto animate-fade-in">
          <p className={`${theme.textMuted} text-xs tracking-wide uppercase`}>
            {QUOTES.length} quotes curated • Press space for new quote
          </p>
        </footer>
      </main>
    </div>
  )
}
