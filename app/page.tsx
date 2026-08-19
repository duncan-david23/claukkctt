'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' })
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-body' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-mono' })

// ink #0D1B00 · forest #163300 · lime #9FE870 · paper #F2F0E4 · rust #C0392B

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen overflow-x-hidden bg-[#F2F0E4] text-[#0D1B00]`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <Header />
      <Hero />
      <MarqueeTicker />
      <Features />
      <HowItWorks />
      <Ledger />
      <DownloadCTA />
      <Footer />
      <GlobalFX />
    </main>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   SPLIT WORDS — for GSAP headline reveals
   ════════════════════════════════════════════════════════════════════════ */

function SplitWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="word inline-block">
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   MAGNETIC WRAPPER — buttons pull toward the cursor
   ════════════════════════════════════════════════════════════════════════ */

function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * strength)
      yTo((e.clientY - r.top - r.height / 2) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   HEADER
   ════════════════════════════════════════════════════════════════════════ */

function Header() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y: -80, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <header ref={ref} className="sticky top-0 z-40 border-b border-[#0D1B00]/10 bg-[#F2F0E4]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#163300]">
            <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#9FE870]">₵</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-[17px] font-bold tracking-tight">
            Claukk<span className="text-[#163300]">Cart</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {['Features', 'How it works', 'Ledger'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[13px] font-semibold text-[#0D1B00]/60 transition hover:text-[#163300]"
            >
              {label}
            </a>
          ))}
        </nav>

        <Magnetic strength={0.25}>
          <a
            href="#download"
            className="rounded-full bg-[#163300] px-4 py-2 text-[13px] font-bold text-[#9FE870] transition hover:bg-[#0D1B00]"
          >
            Get the app →
          </a>
        </Magnetic>
      </div>
    </header>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   HERO — receipt prints out of a slot, headline flips in letter-by-word
   ════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const perfRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.word') || []
      const perfDots = perfRef.current ? Array.from(perfRef.current.children) : []
      const chips = chipsRef.current ? Array.from(chipsRef.current.children) : []
      const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : []

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      // the receipt physically prints out of the top edge
      tl.fromTo(
        cardRef.current,
        { clipPath: 'inset(0 0 100% 0)', y: -60 },
        { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.2, ease: 'power3.inOut' }
      )
        .fromTo(
          words,
          { yPercent: 120, opacity: 0, rotateX: -60 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.045, ease: 'back.out(1.5)' },
          '-=0.55'
        )
        .from(
          '.hero-sub',
          { opacity: 0, y: 16, duration: 0.6 },
          '-=0.4'
        )
        .from(chips, { opacity: 0, scale: 0.7, y: 10, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, '-=0.3')
        .from(ctaChildren, { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, '-=0.25')
        .from(perfDots, { scaleX: 0, transformOrigin: 'left', duration: 0.5, stagger: 0.008 }, '-=0.6')

      // subtle continuous jiggle on the receipt, like it's still hanging from the printer
      gsap.to(cardRef.current, {
        rotate: 0.6,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'top center',
        delay: 1.4,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden">
      <DotGrid />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-24">
        <div className="relative" style={{ perspective: 800 }}>
          <div ref={cardRef} className="relative">
            <TornEdge />
            <div className="rounded-b-2xl bg-white px-8 pb-10 pt-6 shadow-[0_1px_0_rgba(13,27,0,0.06)]">
              <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#0D1B00]/15 pb-4">
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0D1B00]/50">
                  Order #0001
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[#0D1B00]/50">
                  Before you pay
                </span>
              </div>

              <h1
                ref={headlineRef}
                className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[48px]"
                style={{ perspective: 600 }}
              >
                <SplitWords text="Budget it first." />
                <br />
                <span className="text-[#163300]">
                  <SplitWords text="Buy it on target." />
                </span>
              </h1>

              <p className="hero-sub mt-5 max-w-md text-[15.5px] leading-relaxed text-[#0D1B00]/65">
                Price out your cart before you walk in. Tap items off as you buy them,
                log what you actually paid, and get a real receipt — exported straight
                to your gallery — showing exactly what you saved.
              </p>

              <div ref={chipsRef} className="mt-7 flex flex-wrap gap-2">
                {['Set a budget per item', 'Track saved vs. overspent', 'Export to gallery'].map((t) => (
                  <span key={t} className="rounded-full bg-[#EEF3E4] px-3 py-1.5 text-[12px] font-semibold text-[#27500A]">
                    {t}
                  </span>
                ))}
              </div>

              <div ref={ctaRef} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Magnetic strength={0.25}>
                  <ApkButton />
                </Magnetic>
                <div className="flex gap-3">
                  <Magnetic strength={0.25}>
                    <PlayStoreButton compact />
                  </Magnetic>
                  <Magnetic strength={0.25}>
                    <AppStoreButton compact />
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>

          <div ref={perfRef} className="flex justify-center gap-1.5 pt-3">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-[#0D1B00]/15" />
            ))}
          </div>
        </div>

        <PhoneShowcase />
      </div>
    </section>
  )
}

function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle, #0D1B00 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        opacity: 0.06,
      }}
    />
  )
}

