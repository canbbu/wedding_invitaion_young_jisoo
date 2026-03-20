import { useMemo } from 'react'

const HEARTS = ['✿', '♥', '❀', '˚｡⋆']

/** 은은한 플로팅 장식 — 저비용으로 Lovely 분위기 */
export function FloatingPetals({ dense = false }: { dense?: boolean }) {
  const items = useMemo(() => {
    const n = dense ? 28 : 16
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      char: HEARTS[i % HEARTS.length],
      left: `${(i * 37) % 100}%`,
      delay: (i % 9) * 0.35,
      duration: 10 + (i % 7) * 1.8,
      scale: 0.5 + (i % 5) * 0.15,
    }))
  }, [dense])

  return (
    <div className="floating-petals" aria-hidden>
      {items.map((it) => (
        <span
          key={it.id}
          className="floating-petals__item"
          style={{
            left: it.left,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            fontSize: `${it.scale}rem`,
          }}
        >
          {it.char}
        </span>
      ))}
    </div>
  )
}
