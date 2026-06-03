# Résumé Review — Patrick Rizzardi

Review date: 2026-06-02. Two PDFs compared against the redact.digital site positioning
("Engineering Lead & Architect" / "Hiring a founding CTO?"). Audience = founders / hiring
managers evaluating a senior engineering-lead / founding-CTO-track hire.

Files reviewed:

- `/home/patrick/resume/patrick-rizzardi-resume.pdf` (the "main" resume)
- `/home/patrick/resume/patrick-rizzardi-resume-devops.pdf` (the "DevOps-focused" variant)

Review only — no PDFs or site files were edited.

---

## A. Side-by-Side Comparison

### Main resume (`patrick-rizzardi-resume.pdf`)

- **Headline / positioning:** "Senior Backend Engineer & API Architect." Positions Patrick
  as a from-scratch builder who goes deep on hard layers. The summary's anchor line:
  *"Sole architect of a workforce platform that grew from zero to 100,000+ users and
  $2M+/month in cashflow. I ship the integrations other teams call 'too complex,' and go deep
  on the layers most engineers only consume — distributed systems, compilers, and from-scratch
  ML."*
- **Structure:** Summary → Core Skills (6 rows: Languages, Backend, Data, Infra, Frontend,
  Systems/ML) → Experience (VPM Solutions, Redact Digital, Freelance). Three roles, full
  freelance section with two detailed bullets.
- **Emphasis:** Breadth. Backend/API architecture is the spine, but it deliberately spreads
  across compilers (Yinz), from-scratch ML (Tessa), a monetized product (Error Decoder), a
  published npm framework (YinzerFlow), and frontend (Vue 3, React). Shows range of an
  engineer who can own any layer.
- **Length:** One page, denser. VPM has 4 bullets; Redact Digital has 4 bullets covering 5
  distinct projects; Freelance has 3 bullets.
- **Tone:** Confident, slightly swaggering — *"the integrations other teams call 'too
  complex,'"* *"I own outcomes and don't need managing."* Reads like a senior IC who could
  lead.

### DevOps variant (`patrick-rizzardi-resume-devops.pdf`)

- **Headline / positioning:** "Platform / DevOps Engineer." Reframes the same career as an
  infra/platform-ownership story. Summary anchor: *"Platform engineer who builds and runs
  production cloud infrastructure end to end... Infrastructure-as-Code with Pulumi
  (TypeScript), Docker Swarm orchestration, automated CI/CD, and Datadog observability, with no
  unplanned outages in over a year."*
- **Structure:** Summary → Core Skills (8 rows reorganized around infra: Cloud, IaC/Config,
  Orchestration, CI/CD, Observability, Data, Languages, OS/Net) → Experience (same three
  roles, but compressed). Redact Digital shrinks to 2 bullets; Freelance shrinks to a single
  one-line bullet.
- **Emphasis:** Operational depth. Surfaces concrete infra tooling the main resume buries or
  omits entirely — Pulumi IaC, Ansible, Docker Swarm + Portainer, CircleCI→GitHub Actions
  migration, Datadog observability, cost control (savings plans, right-sizing), GCP (ramping).
  Compilers/ML are demoted to a single "systems depth... down to the metal" bullet.
- **Length:** One page, more whitespace. Compilers, the monetized product, YinzerFlow, and
  the frontend skills row are dropped.
- **Tone:** Same ownership voice but narrower — *"I automate everything and own outcomes."*
  Reads like a platform/SRE-leaning engineer.

### Core difference

Same facts, same metrics, two different spotlights. **The main resume sells breadth and
architectural range** (backend + systems + ML + product). **The DevOps variant sells
operational/infrastructure depth** (cloud, IaC, observability, uptime) and deliberately drops
the compiler/ML/product surface area to stay on-message. The DevOps variant also notably
*upgrades the VPM title to "Engineering Lead & Infrastructure Owner"* vs the main resume's
"Senior Software Engineer & Co-Lead" — see Section C, this matters.

---

## B. Recommendation

**Attach the main resume (`patrick-rizzardi-resume.pdf`).**

Why, judged honestly against the founding-CTO / engineering-lead audience:

1. **The site is selling breadth and architectural ownership, and so does the main resume.**
   A founding CTO is evaluated on "can this person own *every* layer of a young company's
   stack and make architecture calls?" The main resume answers yes across backend, data,
   infra, distributed systems, compilers, from-scratch ML, and a shipped monetized product.
   The DevOps variant answers "yes, for the platform/infra layer" — a deliberately narrower
   claim. For a CTO-track audience, breadth is the selling point, and the DevOps framing
   actively hides half the evidence (it drops Yinz the compiler, Tessa's full description,
   Error Decoder, YinzerFlow, and frontend entirely).

2. **Founding CTO ≠ DevOps specialist.** The DevOps title "Platform / DevOps Engineer" reads
   as a senior IC infra role, not a technical-cofounder/leadership track. A founder skimming
   it would slot Patrick as "the person I hire to run my AWS," not "the person I hire to be my
   first engineering leader." That is the wrong frame for "Hiring a founding CTO?"

