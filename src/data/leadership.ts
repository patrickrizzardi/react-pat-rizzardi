export const timeline = [
  {
    year: '2026',
    label: 'Engineering Lead',
    org: 'Cheddar / consulting',
    detail: 'Independent CTO-track engagements.',
  },
  {
    year: '2024',
    label: 'Co-Lead Developer',
    org: 'VPM Solutions',
    detail: 'Promoted into shared technical leadership of the platform.',
  },
  {
    year: '2021',
    label: 'Senior Engineer',
    org: 'VPM Solutions',
    detail: "Joined early; owned the API surface as it 10×'d.",
  },
  {
    year: '2018',
    label: 'Staff Sergeant (E-6)',
    org: 'Army National Guard',
    detail: '4 years as NCO. Led, trained, and was accountable for soldiers.',
  },
  {
    year: '2014',
    label: 'Self-taught engineer',
    org: 'first ship',
    detail: 'No CS degree. No bootcamp. A decade of progressively harder problems.',
  },
] as const satisfies ReadonlyArray<{ year: string; label: string; org: string; detail: string }>;

export const stack = [
  { cat: 'Languages', items: ['TypeScript', 'Rust', 'Python', 'SQL', 'Lua'] },
  { cat: 'Backend', items: ['Node.js', 'Bun', 'Fastify', 'Express', 'REST'] },
  { cat: 'Data', items: ['PostgreSQL', 'Redis', 'DragonflyDB', 'Sequelize'] },
  { cat: 'Infra', items: ['Docker', 'GitHub Actions', 'DigitalOcean', 'Linux'] },
  { cat: 'Frontend', items: ['Vue 3', 'Tailwind', 'Vite', 'Pinia'] },
  { cat: 'ML / AI', items: ['CUDA', 'cudarc', 'Transformers', 'BPE'] },
] as const satisfies ReadonlyArray<{ cat: string; items: ReadonlyArray<string> }>;
