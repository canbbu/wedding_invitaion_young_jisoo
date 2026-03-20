import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BgmToggle } from './components/BgmToggle'
import { SlideAbout } from './slides/SlideAbout'
import { SlideFuture } from './slides/SlideFuture'
import { SlideMet } from './slides/SlideMet'
import { SlideDays } from './slides/SlideDays'
import { SlidePropose } from './slides/SlidePropose'
import { SlideClosing } from './slides/SlideClosing'

const slides = [
  SlideAbout,
  SlideFuture,
  SlideMet,
  SlideDays,
  SlidePropose,
  SlideClosing,
] as const

export default function App() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)
  const reduceMotion = useReducedMotion()

  const go = useCallback((delta: number) => {
    setDir(delta)
    setIndex((i) => {
      const n = i + delta
      return Math.min(Math.max(n, 0), slides.length - 1)
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const jump = useCallback((target: number) => {
    setDir(target > index ? 1 : -1)
    setIndex(target)
  }, [index])

  const Current = slides[index]

  const variants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.45 } },
        exit: { opacity: 0, transition: { duration: 0.35 } },
      }
    : {
        enter: (d: number) => ({
          x: d > 0 ? '5%' : '-5%',
          y: d > 0 ? 12 : -12,
          opacity: 0,
          rotateY: d > 0 ? -9 : 9,
          skewX: d > 0 ? '-0.8deg' : '0.8deg',
        }),
        center: {
          x: 0,
          y: 0,
          opacity: 1,
          rotateY: 0,
          skewX: '0deg',
          transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
        },
        exit: (d: number) => ({
          x: d < 0 ? '5%' : '-5%',
          y: d < 0 ? 12 : -12,
          opacity: 0,
          rotateY: d < 0 ? -9 : 9,
          skewX: d < 0 ? '-0.8deg' : '0.8deg',
          transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const },
        }),
      }

  return (
    <div className="deck">
      <BgmToggle />
      <div className="deck__stage">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={index}
            className="deck__slide"
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </div>
      <nav className="deck__nav" aria-label="슬라이드">
        <button type="button" className="deck__btn" disabled={index === 0} onClick={() => go(-1)}>
          이전
        </button>
        <div className="deck__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={'deck__dot' + (i === index ? ' deck__dot--active' : '')}
              onClick={() => jump(i)}
              aria-label={`${i + 1}번 슬라이드로 이동`}
              aria-current={i === index ? 'step' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="deck__btn"
          disabled={index === slides.length - 1}
          onClick={() => go(1)}
        >
          다음
        </button>
      </nav>
    </div>
  )
}