3. **The DevOps variant's strengths can be partially folded into the main resume** rather than
   shipped as the public default. The infra detail (Pulumi/Ansible/Datadog/Swarm) is genuinely
   strong CTO-relevant evidence — see Section D for the one quick win this implies. But it
   belongs as *reinforcement inside the breadth narrative*, not as the whole story.

**Keep the DevOps variant as a targeted send** — it is the right tool when applying to a
named platform-engineering / SRE / DevOps-lead req. It just should not be the site's general
public résumé.

One honest caveat: the main resume's headline "Senior Backend Engineer & API Architect" is
itself slightly narrower than the site's "Engineering Lead & Architect" framing — it leads
with "Backend Engineer," not "Lead." See Section D, item 1.

---

## C. Fact-Consistency Check Against the Live Site

Site facts are treated as ground truth; the résumé must not contradict them.

### C1. VPM title — DevOps variant overstates, needs the résumé edited

- **Site fact:** Title is "Co-Lead Developer & Infrastructure Lead." He shares CTO-level
  responsibilities but does **not** hold the CTO title.
- **Main resume:** Heading reads *"Senior Software Engineer & Co-Lead — VPM Solutions."* Body:
  *"promoted to co-lead."* No CTO claim. **Consistent** with the site (a reasonable rendering
  of "Co-Lead Developer"). No edit required.