function TornEdge({ color = '#F2F0E4' }: { color?: string }) {
  return (
    <div
      className="h-3 w-full rounded-t-2xl"
      style={{
        backgroundImage: `linear-gradient(-45deg, ${color} 6px, transparent 0), linear-gradient(45deg, ${color} 6px, transparent 0)`,
        backgroundPosition: 'left bottom',
        backgroundSize: '12px 12px',
        backgroundRepeat: 'repeat-x',
        backgroundColor: 'white',
      }}
    />
  )
}

/* ── Phone: entrance flip, idle float, mouse-tracked 3D tilt ── */

function PhoneShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const floatCardRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seq = [0, 1, 2]
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % seq.length
      setStep(seq[i])
    }, 2200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(phoneRef.current, { rotateY: -10, rotateX: 4, transformPerspective: 1400 })

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(phoneRef.current, { y: 140, opacity: 0, scale: 0.75, rotateY: -60, rotateX: 30, duration: 1.5 })
        .from(glowRef.current, { scale: 0.2, opacity: 0, duration: 1.3 }, '<')
        .fromTo(
          floatCardRef.current,
          { y: 30, opacity: 0, scale: 0.8, rotate: -6 },
          { y: 0, opacity: 1, scale: 1, rotate: -3, duration: 0.8, ease: 'back.out(1.8)' },
          '-=0.6'
        )

      // idle bob, independent axis from tilt
      gsap.to(phoneRef.current, { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 })

      // continuous gentle float on the exported-receipt card
      gsap.to(floatCardRef.current, { y: -8, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 })

      // mouse-tracked parallax tilt
      const wrap = wrapRef.current
      if (wrap) {
        const rotY = gsap.quickTo(phoneRef.current, 'rotateY', { duration: 0.7, ease: 'power3' })
        const rotX = gsap.quickTo(phoneRef.current, 'rotateX', { duration: 0.7, ease: 'power3' })
        const handle = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          rotY(-10 + px * 26)
          rotX(4 - py * 20)
        }
        const reset = () => {
          rotY(-10)
          rotX(4)
        }
        wrap.addEventListener('mousemove', handle)
        wrap.addEventListener('mouseleave', reset)
        return () => {
          wrap.removeEventListener('mousemove', handle)
          wrap.removeEventListener('mouseleave', reset)
        }
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative mx-auto flex justify-center lg:justify-end" style={{ perspective: 1400 }}>
      <div
        ref={glowRef}
        className="pointer-events-none absolute -top-10 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #9FE870 0%, transparent 70%)' }}
      />

      <div className="relative">
        <div ref={phoneRef} style={{ transformStyle: 'preserve-3d' }}>
          <div className="relative h-[600px] w-[288px] rounded-[52px] bg-gradient-to-b from-[#2A2E26] to-[#0D0F0A] p-[10px] shadow-[0_40px_80px_-20px_rgba(13,27,0,0.45)]">
            <div className="absolute -left-[2px] top-[120px] h-8 w-[3px] rounded-l-sm bg-[#3A3F34]" />
            <div className="absolute -left-[2px] top-[160px] h-14 w-[3px] rounded-l-sm bg-[#3A3F34]" />
            <div className="absolute -left-[2px] top-[184px] h-14 w-[3px] rounded-l-sm bg-[#3A3F34]" />
            <div className="absolute -right-[2px] top-[150px] h-20 w-[3px] rounded-r-sm bg-[#3A3F34]" />

            <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#FCFBF7]">
              <div className="flex items-center justify-between px-7 pt-3.5">
                <span className="font-[family-name:var(--font-mono)] text-[13px] font-semibold text-[#0D1B00]">9:41</span>
                <StatusIcons />
              </div>

              <div className="absolute left-1/2 top-3 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

              <div className="px-5 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wide text-[#0D1B00]/45">
                      Today
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-[17px] font-bold">Weekend Grocery Run</h3>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF3E4]">
                    <span className="text-[13px]">🛒</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-[#0D1B00] px-3.5 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-wide text-[#9FE870]/70">
                      Budget ₵117.00
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[#9FE870]">-₵0.50</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[52%] rounded-full bg-[#9FE870]" />
                  </div>
                </div>

                <div className="mt-3.5 space-y-2">
                  <AppItemRow name="Rice (5kg)" price="65.00" checked={false} ripple={step === 1} />
                  <AppItemRow name="Bread — Loaf" price="11.50" original="12.00" checked={step >= 2} />
                  <AppItemRow name="Cooking Oil" price="40.00" checked={false} />
                </div>

                <div
                  className={`mt-3 flex items-center gap-2 rounded-full bg-[#EEF3E4] px-3 py-2 transition-all duration-500 ${
                    step === 2 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#27500A]" />
                  <span className="font-[family-name:var(--font-mono)] text-[10.5px] font-bold text-[#27500A]">
                    Saved ₵0.50 on Bread
                  </span>
                </div>
              </div>

              <div className="absolute bottom-9 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#9FE870] shadow-lg">
                <PlusIcon className="h-4 w-4 text-[#163300]" />
              </div>

              <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-[#0D1B00]/25" />
            </div>
          </div>
        </div>

        <div
          ref={floatCardRef}
          className="absolute -left-8 bottom-16 hidden w-[168px] rounded-xl border border-[#0D1B00]/8 bg-white px-3.5 py-3 shadow-xl sm:block"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF3E4]">
              <CheckIcon className="h-3 w-3 text-[#27500A]" />
            </div>
            <span className="text-[11px] font-bold text-[#0D1B00]">Receipt exported</span>
          </div>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] text-[#0D1B00]/45">Saved to gallery</p>
        </div>
      </div>
    </div>
  )
}

function AppItemRow({
  name,
  price,
  original,
  checked,
  ripple,
}: {
  name: string
  price: string
  original?: string
  checked: boolean
  ripple?: boolean
}) {
  return (
    <div
      className={`flex  items-center gap-2.5 rounded-xl border border-[#0D1B00]/8 bg-white px-3 py-2.5 transition-opacity ${
        checked ? 'opacity-45' : ''
      }`}
    >
      <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
        {ripple && (
          <>
            <span className="animate-ripple absolute h-5 w-5 rounded-full border-2 border-[#163300]" />
            <span className="animate-ripple-delay absolute h-5 w-5 rounded-full border-2 border-[#163300]" />
          </>
        )}
        <div
          className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            checked ? 'border-[#9FE870] bg-[#9FE870]' : 'border-[#0D1B00]/15'
          }`}
        >
          {checked && <CheckIcon className="h-3 w-3 text-[#163300]" />}
        </div>
      </div>

      <span className={`flex-1 text-[12.5px] font-semibold text-[#0D1B00] ${checked ? 'line-through' : ''}`}>{name}</span>

      <div className="text-right">
        {original && (
          <span className="mr-1 font-[family-name:var(--font-mono)] text-[10px] text-[#0D1B00]/35 line-through">
            ₵{original}
          </span>
        )}
        <span className={`font-[family-name:var(--font-mono)] text-[12px] font-bold text-[#163300] ${checked ? 'line-through' : ''}`}>
          ₵{price}
        </span>
      </div>
    </div>
  )
}

function StatusIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="6" width="2.5" height="5" rx="0.5" fill="#0D1B00" />
        <rect x="4.5" y="4" width="2.5" height="7" rx="0.5" fill="#0D1B00" />
        <rect x="9" y="2" width="2.5" height="9" rx="0.5" fill="#0D1B00" />
        <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill="#0D1B00" opacity="0.3" />
      </svg>
      <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
        <rect x="0.5" y="0.5" width="17" height="10" rx="2.5" stroke="#0D1B00" strokeOpacity="0.35" />
        <rect x="2" y="2" width="12.5" height="7" rx="1.5" fill="#0D1B00" />
        <rect x="18.5" y="3.5" width="1.2" height="4" rx="0.6" fill="#0D1B00" opacity="0.35" />
      </svg>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   MARQUEE TICKER — infinite GSAP-driven scroll
   ════════════════════════════════════════════════════════════════════════ */

function MarqueeTicker() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, { xPercent: -50, duration: 16, ease: 'linear', repeat: -1 })
    })
    return () => ctx.revert()
  }, [])

  const words = ['BUDGET FIRST', 'TAP TO BUY', 'TRACK SAVINGS', 'EXPORT RECEIPTS', 'NO OVERSPEND']
  const loop = [...words, ...words, ...words, ...words]

  return (
    <div className="overflow-hidden border-y border-dashed border-[#0D1B00]/15 bg-[#EEF3E4] py-3">
      <div ref={trackRef} className="flex w-max gap-8 whitespace-nowrap">
        {loop.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-[family-name:var(--font-mono)] text-[12px] font-bold uppercase tracking-wide text-[#27500A]"
          >
            {w} <span className="text-[#163300]">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   FEATURES — scroll-reveal stagger + a scanning laser sweep
   ════════════════════════════════════════════════════════════════════════ */

const lineItems = [
  { code: 'ITEM 01', title: 'Set the budget first', desc: 'Add everything you plan to buy and price each one before you walk in.' },
  { code: 'ITEM 02', title: 'Tap it off, or hold to delete', desc: 'Check items as you buy them and log the real amount. Long-press to remove.' },
  { code: 'ITEM 03', title: 'Watch saved vs. overspent', desc: 'A live tally, item by item, shows where you\u2019re under and where you went over.' },
  { code: 'ITEM 04', title: 'Export straight to your gallery', desc: 'One tap turns the trip into a clean receipt image, saved to your phone.' },
]

function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const scanRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: -70, skewX: 6 },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )

      gsap.fromTo(
        scanRef.current,
        { yPercent: -20, opacity: 0.7 },
        {
          yPercent: 1050,
          opacity: 0,
          duration: 1.6,
          ease: 'power2.in',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative overflow-hidden bg-white py-24">
      <div
        ref={scanRef}
        className="pointer-events-none absolute left-0 right-0 top-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(159,232,112,0.35), transparent)' }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-lg">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#163300]">
            The receipt
          </span>
          <h2 ref={headingRef} className="mt-2 font-[family-name:var(--font-display)] text-[34px] font-bold tracking-tight sm:text-[40px]">
            Four line items. That's the whole app.
          </h2>
        </div>

        <div className="divide-y divide-dashed divide-[#0D1B00]/15 border-y border-dashed border-[#0D1B00]/15">
          {lineItems.map((item, i) => (
            <div
              key={item.code}
              ref={(el) => { itemsRef.current[i] = el }}
              className="grid gap-2 py-7 sm:grid-cols-[120px_1fr] sm:gap-8"
            >
              <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold text-[#0D1B00]/35">{item.code}</span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-[19px] font-bold">{item.title}</h3>
                <p className="mt-1.5 max-w-md text-[14.5px] leading-relaxed text-[#0D1B00]/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — three mini phone frames, staggered pop-in
   ════════════════════════════════════════════════════════════════════════ */

const stages = [
  { label: 'Budget it', chip: '₵117.00 planned' },
  { label: 'Shop it', chip: '2 of 3 checked off' },
  { label: 'Export it', chip: 'Saved ₵0.50' },
]

function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60, rotate: -4, scale: 0.85 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-[family-name:var(--font-display)] text-[34px] font-bold tracking-tight sm:text-[40px]">
          One trip, start to finish.
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {stages.map((s, i) => (
            <div key={s.label} ref={(el) => { cardsRef.current[i] = el }}>
              <div className="mx-auto flex h-[220px] w-[130px] items-center justify-center rounded-[28px] border-[6px] border-[#0D1B00] bg-[#FCFBF7] p-3 shadow-lg">
                <div className="w-full space-y-1.5">
                  {[0, 1, 2].map((r) => (
                    <div
                      key={r}
                      className={`flex items-center gap-1.5 rounded-md border border-[#0D1B00]/10 bg-white p-1.5 ${
                        i >= 1 && r < i ? 'opacity-40' : ''
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 flex-shrink-0 rounded-full border ${
                          i >= 1 && r < i ? 'border-[#9FE870] bg-[#9FE870]' : 'border-[#0D1B00]/15'
                        }`}
                      />
                      <span className="h-1.5 flex-1 rounded-full bg-[#0D1B00]/8" />
                    </div>
                  ))}
                  {i === 2 && (
                    <div className="mt-1 rounded-md bg-[#EEF3E4] px-1.5 py-1 text-center">
                      <span className="font-[family-name:var(--font-mono)] text-[8px] font-bold text-[#27500A]">↓ exported</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-4 text-center font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wide text-[#0D1B00]/40">
                Step {i + 1}
              </p>
              <h3 className="text-center font-[family-name:var(--font-display)] text-[18px] font-bold">{s.label}</h3>
              <p className="mt-1 text-center text-[13px] text-[#0D1B00]/55">{s.chip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   LEDGER — GSAP number counters + torn-stub entrance
   ════════════════════════════════════════════════════════════════════════ */

function Ledger() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef<HTMLParagraphElement>(null)
  const overRef = useRef<HTMLParagraphElement>(null)
  const stubsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stubsRef.current,
        { y: 60, opacity: 0, rotate: (i: number) => (i === 0 ? -6 : 6) },
        {
          y: 0,
          opacity: 1,
          rotate: (i: number) => (i === 0 ? -2 : 2),
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      const saved = { val: 0 }
      const over = { val: 0 }

      gsap.to(saved, {
        val: 240,
        duration: 1.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        onUpdate: () => {
          if (savedRef.current) savedRef.current.textContent = `₵${saved.val.toFixed(2)}`
        },
      })

      gsap.to(over, {
        val: 15,
        duration: 1.7,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        onUpdate: () => {
          if (overRef.current) overRef.current.textContent = `₵${over.val.toFixed(2)}`
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ledger" ref={sectionRef} className="bg-[#0D1B00] py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#9FE870]">
          The ledger
        </span>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-[34px] font-bold tracking-tight text-white sm:text-[40px]">
          Every cedi, accounted for.
        </h2>

        <div className="mx-auto mt-12 flex max-w-md flex-col gap-5 sm:flex-row">
          <div ref={(el) => { stubsRef.current[0] = el }} className="flex-1">
            <Stub label="Saved this month" valueRef={savedRef} tone="saved" />
          </div>
          <div ref={(el) => { stubsRef.current[1] = el }} className="flex-1">
            <Stub label="Overspent this month" valueRef={overRef} tone="over" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stub({
  label,
  valueRef,
  tone,
}: {
  label: string
  valueRef: React.RefObject<HTMLParagraphElement>
  tone: 'saved' | 'over'
}) {
  const good = tone === 'saved'
  return (
    <div className="rounded-2xl bg-white p-1">
      <TornEdge color="white" />
      <div className="rounded-b-xl px-5 pb-5 pt-1 text-left">
        <p className={`font-[family-name:var(--font-mono)] text-[10.5px] font-bold uppercase tracking-wide ${good ? 'text-[#27500A]' : 'text-[#C0392B]'}`}>
          {label}
        </p>
        <p ref={valueRef} className={`mt-1 font-[family-name:var(--font-mono)] text-[28px] font-bold ${good ? 'text-[#163300]' : 'text-[#C0392B]'}`}>
          ₵0.00
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   DOWNLOAD CTA
   ════════════════════════════════════════════════════════════════════════ */

function DownloadCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.5)', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="download" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div ref={cardRef} className="rounded-2xl bg-white shadow-sm">
          <TornEdge />
          <div className="rounded-b-2xl px-8 py-12">
            <h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold tracking-tight sm:text-[38px]">
              Print your first receipt.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[15px] text-[#0D1B00]/60">
              Free to use. Android APK available directly — no store required.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic strength={0.25}>
                <ApkButton />
              </Magnetic>
              <Magnetic strength={0.25}>
                <PlayStoreButton />
              </Magnetic>
              <Magnetic strength={0.25}>
                <AppStoreButton />
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   STORE BUTTONS
   ════════════════════════════════════════════════════════════════════════ */

function ApkButton() {
  return (
    <a href="https://pub-c31f39f392544e268f886d98016543b3.r2.dev/claukkcart.apk" className="flex items-center gap-3 rounded-xl bg-[#163300] px-5 py-3 transition hover:bg-[#0D1B00]">
      <DownloadIcon className="h-5 w-5 text-[#9FE870]" />
      <span className="text-left leading-tight">
        <span className="block font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-wide text-[#9FE870]/70">
          Direct install
        </span>
        <span className="block text-[13.5px] font-bold text-[#9FE870]">Download APK</span>
      </span>
    </a>
  )
}

function PlayStoreButton({ compact }: { compact?: boolean }) {
  return (
    <a href="https://play.google.com/store/apps/details?id=com.claukkcart" className="flex items-center gap-2.5 rounded-xl bg-[#0D1B00] px-4 py-3 transition hover:bg-black">
      <PlayIcon className="h-5 w-5 text-white" />
      <span className="text-left leading-tight">
        <span className="block font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-wide text-white/55">Get it on</span>
        <span className="block text-[13px] font-bold text-white">Google Play</span>
      </span>
    </a>
  )
}

function AppStoreButton({ compact }: { compact?: boolean }) {
  return (
    <a
      href="https://apps.apple.com/app/claukkcart"
      className="flex items-center gap-2.5 rounded-xl border-2 border-[#0D1B00] px-4 py-3 transition hover:bg-[#0D1B00] hover:[&_*]:text-white"
    >
      <AppleIcon className="h-5 w-5 text-[#0D1B00]" />
      <span className="text-left leading-tight">
        <span className="block font-[family-name:var(--font-mono)] text-[9px] font-semibold uppercase tracking-wide text-[#0D1B00]/50">
          Download on the
        </span>
        <span className="block text-[13px] font-bold text-[#0D1B00]">App Store</span>
      </span>
    </a>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-dashed border-[#0D1B00]/15 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#163300]">
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#9FE870]">₵</span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-[14px] font-bold">ClaukkCart</span>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[#0D1B00]/40">
          © {new Date().getFullYear()} ClaukkCart — budget it before you buy it.
        </p>
      </div>
    </footer>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   ICONS
   ════════════════════════════════════════════════════════════════════════ */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 3.5v17l15-8.5-15-8.5z" />
    </svg>
  )
}
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.7 12.3c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.5 1.3 10 .8 1.2 1.8 2.6 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.7-1 1.1-2 1.4-2.9-1.9-.8-3.6-2.6-3.6-4.7zM14.2 4.6c.7-.8 1.1-2 1-3.1-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.9-1 3 1.1.1 2.1-.5 2.8-1.4z" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   GLOBAL — kept only for the small in-phone check ripple (cheap as CSS)
   ════════════════════════════════════════════════════════════════════════ */

function GlobalFX() {
  return (
    <style jsx global>{`
      @keyframes ripple {
        0% { transform: scale(0.5); opacity: 0.6; }
        100% { transform: scale(2.6); opacity: 0; }
      }
      .animate-ripple { animation: ripple 1.6s ease-out infinite; }
      .animate-ripple-delay { animation: ripple 1.6s ease-out infinite; animation-delay: 0.35s; }
      @media (prefers-reduced-motion: reduce) {
        .animate-ripple, .animate-ripple-delay { animation: none; }
        * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `}</style>
  )
}