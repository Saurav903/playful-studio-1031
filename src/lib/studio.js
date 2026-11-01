export const SEEDS = [
  {
    id: 'photosynthesis',
    kind: 'Science',
    color: 'leaf',
    title: 'Photosynthesis',
    question: 'How does a leaf turn light into lunch?',
    nugget: 'Plants use light energy to combine water and carbon dioxide into sugar, releasing oxygen.',
    pieces: [
      { id: 'sun', label: 'sunlight', icon: '☀', role: 'energy' },
      { id: 'water', label: 'water', icon: '💧', role: 'ingredient' },
      { id: 'air', label: 'carbon dioxide', icon: '☁', role: 'ingredient' },
      { id: 'sugar', label: 'sugar', icon: '✦', role: 'result' },
      { id: 'oxygen', label: 'oxygen', icon: '○', role: 'result' }
    ],
    recall: 'What gas does a leaf release after making sugar?',
    answer: 'oxygen',
    options: ['oxygen', 'helium', 'nitrogen']
  },
  {
    id: 'compound-interest',
    kind: 'Money',
    color: 'peach',
    title: 'Compound interest',
    question: 'Why does a small deposit grow surprising roots?',
    nugget: 'Compound interest earns returns on the original amount and on returns already added.',
    pieces: [
      { id: 'coin', label: 'a coin', icon: '◉', role: 'start' },
      { id: 'calendar', label: 'time', icon: '▦', role: 'force' },
      { id: 'sprout', label: 'new interest', icon: '⌁', role: 'result' },
      { id: 'stack', label: 'a taller stack', icon: '▤', role: 'result' }
    ],
    recall: 'Interest is calculated on your first deposit and also on…',
    answer: 'interest already earned',
    options: ['interest already earned', 'only taxes', 'the weather']
  },
  {
    id: 'feedback-loops',
    kind: 'Systems',
    color: 'lilac',
    title: 'Feedback loops',
    question: 'When does an effect return to shape its cause?',
    nugget: 'A feedback loop is a system where outputs influence later inputs, amplifying or balancing change.',
    pieces: [
      { id: 'thermostat', label: 'thermostat', icon: '◒', role: 'watcher' },
      { id: 'room', label: 'room temperature', icon: '▱', role: 'signal' },
      { id: 'heater', label: 'heater', icon: '⌇', role: 'action' },
      { id: 'arrow', label: 'a return path', icon: '↺', role: 'loop' }
    ],
    recall: 'In a feedback loop, an output influences a later…',
    answer: 'input',
    options: ['input', 'color choice', 'deadline']
  }
]

export const COACH_LINES = [
  'Nice contrast. You gave the idea a clear before-and-after shape.',
  'Try making one piece slightly strange — odd details stick on purpose.',
  'Your scene has a strong causal chain. Say it aloud once to lock it in.',
  'A tiny action can make this scene even more memorable: imagine it moving.'
]

export function createScene(seed, selectedIds) {
  const selected = seed.pieces.filter((piece) => selectedIds.includes(piece.id))
  const labels = selected.map((piece) => piece.label)
  if (!labels.length) return `Start with ${seed.title.toLowerCase()} and choose a character for your scene.`
  if (labels.length === 1) return `A giant ${labels[0]} enters the scene. What does it change?`
  return `Picture ${labels.slice(0, -1).join(', ')} and ${labels.at(-1)} sharing one impossible little stage.`
}

export function nextCoachLine(index) {
  return COACH_LINES[index % COACH_LINES.length]
}
