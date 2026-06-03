import type { Project } from '@/types/project';

export const projects: ReadonlyArray<Project> = [
  {
    id: 'tessa-ai',
    tier: 'featured',
    title: 'Tessa AI',
    description:
      'I wanted to understand transformers at the kernel level, not just call an API. So I built an LLM from scratch in Rust — custom CUDA attention kernels, a BPE tokenizer trained on 34GB of text across a 3.85B-token corpus, and three architectures under active exploration: a LLaMA-style transformer, RWKV-7, and a hybrid. Base training is in progress; inference service is planned.',
    tech: ['Rust', 'CUDA', 'cudarc', 'Transformer', 'RWKV', 'BPE', 'Linux'],
    archNotes:
      'Hand-written CUDA attention kernels (via cudarc) replaced the burn framework after they measurably outperformed its built-in ops — the tradeoff was months of low-level debugging for full control over memory layout and kernel fusion. Running three architecture experiments in parallel to understand where transformers end and recurrent models begin.',
    snippets: [
      {
        label: 'cudarc Kernel Dispatch — Fused RoPE + Head Reshape',
        language: 'rust',
        code: `// Fused RoPE + BSH→BHS reshape: one kernel launch instead of two passes.
// cudarc launches the .cu kernel directly; no framework in the middle.
pub fn rope_forward_reshape(
    &self,
    x: &Tensor,
    cos_table: &Tensor,
    sin_table: &Tensor,
    batch: usize,
    seq_len: usize,
    num_heads: usize,
    head_dim: usize,
) -> Result<Tensor> {
    let half_dim = head_dim / 2;
    let total = (batch * seq_len * num_heads * half_dim) as u32;
    let mut out = Tensor::alloc(&[batch * num_heads, seq_len, head_dim], &self.stream)?;
    let mut builder = self.stream.launch_builder(&self.k_rope_forward_reshape);
    builder.arg(&x.data);
    builder.arg(&cos_table.data);
    builder.arg(&sin_table.data);
    builder.arg(&mut out.data);
    builder.arg(&(batch as i32));
    builder.arg(&(seq_len as i32));
    builder.arg(&(num_heads as i32));
    builder.arg(&(head_dim as i32));
    unsafe { builder.launch(launch_cfg(total)) }?;
    Ok(out)
}`,
      },
    ],
    repoUrl: null,
  },
  {
    id: 'trading-v3',
    tier: 'featured',
    title: 'Trading Platform v3',
    description:
      'Third iteration of a fault-tolerant automated trading system — the first two taught me what not to do. 6 microservices, each owning a single domain, connected via DragonflyDB (Redis Streams + Pub/Sub) with effectively-once delivery (at-least-once + idempotent upserts). The database holds ~100M+ carefully partitioned rows with monthly range-partitioning that scopes each time-range query to a single partition.',
    tech: ['TypeScript', 'PostgreSQL', 'DragonflyDB', 'Docker', 'Bun'],
    archNotes:
      "The hardest architectural problem was time-range query performance across a growing partitioned table. Monthly range-partitioned tables with window functions — ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) — so each read scopes to a single month's partition instead of scanning the full table. Kelly criterion sizing + backtest/live fidelity parity are the other two load-bearing concerns.",
    snippets: [
      {
        label: 'DragonflyDB Consumer Group',
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
    repoUrl: null,
  },
  {
    id: 'yinz',
    tier: 'featured',
    title: 'Yinz Language',
    description:
      'A compiled systems language that targets LLVM native code. Full compiler pipeline written in Rust: lexer, parser, type-checker, and LLVM codegen via inkwell. Incremental recompilation powered by salsa — unchanged stages return cached results, so rebuilds skip recompiling unchanged stages. Ships with an LSP server, formatter, watch daemon, and VSCode extension.',
    tech: ['Rust', 'LLVM', 'inkwell', 'salsa', 'LSP'],
    archNotes:
      'Every compiler stage is a memoized salsa query — re-running on unchanged source returns cached results without recompilation. The LSP server, formatter, and watch daemon share the same query registry, so diagnostics and formatting are always consistent with the compiler.',
    snippets: [
      {
        label: 'salsa Incremental Query',
        language: 'rust',
        code: `#[salsa::tracked]
fn type_check_fn(db: &dyn Db, func: Function) -> TypeCheckResult {
    // salsa re-runs this only when func's parse tree changes;
    // callers that depend on unchanged functions get the cached result
    let body = parse_body(db, func);
    let env = build_type_env(db, func);
    infer_types(db, body, env)
}`,
      },
    ],
    repoUrl: 'https://github.com/yinzers/yinz-lang',
  },
  {
    id: 'vpm-solutions',
    tier: 'experience',
    title: 'VPM Solutions',
    description:
      'Enterprise workforce management platform processing $2M+ in monthly cashflow ($65.8M+ gross since 2021) for 100K+ users. Sole backend/DB/infra engineer from the start; now co-lead of a team of 4 — driving architecture, mentorship, and technical direction.',
    tech: ['TypeScript', 'Vue 3', 'Node.js', 'MySQL', 'Sequelize', 'Redis', 'Docker', 'AWS'],
    role: 'Co-Lead Developer & Infrastructure Lead',
    period: '2021 — Present',
    responsibilities: [
      "Grew the API from early-stage to 100+ models and 190+ controllers — made the scaling decisions as the system 10x'd",
      'Scoped, built, and shipped 11 third-party integrations end-to-end: Stripe, Wingspan, Hubstaff, Google Calendar, AWS S3, AWS Transcribe, SendGrid, Mixpanel, OpenAI, HubSpot, Paycor',
      'OpenAI in production: video-interview analysis pipeline that processes and scores candidate submissions',
      'Manage and mentor 4 developers — code review, architecture guidance, technical direction',
      'Re-architected AWS infrastructure for redundancy and fault-tolerance; cost-controlled via savings plans and right-sizing',
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
