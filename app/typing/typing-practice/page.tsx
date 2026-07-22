'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'

const PROMPTS = [
  `Fix 7 bugs quickly: x = (a + b) * 3; z[0] = "done!"; if (j > 0 && k < 10) { log("ok"); } // #check @v2 $pass 100% ^win &save ~end`,
  `Run: npm i --save-dev @types/node; export fn = (x: number) => x * 2 + 1; // 58 jobs, 3 queued, 0% fail! "ready?" <yes> &go ~fix ^ok`,
  `Query: SELECT * FROM jobs WHERE id = 42 AND rate > 0.5; // "result: 100%" #tag @dev $0.99 ^3x &zip! (check) [ok] {pass} ~86 items`,
  `Push code: git commit -m "fix(api): patch #7 @v3 $free ^ok &zip ~log"; // 500 errors? 0%! (build+test=done) [all 26 keys: abcdefghijklmnopqrstuvwxyz]`,
  `fn quick(x: &str, j: u8) -> bool { x.len() > 0 && j < 128 } // "zero bugs!" #fix @v5 $win 100% ^max &ok ~yes (abcdefghijklmnopqrstuvwxyz)`,
  `Deploy: ./run.sh --env=prod --port=8080 --jobs=42 // "Sphinx of black quartz, judge my vow!" @x $3.50 #zip ^ok &fix ~yes (all 26!) 100%`,
  `Log: [2024-09-30] WARN job#7 "exit(1)" at x.js:42; rate=0.5% // pack my box with five dozen jugs @fix $win #ok ^zip &run ~yes (abcdefghijklmnopqrstuvwxyz)`,
  `Test: expect(fn(42)).toBe("ok!"); // #v5 @dev $3.99 ^zip &run ~fix; "how vexingly quick daft zebras jump!" (abcdefghijklmnopqrstuvwxyz) 100% pass`,
  `Regex: /^[a-z0-9_@#$%^&*()+=~-]{8,}$/i.test("Fix_7!"); // "sphinx of black quartz" @job $win #ok ^yes &zip ~run; abcdefghijklmnopqrstuvwxyz 100%`,
  `Build: webpack --config=v2.js --port=3000 --mode=production; // "pack 5 dozen jugs!" @fix $0 #zip ^ok &run ~yes; abcdefghijklmnopqrstuvwxyz 100% done!`,
  `Pipe: cat file.txt | grep -v "^#" | sort -u | wc -l; // 42 lines, 0 errors! @fix $win #zip ^ok &run ~yes; abcdefghijklmnopqrstuvwxyz 100%`,
  `Schema: { "id": 7, "key": "abc_XYZ", "rate": 0.5, "ok": true } // #api @v2 $3.99 ^zip &fix ~run! (abcdefghijklmnopqrstuvwxyz) 100% pass`,
]

