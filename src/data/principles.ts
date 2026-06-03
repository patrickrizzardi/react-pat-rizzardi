export const principles = [
  {
    n: '01',
    title: 'Systems, not features.',
    body: 'The migration nobody noticed. The index that keeps 100M+ partitioned rows queryable. The redundancy addition nobody asked for. Quiet wins compound.',
  },
  {
    n: '02',
    title: 'Own the budget.',
    body: 'Engineering decisions are business decisions. I sit in every meeting where a number is being argued about — and I make sure the architecture survives the spreadsheet.',
  },
  {
    n: '03',
    title: 'Build the version that survives.',
    body: 'Trading platform v3 is fault-tolerant for a reason. v1 and v2 taught me what to throw away. Iteration > invention.',
  },
  {
    n: '04',
    title: 'Lead like a Staff Sergeant.',
    body: "12 years in the National Guard, 4 as an NCO. Different problems, same accountability — your team's outcomes are yours.",
  },
  {
    n: '05',
    title: 'Read the kernel.',
    body: "I'm building an LLM from scratch — custom CUDA attention kernels, a BPE tokenizer, the full training pipeline. APIs are fine. Understanding what they wrap is better.",
  },
  {
    n: '06',
    title: 'Write less. Delete more.',
    body: '100+ models, 190+ controllers, and the courage to kill three of them this quarter. Code you removed never breaks at 3am.',
  },
] as const satisfies ReadonlyArray<{ n: string; title: string; body: string }>;
