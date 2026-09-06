# Karpathy Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Apply these guidelines whenever writing, reviewing, or refactoring code. Merge them with more specific project instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them—don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it—don't delete it.

When your changes create orphans:

- Remove imports, variables, and functions that your changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass."
- "Fix the bug" → "Write a test that reproduces it, then make it pass."
- "Refactor X" → "Ensure tests pass before and after."

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

These guidelines are working if there are fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. Detailed Commit Messages

**A commit must explain the change well enough to review without reconstructing intent from the diff.**

- Use a specific Conventional Commit subject, such as `feat(web): add collapsible trading navigation`.
- Keep the subject concise, but do not use vague summaries such as `update code`, `fix UI`, or `changes`.
- Include a commit body for every non-trivial commit.
- In the body, explain why the change was needed, what behavior or architecture changed, and how it was verified.
- Call out important constraints, migrations, compatibility effects, or intentionally deferred work when relevant.
- Record concrete verification commands or results instead of writing only `tests passed`.
- Do not pad the message with a file-by-file changelog; summarize the meaningful product and technical outcomes.

Preferred structure:

```text
feat(scope): concise, specific outcome

Explain the user or technical problem that motivated the change.

- Describe the main behavior and implementation changes.
- Note important constraints or compatibility decisions.
- Verification: list the checks or tests that passed.
```
