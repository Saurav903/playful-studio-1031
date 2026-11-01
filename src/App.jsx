import { useEffect, useMemo, useRef, useState } from 'react'
import { SEEDS, createScene, nextCoachLine } from './lib/studio.js'

const steps = [
  { id: 'notice', n: '01', label: 'Notice', note: 'Find the moving parts.' },
  { id: 'make', n: '02', label: 'Make', note: 'Build a strange little scene.' },
  { id: 'recall', n: '03', label: 'Recall', note: 'Pull the idea back out.' }
]

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
}

function Arrow({ direction = 'right' }) {
  return <span className={`arrow arrow-${direction}`} aria-hidden="true">→</span>
}

export default function App() {
  const [seedIndex, setSeedIndex] = useState(0)
  const [stage, setStage] = useState('notice')
  const [selected, setSelected] = useState([])
  const [answer, setAnswer] = useState('')
  const [answerState, setAnswerState] = useState('idle')
  const [coachIndex, setCoachIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studio-1031-completed') || '[]') } catch { return [] }
  })
  const [saveState, setSaveState] = useState('')
  const workspaceRef = useRef(null)
  const seed = SEEDS[seedIndex]
  const scene = useMemo(() => createScene(seed, selected), [seed, selected])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 460)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
      if (event.key === '1') setStage('notice')
      if (event.key === '2') setStage('make')
      if (event.key === '3') setStage('recall')
      if (event.key.toLowerCase() === 'n') chooseSeed((seedIndex + 1) % SEEDS.length)
      if (event.key === 'Escape') resetLab()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  function chooseSeed(index) {
    setSeedIndex(index)
    setSelected([])
    setAnswer('')
    setAnswerState('idle')
    setCoachIndex(0)
  }

  function togglePiece(pieceId) {
    setSelected((current) => current.includes(pieceId) ? current.filter((id) => id !== pieceId) : [...current, pieceId])
  }

  function checkAnswer() {
    if (!answer) return setAnswerState('empty')
    const correct = answer === seed.answer
    setAnswerState(correct ? 'correct' : 'incorrect')
    if (correct) {
      const updated = completed.includes(seed.id) ? completed : [...completed, seed.id]
      setCompleted(updated)
      try {
        localStorage.setItem('studio-1031-completed', JSON.stringify(updated))
        setSaveState('Saved on this device')
      } catch {
        setSaveState('Progress can’t be saved in this browser')
      }
    }
  }

  function resetLab() {
    setSelected([])
    setAnswer('')
    setAnswerState('idle')
    setCoachIndex(0)
    setStage('notice')
    workspaceRef.current?.focus()
  }

  if (loading) {
    return <main className="loading-shell" aria-label="Loading playful Studio 1031">
      <div className="loading-orbit"><span></span><span></span><span></span></div>
      <p>Warming up your tiny studio…</p>
    </main>
  }

  return <div className="app-shell">
    <a className="skip-link" href="#workbench">Skip to workbench</a>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="playful Studio 1031 home"><Mark /> <span>playful <b>Studio</b> <em>1031</em></span></a>
      <nav aria-label="Primary navigation">
        <a href="#workbench">Workbench</a>
        <a href="#method">The method</a>
        <a href="#shelf">Seed shelf</a>
      </nav>
      <button className="quiet-button shortcut-button" type="button" onClick={resetLab} title="Reset studio (Esc)">Reset <span>↺</span></button>
    </header>

    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot"></span> A pocket practice for curious minds</div>
          <h1 id="hero-title">Make ideas <span>stick</span><br />by making them <i>strange.</i></h1>
          <p>Turn a difficult concept into a tiny memory scene, then use it to retrieve what you learned. No streaks. No homework. Just a better way in.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#workbench">Open today’s studio <Arrow /></a>
            <a className="text-link" href="#method">How it works <span>↓</span></a>
          </div>
          <div className="micro-proof"><span className="mini-sun">✦</span> Built for five thoughtful minutes</div>
        </div>
        <div className="hero-art" aria-label="Illustration of a curious memory garden">
          <div className="art-sun">✦</div><div className="art-cloud cloud-one">☁</div><div className="art-cloud cloud-two">☁</div>
          <div className="art-hill"></div><div className="art-plant plant-a"><span></span><i></i><b></b></div>
          <div className="art-plant plant-b"><span></span><i></i><b></b></div><div className="art-plant plant-c"><span></span><i></i><b></b></div>
          <div className="art-note"><small>Today’s spark</small><strong>Light<br />becomes lunch</strong><span>↗</span></div>
          <div className="art-pebble">why?</div>
        </div>
      </section>

      <section className="studio-section" id="workbench" aria-labelledby="studio-title">
        <div className="section-heading">
          <div><p className="kicker">TODAY’S OPEN STUDIO</p><h2 id="studio-title">A scene for <i>{seed.title}</i></h2></div>
          <div className="demo-pill"><span></span> Demo mode <button type="button" className="info-button" aria-label="Demo mode works without an API key" title="All coaching is generated locally from a rotating studio prompt.">?</button></div>
        </div>

        <div className="studio-layout">
          <aside className="seed-rail" id="shelf" aria-label="Choose a learning seed">
            <p className="rail-label">Pick a seed</p>
            <div className="seed-list">
              {SEEDS.map((item, index) => <button key={item.id} type="button" className={`seed-card ${seed.id === item.id ? 'active' : ''} ${item.color}`} onClick={() => chooseSeed(index)} aria-pressed={seed.id === item.id}>
                <span className="seed-icon">{item.pieces[0].icon}</span><span><b>{item.title}</b><small>{item.kind}</small></span><span className="seed-chevron">›</span>
              </button>)}
            </div>
            <button type="button" className="surprise-button" onClick={() => chooseSeed((seedIndex + 1) % SEEDS.length)}>Surprise me <span>✦</span><kbd>N</kbd></button>
            <div className="rail-progress"><div><span>Collected</span><b>{completed.length}/{SEEDS.length}</b></div><div className="progress-track"><i style={{ width: `${completed.length / SEEDS.length * 100}%` }}></i></div></div>
          </aside>

          <section className="workbench" aria-label="Learning workbench" ref={workspaceRef} tabIndex="-1">
            <div className="challenge-header">
              <span className={`topic-chip ${seed.color}`}>{seed.kind}</span>
              <span className="challenge-count">{completed.includes(seed.id) ? '✓ remembered' : '3–5 min'} </span>
            </div>
            <div className="step-tabs" role="tablist" aria-label="Learning stages">
              {steps.map((item) => <button key={item.id} id={`${item.id}-tab`} type="button" role="tab" aria-selected={stage === item.id} aria-controls="studio-panel" className={stage === item.id ? 'selected' : ''} onClick={() => setStage(item.id)}>
                <small>{item.n}</small><b>{item.label}</b><span>{item.note}</span><kbd>{item.n.at(-1)}</kbd>
              </button>)}
            </div>

            <div className="work-area" id="studio-panel" role="tabpanel" aria-labelledby={`${stage}-tab`}>
              {stage === 'notice' && <Notice seed={seed} onNext={() => setStage('make')} />}
              {stage === 'make' && <Make seed={seed} selected={selected} scene={scene} onToggle={togglePiece} onNext={() => setStage('recall')} coachLine={nextCoachLine(coachIndex)} onCoach={() => setCoachIndex((current) => current + 1)} />}
              {stage === 'recall' && <Recall seed={seed} answer={answer} answerState={answerState} onAnswer={setAnswer} onCheck={checkAnswer} onRestart={resetLab} />}
            </div>
            <div className="studio-footer">
              <span><i></i> Local progress {saveState ? `· ${saveState}` : '· private to this browser'}</span>
              <span className="footer-shortcuts">Shortcuts: <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></span>
            </div>
          </section>
        </div>
      </section>

      <section className="method-section" id="method" aria-labelledby="method-title">
        <div className="method-intro"><p className="kicker">THE LITTLE METHOD</p><h2 id="method-title">A good memory needs<br />a <i>place to land.</i></h2><p>Studio 1031 borrows from elaboration and retrieval practice—then makes both feel like play.</p></div>
        <div className="method-cards">
          <article><div className="method-number">01</div><span className="method-icon notice-icon">◌</span><h3>Notice the cast</h3><p>Separate the idea into characters, forces, and outcomes.</p></article>
          <article><div className="method-number">02</div><span className="method-icon make-icon">✦</span><h3>Make it vivid</h3><p>Let those pieces do something a little impossible.</p></article>
          <article><div className="method-number">03</div><span className="method-icon recall-icon">↗</span><h3>Recall the thread</h3><p>Use the scene as a cue, then retrieve the idea yourself.</p></article>
        </div>
      </section>

      <section className="closing-banner" aria-labelledby="closing-title"><div><span className="sparkle">✦</span><p className="kicker">ONE MORE SMALL EXPERIMENT</p><h2 id="closing-title">Your brain likes a<br /><i>good prop.</i></h2></div><p>Pick a seed, make it weird,<br />and see what stays.</p><a href="#workbench" className="circle-action" aria-label="Return to the studio"><Arrow /></a></section>
    </main>
    <footer><a className="brand" href="#top"><Mark /> <span>playful <b>Studio</b> <em>1031</em></span></a><p>A tiny practice for thinking in public.</p><span>Made for bright, unfinished ideas.</span></footer>
  </div>
}