- **DevOps variant:** Heading reads *"Engineering Lead & Infrastructure Owner — VPM
  Solutions."* This is **not the actual title** ("Co-Lead Developer & Infrastructure Lead").
  "Engineering Lead & Infrastructure Owner" inflates "Co-Lead" → "Lead" and invents
  "Infrastructure Owner." It does *not* claim "CTO," so it does not trip the hard CTO flag —
  but it is a title that does not match the site's stated title.
  - **File:** `patrick-rizzardi-resume-devops.pdf`.
  - **Says:** "Engineering Lead & Infrastructure Owner."
  - **Site says:** "Co-Lead Developer & Infrastructure Lead."
  - **Who edits:** The **résumé** should change to match the real title (e.g., "Co-Lead
    Developer & Infrastructure Lead"). The site's "Engineering Lead & Architect" is the *brand
    headline for Patrick himself*, not a claim about the VPM job title, so the site is fine.
  - Note: the site's brand line "Engineering Lead & Architect" happens to echo the DevOps
    variant's invented title — do not let that coincidence justify the inflated VPM heading.

### C2. CTO claim — neither resume says "CTO." PASS

- Neither file uses the word "CTO." The hard flag (resume claiming CTO) does **not** fire on
  either. Good.

### C3. VPM metrics — consistent, with one number to confirm

- **Site fact:** $2M+/month cashflow, **$68M+ lifetime gross**, 100K+ users, 88 models / 282
  controllers, 4 junior developers, 2021–present.
- **Both resumes:** "$2M+/month," "100,000+ / 100K+ users," "88 models / 282 controllers,"
  "team of 4," "Feb 2021 – Present." All **consistent**.
- **One discrepancy to verify — gross volume number:** Both resumes cite Stripe gross volume
  as **"$65.8M+ ... since 2021."** The site fact is **"$68M+ lifetime gross."**
  - **Files:** Both `patrick-rizzardi-resume.pdf` and `patrick-rizzardi-resume-devops.pdf`.
  - **Says:** "$65.8M+ gross volume since 2021."
  - **Site says:** "$68M+ lifetime gross."
  - **Likely reconciliation:** These probably measure slightly different things — the résumé's
    "$65.8M+" is explicitly **Stripe** gross volume; the site's "$68M+" is **lifetime gross**
    (which may include non-Stripe rails like the Wingspan payouts both resumes mention). They
    are not necessarily contradictory, but $65.8M vs $68M will read as inconsistent to anyone
    comparing the two. **Recommendation:** align the public résumé to the site's "$68M+
    lifetime gross" (or scope both identically, e.g. "$65.8M+ via Stripe of $68M+ lifetime
    gross"). The **résumé** is the one to edit since the site number is verified ground truth.
    Confirm which figure is current before publishing.

### C4. Military — consistent on rank/tenure, but missing "National Guard" specificity

- **Site fact:** Army **National Guard** (NOT active duty), SSG / E-6, ~12 years, Section
  Chief.
- **Both resumes:** Summary says *"12 years military (NCO)."* SSG/E-6 **is** an NCO, so "NCO"
  is **accurate and not contradictory**. The "12 years" matches.
- **No contradiction** — neither resume claims active duty, and neither states a wrong rank.
  The hard flags (active duty / wrong rank) do **not** fire.
- **Soft note (not a contradiction):** the resumes omit "National Guard," the specific rank
  (SSG/E-6), and "Section Chief." This is under-selling, not mis-stating. Adding "Army
  National Guard — SSG (E-6), Section Chief, 12 yrs" would strengthen the leadership story and
  remove any ambiguity about active-vs-guard. Optional; no factual fix required.

### C5. Education — neither resume claims a degree. PASS

- **Site fact:** Self-taught — no CS degree, no bootcamp.
- **Both resumes:** Have **no Education section at all** and make **no degree/bootcamp claim.**
  The hard flag does **not** fire. Consistent. (Absence is the correct choice for a self-taught
  candidate; the work speaks. Optional: a one-line "Self-taught" note could pre-empt the "where
  did you study?" question, but it is not required and not a discrepancy.)

### C6. Site projects — all consistent, all present

- **Trading platform (~300–500M partitioned rows):** Both resumes say "300–500M-row
  partitioned database... under 50ms." **Consistent** with site.
- **Tessa AI (custom LLM in Rust, CUDA kernels, burn framework, 34GB corpus):** Main resume:
  *"from-scratch LLM training stack in Rust... custom CUDA attention kernels (2–3x
  throughput)... BPE tokenizer trained on a 34GB / 3.85B-token corpus."* Matches the site's
  Rust + CUDA + 34GB corpus facts. DevOps variant mentions Tessa only briefly ("LLM training
  stack from scratch with custom CUDA kernels"). **Consistent.**
  - **Minor note:** the site fact lists the **burn framework**; neither resume names "burn."
    Not a contradiction (omission, not a wrong claim), but the main resume could name-drop
    "burn" for credibility with ML-literate readers. Optional.
- **Error Decoder (monetized):** Main resume: *"monetized developer product (browser extension
  + web app)."* Matches "monetized." **Consistent.** (DevOps variant omits it — fine for that
  variant's scope.)

### C7. Contact info — consistent. PASS

- **Both resumes:** `patrick@redact.digital` | `redact.digital` |
  `linkedin.com/in/patrick-rizzardi` | also `github.com/patrickrizzardi`. All match the site
  facts (email, domain, LinkedIn). **Consistent.**

### Consistency summary

| # | Item | Main resume | DevOps variant | Action |
|---|------|-------------|----------------|--------|
| C1 | VPM title | OK ("Co-Lead") | **Mismatch** — "Engineering Lead & Infrastructure Owner" vs real "Co-Lead Developer & Infrastructure Lead" | Edit DevOps résumé to real title |
| C2 | CTO claim | None — PASS | None — PASS | — |
| C3 | Gross volume | "$65.8M+" Stripe vs site "$68M+ lifetime" | same | Reconcile/align résumé number; confirm current figure |
| C4 | Military | "12 yr (NCO)" — accurate | same | Optional: add "Nat'l Guard / SSG (E-6) / Section Chief" |
| C5 | Education | No degree claim — PASS | No degree claim — PASS | — |
| C6 | Projects | All present, consistent | Subset, consistent | Optional: name "burn" framework |
| C7 | Contact | Consistent | Consistent | — |

No hard flags fired (no CTO claim, no active-duty claim, no wrong rank, no fake degree). The
two real items to fix are the DevOps variant's inflated VPM title (C1) and the
$65.8M-vs-$68M gross-volume mismatch (C3).

---

## D. Quick-Win Polish Notes (Recommended = Main Resume) — Top 5

1. **Headline lags the site's leadership framing.** Resume says *"Senior Backend Engineer &
   API Architect"*; the site headlines *"Engineering Lead & Architect"* / *"Hiring a founding
   CTO?"*. Leading with "Backend Engineer" under-sells the leadership angle the site is
   selling. Consider "Engineering Lead & Backend/Systems Architect" (or similar) so the résumé
   headline reinforces the site rather than narrowing it.

2. **Reconcile the gross-volume number (C3).** "$65.8M+ ... since 2021" on the résumé vs the
   site's "$68M+ lifetime gross." Pick one figure (or scope both — "$65.8M+ via Stripe of
   $68M+ lifetime") so a reader comparing résumé and site doesn't see two different numbers.

3. **Fold in the strongest DevOps-variant infra proof.** The main resume's infra bullet is
   generic — *"Docker orchestration, CI/CD, redundant fault-tolerant services."* The DevOps
   variant has far more credible, specific evidence the CTO audience values: **Pulumi IaC,
   Ansible, Docker Swarm, Datadog observability, CircleCI→GitHub Actions migration, cost
   control.** Pulling one tightened bullet of that into the main resume strengthens the
   "can run production" half of the CTO story without diluting breadth.

4. **The summary's last line is a double-edged sword.** *"12 years military (NCO) — I own
   outcomes and don't need managing."* Strong ownership signal, but *"don't need managing"*
   can read as "doesn't take direction / hard to manage" to some hiring managers. For a
   founding-CTO audience (peers/founders), consider reframing toward leadership —
   e.g., "12 yrs military (NCO) — I own outcomes and lead from the front." Judgment call,
   but worth a second look before it's public.

5. **YinzerFlow's "66+ tests" is a weak metric to publish.** *"published npm framework,
   security-first, 66+ tests"* — raw test count is a thin proxy for quality and invites
   "only 66?" reactions. Replace with a stronger signal (downloads, GitHub stars, "used in
   production at X," or coverage %) or drop the number and keep "security-first, published on
   npm." Also confirm the npm package is still published/maintained before linking it
   publicly.

(Bonus, not in the top 5: no obvious typos found in either file — em-dashes, numbers, and
links are clean. The 2–3x / 50ms / 12s→40ms figures are internally consistent across both
documents.)
