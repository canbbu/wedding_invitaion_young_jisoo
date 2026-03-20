import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BGM_PATH = `${import.meta.env.BASE_URL}music/bgm.mp3`

export function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [on, setOn] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.volume = 0
    el.loop = true
  }, [])

  const fadeTo = useCallback((target: number) => {
    const el = audioRef.current
    if (!el) return
    let frame: number
    const step = () => {
      const v = el.volume
      if (Math.abs(v - target) < 0.02) {
        el.volume = target
        cancelAnimationFrame(frame)
        return
      }
      el.volume = v + (target - v) * 0.06
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }, [])

  const toggle = useCallback(async () => {
    const el = audioRef.current
    if (!el) return
    if (!on) {
      try {
        await el.play()
        setOn(true)
        fadeTo(0.35)
      } catch {
        setAvailable(false)
      }
    } else {
      fadeTo(0)
      setTimeout(() => {
        el.pause()
        setOn(false)
      }, 400)
    }
  }, [fadeTo, on])

  return (
    <>
      <audio
        ref={audioRef}
        src={BGM_PATH}
        preload="auto"
        onError={() => setAvailable(false)}
      />
      {available && (
        <motion.button
          type="button"
          className="bgm-toggle"
          onClick={toggle}
          aria-pressed={on}
          aria-label={on ? '배경음악 끄기' : '배경음악 켜기'}
          whileTap={{ scale: 0.92 }}
        >
          {on ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 5v14l-4-3H4V8h4l4-3zM16 9a4 4 0 010 6M18 7a7 7 0 010 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 5v14l-4-3H4V8h4l4-3zM19 9l-5 5M14 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </motion.button>
      )}
    </>
  )
}