function Notice({ seed, onNext }) {
  return <div className="stage notice-stage">
    <div className="stage-copy"><p className="stage-label">A tiny inquiry</p><h3>{seed.question}</h3><p className="nugget">{seed.nugget}</p><div className="tip"><span>✦</span><p><b>Look for a cast of characters.</b> Most ideas become easier to hold when their parts have jobs.</p></div><button type="button" className="primary-button" onClick={onNext}>Choose the cast <Arrow /></button></div>
    <div className={`idea-orb ${seed.color}`} aria-hidden="true"><div className="orb-core">{seed.pieces[0].icon}</div>{seed.pieces.slice(1, 4).map((piece, index) => <span className={`orbital orbital-${index}`} key={piece.id}>{piece.icon}</span>)}<div className="orb-label">{seed.title}</div></div>
  </div>
}

function Make({ seed, selected, scene, onToggle, onNext, coachLine, onCoach }) {
  return <div className="stage make-stage">
    <div className="make-heading"><div><p className="stage-label">Build your memory scene</p><h3>Who belongs on this tiny stage?</h3></div><span className="selection-count"><b>{selected.length}</b>/{seed.pieces.length} picked</span></div>
    <div className="piece-grid" aria-label="Memory pieces">
      {seed.pieces.map((piece) => <button type="button" key={piece.id} className={`piece ${selected.includes(piece.id) ? 'picked' : ''}`} onClick={() => onToggle(piece.id)} aria-pressed={selected.includes(piece.id)}><span className="piece-icon">{piece.icon}</span><span><b>{piece.label}</b><small>{piece.role}</small></span><i>{selected.includes(piece.id) ? '✓' : '+'}</i></button>)}
    </div>
    <div className="scene-preview"><div className="scene-dots" aria-hidden="true"><i></i><i></i><i></i></div><p className="scene-label">Your scene, so far</p><p className="scene-text">{scene}</p><div className="scene-actions"><button type="button" className="coach-button" onClick={onCoach}>Ask the studio <span>✦</span></button><button type="button" className="primary-button" onClick={onNext}>Try recalling it <Arrow /></button></div></div>
    <p className="coach-line" role="status"><span>Local coach:</span> {coachLine}</p>
  </div>
}