const LESSONS = [
  {
    label: 'Lesson 1',
    image: '/typing-lessons/lesson-1.png',
    alt: 'Lesson 1 – Home Row Position',
    prompts: [
      'aaa sss ddd fff jjj kkk lll asd fgh jkl asd jkl fds',
      'asdf jkl; asdf jkl; fjfj dkdk slsl ahah falls lass',
      'add all fad glad half hall lass fall lash flash flask',
      'ask a lass; a lad shall fall; jada flags a flag; dad adds a glass',
      'all sad lads fall; a glad dad calls; lass asks flask',
      'fad fall hall; add a flask; glad lad asks; jada calls dad',
    ],
  },
  {
    label: 'Lesson 2',
    image: '/typing-lessons/lesson-2.png',
    alt: 'Lesson 2 – Top Row Keys',
    prompts: [
      'qqq www eee rrr ttt yyy uuu iii ooo ppp qwe rty uio',
      'quit wit rye top your pour riot worry pout quote type',
      'write three quiet words; put your ripe pear up there',
      'the pretty writer quit; power words flow; you ought to try',
      'power up your wit; quiet riot wore out the pure pore',
      'type out your worries; write poetry; equip your true wit',
    ],
  },
  {
    label: 'Lesson 3',
    image: '/typing-lessons/lesson-3.png',
    alt: 'Lesson 3 – Bottom Row Keys',
    prompts: [
      'zzz xxx ccc vvv bbb nnn mmm zxc vbn zxcv bnm zxcvbnm',
      'zinc vex cab nab mix box vow zap calm verb van bench',
      'cave zinc vibe ban calm nexus numb balm clan venom',
      'max back cove; zinc bench vex; a calm van can move by cab',
      'vivid venom zaps calm bench; mix van back; box zinc cove',
      'numb zinc clan vex; a brave cab zones back; vim bobs next',
    ],
  },
  {
    label: 'Lesson 4',
    image: '/typing-lessons/lesson-4.png',
    alt: 'Lesson 4 – Home Row, Top and Bottom Row Combined',
    prompts: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs',
      'how vexingly quick daft zebras jump over the fox',
      'sphinx of black quartz judge my vow; zeal and jive mix well',
      'five boxing wizards jump quickly over the drowsy ox',
      'crazy Frederick buys many very exquisite opal jewels',
    ],
  },
  {
    label: 'Lesson 5',
    image: '/typing-lessons/lesson-5.png',
    alt: 'Lesson 5 – Capital Letters',
    prompts: [
      'Ask All Glad Jabs Flora Dials Kale Flash Jobs Daily',
      'The Quick Brown Fox Jumps Over The Lazy Dog Today',
      'Alice Bought Five Zebras; Jack Moved Very Quickly Home',
      'Sam and Lara Walk Fast; Bob Fixes Clocks; We Go Now',
      'Every Good Coder Knows Big Ideas Hinge On Clear Logic',
      'Victor Zaps Bold Foxes; Wren Quits; Max Joins The Pack',
    ],
  },
  {
    label: 'Lesson 6',
    image: '/typing-lessons/lesson-6.png',
    alt: 'Lesson 6 – Number Row',
    prompts: [
      '1 2 3 4 5 6 7 8 9 0 11 22 33 44 55 66 77 88 99 00',
      '10 20 30 40 50 60 70 80 90 100 200 500 1000 9999',
      '2048 1337 8080 4096 3000 65535 2024 1984 42 7 13',
      'room 404; floor 17; gate 3B; order 5500; items: 8 of 10',
      'pin 9021; ref 3847; lot 560; row 14; seat 7; code 10038',
      'score 99; rank 1; streak 30; level 5; xp 2750; hp 100',
    ],
  },
  {
    label: 'Lesson 7',
    image: '/typing-lessons/lesson-7.png',
    alt: 'Lesson 7 – Symbols',
    prompts: [
      '! @ # $ % ^ & * ( ) ! @ # $ % ^ & * ( ) !@#$%^&*()',
      'x = a * b + (c - d); y = 100%; z = x! + y@ + z#',
      'print("Hello!"); // x > 0 && y < 100; a[0] = b[1];',
      'email@domain.com; #tag; $price; 50% off; x^2 + y^2 = r^2',
      'fn(a, b) { return a * (b + 1); } /* result: 100% */ #done!',
      'const x = (a ?? b) || c; if (x !== 0) { throw new Error("!"); }',
    ],
  },
  {
    label: 'Final Test',
    image: '/typing-lessons/final.png',
    alt: 'Final Challenge and Typing Test',
    prompts: [
      'The quick brown fox jumps over the lazy dog. Pack my box with 5 dozen jugs!',
      'Type fast, aim well: 100% accuracy beats 120 wpm with errors every time.',
      'She said "Hello World!" and typed x = (a + b) * 3; into the console.',
      'Master all 26 keys, the number row 1-0, and every symbol: @#$%^&*()!',
      'Sphinx of black quartz, judge my vow: 47 keys, 100% in 60s!',
      'fn test() { assert_eq!(run(42), "ok"); } // score: 100% @done #v1',
    ],
  },
]

const ALL_TABS = [
  ...LESSONS.slice(0, 7).map((l) => l.label),
  'Practice',
  'Final Test',
]

const LINE_STEP_MAP: Record<number, number> = { 1: 2, 2: 4, 3: 6 }

type CharState = 'pending' | 'correct' | 'wrong' | 'current'

