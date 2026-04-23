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
    snippets: [
      {
        label: 'Grouped Query Attention',
        language: 'rust',
        code: `// GQA: expand KV heads to match Q heads
let repeat_factor = self.num_heads / self.num_kv_heads;
let k = Self::expand_kv_heads(k, repeat_factor);
let v = Self::expand_kv_heads(v, repeat_factor);

// Scaled dot-product attention
let scale = (self.head_dim as f64).sqrt();
let scores = q.matmul(k.swap_dims(2, 3)) / scale;

let scores = self.apply_causal_mask(scores, seq_len, device);
let attn_weights = burn::tensor::activation::softmax(scores, 3);
let out = attn_weights.matmul(v);

// [batch, num_heads, seq_len, head_dim] → [batch, seq_len, hidden_dim]
let out = out.swap_dims(1, 2)
    .reshape([batch, seq_len, self.num_heads * self.head_dim]);`,
      },
      {
        label: 'Rotary Position Embeddings',
        language: 'rust',
        code: `pub fn new(head_dim: usize, max_seq_len: usize, theta: f64) -> Self {
    let half_dim = head_dim / 2;
    let mut cos_cached = vec![0.0f32; max_seq_len * half_dim];
    let mut sin_cached = vec![0.0f32; max_seq_len * half_dim];

    // freq_i = 1.0 / (theta ^ (2i / head_dim))
    let freqs: Vec<f64> = (0..half_dim)
        .map(|i| 1.0 / theta.powf(2.0 * i as f64 / head_dim as f64))
        .collect();

    for pos in 0..max_seq_len {
        for (i, &freq) in freqs.iter().enumerate() {
            let angle = pos as f64 * freq;
            cos_cached[pos * half_dim + i] = angle.cos() as f32;
            sin_cached[pos * half_dim + i] = angle.sin() as f32;
        }
    }

    Self { cos_cached, sin_cached, head_dim, max_seq_len }
}`,
      },
    ],
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
      "Grew the API from early-stage to 88 models and 282 controllers — made the scaling decisions as the system 10x'd",
      'Scoped, built, and shipped 10+ third-party integrations end-to-end, several solo across both Vue frontend and API',
      'Manage 4 junior developers — code review, mentorship, architecture guidance',
      'Own infrastructure decisions: Docker orchestration, CI/CD, database optimization, AWS cost reduction',
    ],
    highlights: [
      'Delivered HubStaff and Wingspan integrations solo full-stack — from scoping with stakeholders to production deploy',
      'Drive technical direction alongside one co-lead — involved in all business, feature, and infrastructure decisions',
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
