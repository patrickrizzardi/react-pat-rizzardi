---
title: 'Test Post: Verifying the Pipeline'
date: '2026-04-23'
description: 'A test post to verify markdown rendering, code highlighting, and frontmatter extraction.'
tags: ['engineering', 'meta']
slug: 'hello-world'
author: 'Patrick Rizzardi'
draft: false
---

# Testing the Blog Pipeline

This is a test post to verify that the markdown rendering pipeline works end-to-end. It covers headings, paragraphs, code blocks, lists, and inline formatting.

## Code Highlighting

Here's a TypeScript example to test Shiki integration:

```typescript
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const results = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(results);
```

And some Rust for good measure:

```rust
fn fibonacci(n: u64) -> u64 {
    match n {
        0 | 1 => n,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    let results: Vec<u64> = (0..10).map(fibonacci).collect();
    println!("{:?}", results);
}
```

## Formatting

This paragraph has **bold text**, _italic text_, and `inline code`. It also has a [link](https://redact.digital) to test anchor rendering.

> This is a blockquote. It should render with proper styling in the prose container.

## Lists

Things this test verifies:

- Markdown to Vue component conversion
- YAML frontmatter extraction
- Shiki syntax highlighting for TypeScript and Rust
- Tailwind Typography prose styling
- Dark mode compatibility

## Conclusion

If you can read this with proper styling and highlighted code blocks, the pipeline works.