export default function TypingPracticePage() {
  const [activeTab, setActiveTab] = useState('Lesson 1')
  const [promptIndex, setPromptIndex] = useState(0)
  const [lessonPromptIndex, setLessonPromptIndex] = useState(0)
  const [lineStep, setLineStep] = useState(1)
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalTyped, setTotalTyped] = useState(0)
  const [errors, setErrors] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeLessonData = LESSONS.find((l) => l.label === activeTab)

  const lineCount = LINE_STEP_MAP[lineStep]

  const prompt =
    activeTab === 'Practice'
      ? Array.from({ length: lineCount }, (_, i) =>
          PROMPTS[(promptIndex + i) % PROMPTS.length]
        ).join(' ')
      : Array.from({ length: lineCount }, (_, i) =>
          activeLessonData!.prompts[(lessonPromptIndex + i) % activeLessonData!.prompts.length]
        ).join(' ')

  const focusInput = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    focusInput()
  }, [focusInput, promptIndex, activeTab, lessonPromptIndex])

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        if (startTime) {
          const secs = (Date.now() - startTime) / 1000
          setElapsed(secs)
          const words = typed.trim().split(/\s+/).length
          setWpm(Math.round((words / secs) * 60))
        }
      }, 200)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [started, finished, startTime, typed])

  const resetState = useCallback(() => {
    setTyped('')
    setStarted(false)
    setFinished(false)
    setStartTime(null)
    setElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setTotalTyped(0)
    setErrors(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
  }, [focusInput])

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab)
      setLessonPromptIndex(0)
      resetState()
    },
    [resetState]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ' ') e.preventDefault()
      if (finished) return

      if (e.key === 'Escape') {
        resetState()
        return
      }

      if (e.key === 'Backspace') {
        setTyped((prev) => prev.slice(0, -1))
        return
      }

      if (e.key.length !== 1) return

      if (!started) {
        setStarted(true)
        setStartTime(Date.now())
      }

      const nextTyped = typed + e.key
      const expected = prompt[typed.length]
      const isWrong = e.key !== expected

      setTotalTyped((t) => t + 1)
      if (isWrong) setErrors((err) => err + 1)

      setTyped(nextTyped)
      setAccuracy(
        Math.round(
          ((totalTyped + 1 - (isWrong ? errors + 1 : errors)) / (totalTyped + 1)) * 100
        )
      )

      if (nextTyped.length === prompt.length) {
        setFinished(true)
        if (timerRef.current) clearInterval(timerRef.current)
        const finalSecs = (Date.now() - (startTime ?? Date.now())) / 1000
        const wordCount = prompt.trim().split(/\s+/).length
        const finalWpm = Math.round((wordCount / finalSecs) * 60)
        const finalAccuracy = Math.round(((totalTyped + 1 - (isWrong ? errors + 1 : errors)) / (totalTyped + 1)) * 100)
        setWpm(finalWpm)
        setElapsed(finalSecs)

        if (finalWpm >= 35 && finalAccuracy >= 90) {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#fbbf24', '#f59e0b', '#ffffff', '#fde68a'] })
        } else if (finalWpm >= 20 && finalAccuracy >= 75) {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 }, colors: ['#34d399', '#6ee7b7', '#ffffff'] })
        }
      }
    },
    [finished, started, typed, prompt, totalTyped, errors, startTime, resetState]
  )

  const nextPrompt = useCallback(() => {
    if (activeTab === 'Practice') {
      setPromptIndex((i) => (i + 1) % PROMPTS.length)
    } else {
      setLessonPromptIndex((i) => i + 1)
    }
    resetState()
  }, [activeTab, resetState])

  const getCharState = (i: number): CharState => {
    if (i === typed.length) return 'current'
    if (i > typed.length) return 'pending'
    return typed[i] === prompt[i] ? 'correct' : 'wrong'
  }

  const progress = prompt.length > 0 ? (typed.length / prompt.length) * 100 : 0

  const practiceUI = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'WPM', value: started ? wpm : '—', accent: 'var(--color-dev)' },
          { label: 'Accuracy', value: started ? `${accuracy}%` : '—', accent: '#34d399' },
          { label: 'Time', value: started ? `${elapsed.toFixed(1)}s` : '—', accent: '#94a3b8' },
          { label: 'Progress', value: started ? `${Math.round(progress)}%` : '—', accent: '#fbbf24' },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${accent}`,
              borderRadius: '12px',
              padding: '18px 16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: accent,
                fontFamily: 'var(--font-geist-mono), monospace',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: '5px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: finished ? '#34d399' : 'var(--color-dev)',
            borderRadius: '2px',
            transition: 'width 0.1s ease, background 0.3s ease',
          }}
        />
      </div>

      {/* Typing area */}
      <div
        onClick={focusInput}
        style={{
          background: 'var(--surface)',
          border: `1px solid ${finished ? 'rgba(52,211,153,0.3)' : 'var(--border)'}`,
          borderRadius: '16px',
          padding: '28px 32px',
          cursor: 'text',
          position: 'relative',
          transition: 'border-color 0.3s ease',
        }}
      >
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          readOnly
          value=""
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
          aria-label="Typing input"
        />
        <p
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '22px',
            lineHeight: '2.4',
            letterSpacing: '0.03em',
            margin: 0,
            userSelect: 'none',
            wordBreak: 'break-word',
          }}
        >
          {prompt.split('').map((char, i) => {
            const state = getCharState(i)
            return (
              <span
                key={i}
                style={{
                  color:
                    state === 'correct' ? '#ffffff' :
                    state === 'wrong' ? '#f87171' :
                    state === 'current' ? 'var(--color-dev)' :
                    'rgba(255,255,255,0.55)',
                  background:
                    state === 'current' ? 'oklch(0.6 0.2 290 / 0.2)' :
                    state === 'wrong' ? 'rgba(248,113,113,0.15)' :
                    'transparent',
                  borderBottom:
                    state === 'current' ? '2px solid var(--color-dev)' : '2px solid transparent',
                  transition: 'color 0.05s, background 0.05s',
                  display: 'inline',
                }}
              >
                {char}
              </span>
            )
          })}
        </p>
        {!started && !finished && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '20px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-geist-mono), monospace',
              letterSpacing: '0.05em',
            }}
          >
            start typing to begin
          </div>
        )}
      </div>

      {/* Finished state */}
      {finished && (() => {
        const isGreat = wpm >= 35 && accuracy >= 90
        const isGood = wpm >= 20 && accuracy >= 75
        const celebrate = isGreat || isGood
        const accent = isGreat ? '#fbbf24' : isGood ? '#34d399' : 'rgba(52,211,153,0.8)'
        const celebrationMsg = isGreat
          ? '🏆 Outstanding! You are on fire!'
          : isGood
          ? '🎉 Great job! Keep it up!'
          : null
        const completionLabel = activeTab === 'Final Test' ? 'Challenge complete!' : activeTab === 'Practice' ? 'Test complete' : 'Lesson complete!'

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {celebrate && (
              <div
                style={{
                  borderRadius: '14px',
                  padding: '18px 24px',
                  textAlign: 'center',
                  background: isGreat
                    ? 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))'
                    : 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.04))',
                  border: `1px solid ${isGreat ? 'rgba(251,191,36,0.35)' : 'rgba(52,211,153,0.35)'}`,
                  animation: 'celebrationPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px', lineHeight: 1 }}>
                  {isGreat ? '🏆' : '🎉'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: accent, marginBottom: '4px' }}>
                  {isGreat ? 'Outstanding! You are on fire!' : 'Great job! Keep it up!'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                  {wpm} wpm · {accuracy}% accuracy · {elapsed.toFixed(1)}s
                </div>
              </div>
            )}
            <div
              style={{
                background: celebrate ? 'transparent' : 'rgba(52,211,153,0.06)',
                border: celebrate ? 'none' : '1px solid rgba(52,211,153,0.2)',
                borderRadius: '14px',
                padding: celebrate ? '0 4px' : '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: celebrate ? 'flex-end' : 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              {!celebrate && (
                <div>
                  <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>
                    {completionLabel}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                    {wpm} wpm · {accuracy}% accuracy · {elapsed.toFixed(1)}s
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={resetState}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Retry
                </button>
                <button
                  onClick={nextPrompt}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: `1px solid ${celebrate ? accent : 'var(--color-dev)'}`,
                    background: celebrate
                      ? isGreat ? 'rgba(251,191,36,0.12)' : 'rgba(52,211,153,0.12)'
                      : 'oklch(0.6 0.2 290 / 0.15)',
                    color: celebrate ? accent : 'var(--color-dev)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: celebrate ? 600 : 400,
                  }}
                >
                  Next prompt →
                </button>
              </div>
            </div>
          </div>
        )
      })()}
      <style>{`
        @keyframes celebrationPop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Controls */}
      {!finished && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            {activeTab === 'Practice'
              ? `prompt ${promptIndex + 1} of ${PROMPTS.length} · esc to reset`
              : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.55)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                Lines
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => { setLineStep(n); resetState() }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: `1px solid ${lineStep === n ? 'var(--color-dev)' : 'var(--border)'}`,
                      background: lineStep === n ? 'oklch(0.6 0.2 290 / 0.15)' : 'transparent',
                      color: lineStep === n ? 'var(--color-dev)' : 'rgba(255,255,255,0.55)',
                      fontSize: '14px',
                      fontWeight: lineStep === n ? 700 : 400,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'Practice' ? (
              <button
                onClick={nextPrompt}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-hover)',
                  background: 'var(--surface)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                New Prompt
              </button>
            ) : (
              <button
                onClick={resetState}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-hover)',
                  background: 'var(--surface)',
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <ToolLayout
      toolId="typing-practice"
      title="Typing Practice"
      description="Test and improve your typing speed and accuracy"
      seoContent={
        <SeoSection
          aboutTitle="About This Online Typing Practice Tool"
          about={`Improve your typing speed and accuracy with our free online typing practice tool. Whether you're a beginner learning touch typing or an experienced typist looking to increase your words per minute (WPM), this tool provides a distraction-free environment to build real keyboard skills.\n\nPractice using carefully written text prompts while receiving real-time feedback on your typing speed, WPM, accuracy, and mistakes. Every incorrect character is highlighted instantly so you can identify errors and improve your typing precision. A fresh practice passage loads after each session, allowing you to continue training without repeating the same text.\n\nUnlike typing games that focus on entertainment, this tool emphasizes consistent practice, helping you develop proper finger placement, improve muscle memory, and build lasting typing habits.\n\nWhether you're writing emails, coding software, completing school assignments, or working in an office, regular typing practice can help you type faster and with fewer mistakes.`}
          useCasesTitle="Why Use This Typing Practice Tool?"
          useCases={[
            'Free online typing practice with no registration required',
            'Measure your typing speed in Words Per Minute (WPM)',
            'Track typing accuracy while you practice',
            'Instant character-by-character mistake detection',
            'New typing prompts every session',
            'Suitable for beginners and advanced typists',
            'Great for students, programmers, writers, and office professionals',
            'Works directly in your browser on desktop and laptop devices',
          ]}
          benefits={{
            title: 'Benefits of Regular Typing Practice',
            intro: 'Practicing typing consistently helps improve both speed and accuracy over time. As your fingers become familiar with common letter combinations and keyboard layouts, you\'ll spend less time looking at the keyboard and more time focusing on your work.\n\nDaily typing practice can help you:',
            items: [
              'Increase typing speed naturally',
              'Improve typing accuracy',
              'Learn touch typing techniques',
              'Build finger muscle memory',
              'Reduce typing fatigue',
              'Become more productive when writing or coding',
              'Gain confidence using a computer',
            ],
            closing: 'Even practicing for 10–15 minutes a day can produce noticeable improvements over several weeks.',
          }}
          extraSections={[
            {
              title: 'Common Use Cases',
              intro: 'This typing practice tool is useful for many different situations:',
              items: [
                'Warming up before a long coding session',
                'Preparing for writing assignments or exams',
                'Improving typing speed for office work',
                'Practicing touch typing without distractions',
                'Building muscle memory for punctuation and symbols',
                'Training on common English words and programming vocabulary',
                'Preparing for typing tests and job assessments',
              ],
            },
          ]}
          closing="Whether you're just starting out or working to break your personal record, consistent practice is the key to becoming a faster, more confident typist. Open a new session, focus on accuracy first, and let speed follow naturally. Every word you type brings you one step closer to your goal."
          faqs={[
            { q: 'How is WPM calculated?', a: 'Words Per Minute (WPM) is calculated by dividing the number of correctly typed characters by five, which represents the standard average word length, and then dividing that result by the total typing time in minutes. This method is widely used across professional typing tests and typing practice websites.' },
            { q: 'What happens when I make a mistake?', a: 'Every incorrect character is highlighted immediately, making it easy to spot errors as you type. Mistakes must be corrected before you can continue, encouraging better typing accuracy and helping reinforce proper typing habits.' },
            { q: 'Can I choose my own practice text?', a: 'At the moment, the tool uses a collection of built-in typing prompts selected to provide varied and effective practice. Support for custom typing text may be introduced in a future update.' },
            { q: 'Is this typing practice tool free?', a: 'Yes. The tool is completely free to use. You can practice typing online as often as you like without creating an account or installing any software.' },
            { q: 'Is this tool suitable for beginners?', a: 'Absolutely. Beginners can use it to learn proper typing habits, while experienced users can improve typing speed, accuracy, and consistency through regular practice.' },
            { q: 'How often should I practice typing?', a: 'Practicing for 10–20 minutes each day is enough for most people to see steady improvements in typing speed and accuracy. Consistency is more important than long practice sessions.' },
          ]}
        />
      }
      category="typing"
      iconName="Keyboard"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Tab bar */}
        <div style={{ overflowX: 'auto', paddingBottom: '2px' }}>
          <Tabs tabs={ALL_TABS} value={activeTab} onChange={handleTabChange} />
        </div>

        {/* Lesson image (shown for all lesson/final tabs) */}
        {activeLessonData && (
          <img
            src={activeLessonData.image}
            alt={activeLessonData.alt}
            style={{
              width: '70%',
              margin: '0 auto',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              display: 'block',
            }}
          />
        )}

        {/* Practice label for lesson tabs */}
        {activeLessonData && (
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Practice
          </div>
        )}

        {practiceUI}
      </div>
    </ToolLayout>
  )
}
