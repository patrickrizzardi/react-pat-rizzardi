import type { Project } from '@/types/project';

export const projects: ReadonlyArray<Project> = [
  {
    id: 'tessa-ai',
    tier: 'featured',
    title: 'Tessa AI',
    description:
      'Large language model built from scratch in Rust using the burn framework. Custom CUDA kernels for attention, BPE tokenizer trained on a 34GB corpus, and a LLaMA-style transformer architecture. Everything from data pipeline to inference — no wrapper libraries.',
    tech: ['Rust', 'CUDA', 'burn', 'Transformer', 'BPE', 'Linux'],
    archNotes:
      "Custom attention kernels bypass burn's built-in ops for 2-3x throughput on consumer GPUs. Tokenizer trains offline then compiles to a static vocabulary for zero-allocation inference.",
    snippets: [],
  },
  {
    id: 'trading-v3',
    tier: 'featured',
    title: 'Trading Platform v3',
    description:
      '6-microservice trading platform processing real-time market data with sub-50ms latency. Pub/sub architecture on Redis Streams, 300-500M rows of carefully indexed and partitioned PostgreSQL, and 451 automated tests.',
    tech: ['TypeScript', 'PostgreSQL', 'Redis Streams', 'Docker', 'Sequelize', 'Bun'],
    archNotes:
      'Each microservice owns a single domain: ingestion, indicators, strategy execution, order management, market data serving, and the dashboard. Redis Streams provide exactly-once delivery with consumer groups.',
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
      'Enterprise workforce management platform serving 100K+ users with $2M monthly cashflow. Full-stack development across Vue 3 frontend and Node.js/Sequelize API with 88 models and 282 controllers.',
    tech: ['TypeScript', 'Vue 3', 'Node.js', 'PostgreSQL', 'Sequelize', 'Redis', 'Docker'],
    role: 'Co-Lead Developer & Infrastructure Lead',
    period: '2021 — Present',
    responsibilities: [
      'Architected and maintained API layer with 88 Sequelize models and 282 controllers',
      'Built and owned 10+ third-party integrations (payment processing, background checks, contractor compliance)',
      'Led infrastructure: Docker orchestration, CI/CD, database optimization, monitoring',
    ],
    highlights: [
      'Solo full-stack implementation of HubStaff time-tracking integration (Vue + API)',
      'Solo full-stack implementation of Wingspan contractor payments integration (Vue + API)',
    ],
    liveUrl: 'https://app.vpmsolutions.com',
  },
  {
    id: 'error-decoder',
    tier: 'standard',
    title: 'Error Decoder',
    description:
      'Browser extension and web app that decodes cryptic production error messages into human-readable explanations. Supports React, Vue, Angular, and Node.js error codes.',
    tech: ['TypeScript', 'Chrome Extension API', 'Vue 3', 'Vite'],
    repoUrl: 'https://github.com/patrickrizzardi/error-decoder-extension',
    liveUrl: 'https://errordecoder.dev',
    extensionUrl: 'https://chromewebstore.google.com/detail/error-decoder',
  },
  {
    id: 'yinzerflow',
    tier: 'standard',
    title: 'YinzerFlow',
    description:
      'Security-first web framework for Node.js with built-in CSRF protection, rate limiting, and input sanitization. Published on npm with 66+ tests and full TypeScript support.',
    tech: ['TypeScript', 'Node.js', 'Security', 'npm'],
    repoUrl: 'https://github.com/yinzers/YinzerFlow',
    npmUrl: 'https://www.npmjs.com/package/yinzerflow',
  },
  {
    id: 'wow-inventory',
    tier: 'standard',
    title: 'WoW Inventory Manager',
    description:
      'World of Warcraft addon for tracking inventory across multiple characters and guilds. Event-driven architecture using the WoW API with real-time updates on item changes.',
    tech: ['Lua', 'WoW API', 'Event-Driven', 'XML'],
    repoUrl: 'https://github.com/patrickrizzardi/wow-inventory-management',
  },
] as const;
