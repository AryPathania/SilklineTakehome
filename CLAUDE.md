# CLAUDE.md — Stoplight Assignment AI Operating System

## Goal
Build a basic React stoplight that cycles continuously:
- Green: 5s
- Yellow: 1s
- Red: 2s
Repeat forever.

## Non-negotiables
1. **No duplicate code.** jscpd must report <3% duplication.
2. **95% code coverage.** All code paths tested.
3. **Meaningful tests.** Prefer 1–3 strong tests over many weak ones. Each test must be verified by intentionally breaking functionality.
4. **Single source of truth for state.** No multiple booleans for lights. Use `activeIndex` or `activeColor` + derived booleans.
5. **Timer correctness.** Must clean up timers on unmount. No leaking intervals/timeouts.
6. **Keep it simple.** Only abstractions that reduce branching/duplication.

## State Design Tenets
- Single source of truth: `activeIndex` or `activeColor`
- Derived booleans: `isActive = activeColor === "green"`
- Timer approach: chain `setTimeout` based on current step
- Avoid `useMemo` unless computation is expensive
- Prefer: `useEffect(() => { const id = setTimeout(...); return () => clearTimeout(id); }, [activeIndex])`

## Commands
- `npm run dev` - Start dev server
- `npm run test` - Run vitest
- `npm run test:coverage` - Run tests with coverage (must be 95%)
- `npm run dup` - Run jscpd (must be <3%)
- `npm run validate` - Run coverage + duplication check
- `npm run test:e2e` - Run Playwright e2e tests

## Skills (User-Invokable)
- `/validate` - Run full validation suite (coverage, duplication, e2e)
- `/repro` - Create Playwright repro test for debugging
- `/verify-test` - Verify a test fails when functionality breaks
- `/setup-tooling` - Install all testing dependencies and create configs

## Agents (in .claude/agents/)
Claude will automatically delegate to these agents as needed:
1. **orchestrator**: Drives the assignment by delegating to other agents
2. **frontend**: Build/modify stoplight components
3. **test**: Write meaningful tests, verify by breaking code
4. **validate**: Run validation suite, report issues (95% coverage, <3% duplication)
5. **debug**: Analyze Playwright traces/screenshots for failures

## Coordination Protocol

Prevents agents stepping on each other:

| Agent | Can Edit | Read-Only |
|-------|----------|-----------|
| `orchestrator` | NOTHING (delegates only) | all files |
| `frontend` | `src/` (non-test files) | everything else |
| `test` | `src/__tests__/`, `e2e/` | src components |
| `validate` | NOTHING (read-only) | all files |
| `debug` | `e2e/debug-repro.spec.ts` only | artifacts |

## DOM Testing Contract

All agents must use these data attributes:
```tsx
// Root stoplight element
<div data-testid="stoplight" data-active-color="green">
  // Each light
  <div data-testid="light-red" data-color="red" data-active="false" />
  <div data-testid="light-yellow" data-color="yellow" data-active="false" />
  <div data-testid="light-green" data-color="green" data-active="true" />
</div>
```
- `data-active-color` on root = current active color
- `data-active="true|false"` on each light = whether that light is on
- Tests assert on `data-active`, NOT on CSS classes or inline styles

## Timer Implementation (Fake-Timer Compatible)
- MUST use chained `setTimeout`, NOT `setInterval`
- MUST NOT rely on `Date.now()` for timing logic
- Pattern: `useEffect` with cleanup on `[activeIndex]` dependency

## Artifacts
- Screenshots/traces on failure: `.artifacts/playwright/` (gitignored)
- jscpd reports: `.artifacts/jscpd/` (gitignored)
- Coverage reports: `coverage/` (gitignored)
