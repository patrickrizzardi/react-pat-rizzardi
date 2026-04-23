import type { Project } from '@/types/project';

export const projects: ReadonlyArray<Project> = [
  {
    id: 'tessa-ai',
    tier: 'featured',
    title: 'Tessa AI',
    description:
      'I wanted to understand transformers at the kernel level, not just call an API. So I built an LLM from scratch in Rust — custom CUDA attention kernels, a BPE tokenizer trained on 34GB of text, and a LLaMA-style architecture. No PyTorch, no HuggingFace, no wrapper libraries.',
    tech: ['Rust', 'CUDA', 'burn', 'Transformer', 'BPE', 'Linux'],
    archNotes:
      "Custom attention kernels bypass burn's built-in ops for 2-3x throughput on consumer GPUs. The tradeoff was months of low-level debugging for full control over memory layout and kernel fusion.",
    snippets: [],
  },
  {
    id: 'trading-v3',
    tier: 'featured',
    title: 'Trading Platform v3',
    description:
      'Third iteration of an automated trading system — the first two taught me what not to do. This version has been profitable for over a year. 6 microservices, each owning a single domain, connected via Redis Streams with exactly-once delivery. The database holds 300-500M carefully partitioned rows and every query stays under 50ms.',
    tech: ['TypeScript', 'PostgreSQL', 'Redis Streams', 'Docker', 'Sequelize', 'Bun'],
    archNotes:
      'The hardest problem was partitioning: time-range queries across 500M rows need the right partition strategy or you wait seconds, not milliseconds. Window functions with ROW_NUMBER() OVER (PARTITION BY ...) turned a 12-second query into a 40ms one.',
    snippets: [
      {
        label: 'Redis Streams Consumer',
        language: 'typescript',
        code: `const consumeLoop = async (): Promise<void> => {
  await dragonfly.createConsumerGroup(config.streamKey, consumerGroup);

  while (state.running) {
    const entries = await dragonfly.xreadGroup({
      group: consumerGroup,
      consumer: consumerName,
      streamKey: config.streamKey,
      count: 100,
      blockMs: blockTimeoutMs,
    });

    for (const entry of entries) {
      const parsed = JSON.parse(entry.data) as { rows: Array<Array<unknown>> };
      state.buffer.push({ id: entry.id, rows: parsed.rows });
      state.stats.entriesConsumed += 1;
    }

    if (shouldFlush(state, batchSize, flushIntervalMs)) {
      await flushBuffer(state, flushDeps);
    }
  }
};`,
      },
      {
        label: 'Partitioned Window Query',
        language: 'sql',
        code: `SELECT symbol, open, high, low, close, volume
  FROM (
    SELECT symbol, "timestamp", open, high, low, close, volume,
           ROW_NUMBER() OVER (
             PARTITION BY symbol ORDER BY "timestamp" DESC
           ) AS rn
      FROM bars
     WHERE timeframe = :timeframe
       AND "timestamp" > NOW() - MAKE_INTERVAL(hours => :lookbackHours)
  ) t
 WHERE rn <= :barsPerSymbol
 ORDER BY symbol ASC, "timestamp" ASC`,
      },
    ],
  },
  {
    id: 'vpm-solutions',
    tier: 'experience',
    title: 'VPM Solutions',
    description:
      'Enterprise workforce management platform processing $2M+ in monthly cashflow for 100K+ users. I joined early and grew into co-lead — owning the API architecture, infrastructure, and most of the complex integrations.',
    tech: ['TypeScript', 'Vue 3', 'Node.js', 'PostgreSQL', 'Sequelize', 'Redis', 'Docker'],
    role: 'Co-Lead Developer & Infrastructure Lead',
    period: '2021 — Present',
    responsibilities: [
      'Designed and scaled the API from early-stage to 88 models and 282 controllers serving production traffic',
      'Built 10+ third-party integrations end-to-end — payment processing, background checks, contractor compliance',
      'Owned infrastructure: Docker orchestration, CI/CD pipelines, database optimization, production monitoring',
    ],
    highlights: [
      'Solo full-stack delivery of HubStaff time-tracking integration — both Vue frontend and API (Vue + API)',
      'Solo full-stack delivery of Wingspan contractor payments integration — scoped, built, and shipped alone (Vue + API)',
    ],
    liveUrl: 'https://app.vpmsolutions.com',
  },
  {
    id: 'error-decoder',
    tier: 'standard',
    title: 'Error Decoder',
    description:
      'Got tired of Googling cryptic minified error codes. Built a browser extension and web app that decodes production errors from React, Vue, Angular, and Node.js into human-readable explanations. Monetized and actively maintained.',
    tech: ['TypeScript', 'Chrome Extension API', 'Vue 3', 'Vite'],
    liveUrl: 'https://errordecoder.dev',
    extensionUrl: 'https://chromewebstore.google.com/detail/error-decoder',
  },
  {
    id: 'yinzerflow',
    tier: 'standard',
    title: 'YinzerFlow',
    description:
      'Most Node.js frameworks bolt on security as middleware. I wanted it built into the foundation — CSRF protection, rate limiting, and input sanitization out of the box. Published on npm with 66+ tests.',
    tech: ['TypeScript', 'Node.js', 'Security', 'npm'],
    repoUrl: 'https://github.com/yinzers/YinzerFlow',
    npmUrl: 'https://www.npmjs.com/package/yinzerflow',
  },
  {
    id: 'wow-inventory',
    tier: 'standard',
    title: 'WoW Inventory Manager',
    description:
      'An addon for tracking inventory across characters and guilds in World of Warcraft. Event-driven architecture on the WoW API — built it because the existing solutions were slow and I wanted real-time sync.',
    tech: ['Lua', 'WoW API', 'Event-Driven', 'XML'],
    repoUrl: 'https://github.com/patrickrizzardi/wow-inventory-management',
  },
] as const;