function Recall({ seed, answer, answerState, onAnswer, onCheck, onRestart }) {
  const message = answerState === 'correct' ? 'Exactly. You pulled it back from the scene.' : answerState === 'incorrect' ? `Almost. Look for the role each piece plays, then try again.` : answerState === 'empty' ? 'Choose an answer before checking.' : ''
  return <div className="stage recall-stage"><div className="recall-copy"><p className="stage-label">Close the loop</p><h3>{seed.recall}</h3><p>Don’t peek at the facts. Use your scene as a stepping stone.</p></div><fieldset className="answer-list"><legend>Choose your answer</legend>{seed.options.map((option) => <label key={option} className={answer === option ? 'chosen' : ''}><input type="radio" name="answer" value={option} checked={answer === option} onChange={(event) => { onAnswer(event.target.value); }} /><span>{option}</span><i></i></label>)}</fieldset>{message && <p className={`answer-message ${answerState}`} role="status">{answerState === 'correct' ? '✦ ' : ''}{message}</p>}<div className="recall-actions"><button type="button" className="primary-button" onClick={onCheck}>{answerState === 'correct' ? 'Remembered!' : 'Check the thread'} <Arrow /></button>{answerState === 'correct' && <button type="button" className="quiet-button" onClick={onRestart}>Start another scene</button>}</div></div>
}
