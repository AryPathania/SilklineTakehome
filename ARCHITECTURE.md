# Stoplight Architecture

A React stoplight that cycles through green (5s) → yellow (1s) → red (2s) forever.

---

## 1. Package Structure

```
SilklineTakehome/
├── src/                          # All application code
│   ├── components/               # React UI components
│   │   ├── Stoplight.tsx         # Main stoplight container
│   │   ├── Stoplight.css         # Stoplight styling
│   │   └── Light.tsx             # Single light (reused 3x)
│   ├── hooks/                    # Custom React hooks
│   │   └── useStoplightCycle.ts  # Timer & state logic
│   ├── __tests__/                # Unit tests (Vitest)
│   │   ├── useStoplightCycle.test.ts
│   │   ├── Stoplight.test.tsx
│   │   ├── Light.test.tsx
│   │   └── App.test.tsx
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # React entry point
│   └── test-setup.ts             # Test configuration
├── e2e/                          # Browser tests (Playwright)
│   └── stoplight.spec.ts
├── coverage/                     # Generated: test coverage reports
├── .artifacts/                   # Generated: test artifacts
│   ├── playwright/               # Screenshots & traces
│   └── jscpd/                    # Duplication reports
├── vite.config.ts                # Build tool config
├── vitest.config.ts              # Unit test config
├── playwright.config.ts          # E2E test config
├── tsconfig.json                 # TypeScript config
├── .jscpd.json                   # Duplication checker config
└── package.json                  # Dependencies & scripts
```

---

## 2. File Breakdown

### Source Files

| File | What It Does | Why It's Important | What Breaks Without It |
|------|--------------|-------------------|----------------------|
| `useStoplightCycle.ts` | Manages which light is active and when to switch | Keeps all timing logic in one place; makes testing easy | Nothing cycles; lights are stuck |
| `Stoplight.tsx` | Renders three lights in the right order (red, yellow, green from top to bottom) | Organizes the visual layout | No lights appear on screen |
| `Light.tsx` | Renders a single colored circle that can be "on" or "off" | Avoids copying the same light code three times | Would need 3 separate light divs (messy) |
| `App.tsx` | Centers the stoplight on the page | Separates layout from stoplight logic | Stoplight stuck in top-left corner |
| `main.tsx` | Starts React and mounts it to the HTML page | Required for React to run | Blank page; nothing renders |
| `Stoplight.css` | Makes lights glow and animate | Visual appearance | Lights invisible or ugly |
| `test-setup.ts` | Adds testing helpers (like `toHaveAttribute`) | Required for test assertions | All tests crash with errors |

### Config Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Builds the app for development and production |
| `vitest.config.ts` | Runs unit tests with fake timers |
| `playwright.config.ts` | Runs browser tests with real timers |
| `tsconfig.json` | TypeScript rules (strict mode enabled) |
| `.jscpd.json` | Detects copy-pasted code |
| `package.json` | Lists dependencies and npm scripts |

---

## 3. React Hooks & State Flow

### The Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     useStoplightCycle Hook                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ activeIndex  │───▶│  setTimeout  │───▶│ setActiveIndex   │   │
│  │  (0,1,2)     │    │  (5s/1s/2s)  │    │ (next index)     │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
│         │                                          │             │
│         │            loops back ◀──────────────────┘             │
│         ▼                                                        │
│  Returns: activeColor ('green' | 'yellow' | 'red')              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Stoplight Component                          │
│  Receives: activeColor                                           │
│  Calculates: isActive = (activeColor === color) for each light  │
│  Renders: 3 Light components with isActive prop                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Light Component                              │
│  Receives: color, isActive                                       │
│  Sets: data-active="true" or "false"                            │
│  Sets: CSS class "light-active" when on                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DOM                                     │
│  <div data-testid="stoplight" data-active-color="green">        │
│    <div data-testid="light-red" data-active="false" />          │
│    <div data-testid="light-yellow" data-active="false" />       │
│    <div data-testid="light-green" data-active="true" />         │
│  </div>                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Hooks Used

**`useState` — Tracks Which Light Is On**
- We store a single number called `activeIndex` (0, 1, or 2)
- 0 means green, 1 means yellow, 2 means red
- When the timer fires, we add 1 to this number (wrapping back to 0 after 2)

**`useEffect` — Manages the Timer**
- Every time `activeIndex` changes, this hook runs
- It sets up a new timer for the current light's duration
- When the component is removed from the page, it cancels any pending timer
- This prevents "ghost timers" from running after the component is gone

### Why One Number Instead of Three Booleans?

We could have used three separate variables:
```typescript
// ❌ BAD: Three booleans
const [isGreenOn, setIsGreenOn] = useState(true);
const [isYellowOn, setIsYellowOn] = useState(false);
const [isRedOn, setIsRedOn] = useState(false);
```

But this is risky because:
- What if someone accidentally sets two lights to `true`?
- You need to update multiple variables every time the light changes
- Easy to forget one and create bugs

Instead, we use one number:
```typescript
// ✅ GOOD: Single source of truth
const [activeIndex, setActiveIndex] = useState(0);
const activeColor = sequence[activeIndex].color; // Derived!
```

Now it's impossible for two lights to be on at once. The `activeColor` is calculated from `activeIndex`, not stored separately.

---

## 4. Design Decisions: Avoided Gotchas

### Gotcha #1: setTimeout vs setInterval

**What we do:** Chain `setTimeout` calls (set a new timer after each light change)

**What we avoided:** Using `setInterval` (one repeating timer)

**Why this matters:**

Imagine you're playing a video game and you want to test if a power-up lasts exactly 10 seconds. If the game uses a real clock, you'd have to wait 10 actual seconds every time you test. That's slow!

Testing tools have "fake timers" that let you skip forward in time instantly. But fake timers work best when each timer is separate. With `setInterval`, there's one repeating timer that's harder to control.

With chained `setTimeout`:
```typescript
// Each light sets up its own timer
useEffect(() => {
  const timerId = setTimeout(() => {
    setActiveIndex(next); // Move to next light
  }, duration);

  return () => clearTimeout(timerId); // Clean up!
}, [activeIndex]);
```

Our tests can now say "skip forward 5 seconds" and the green light will change to yellow instantly. We don't have to actually wait.

### Gotcha #2: Testing Styles vs Data Attributes

**What we do:** Test `data-active="true"` attributes

**What we avoided:** Testing CSS classes or computed colors

**Why this matters:**

CSS can change. Maybe tomorrow we decide the active light should pulse instead of glow. Or we change the color from bright green to lime green. If our tests checked the actual color value, they'd break even though the stoplight still works fine.

Instead, we add a special attribute just for testing:
```html
<div data-testid="light-green" data-active="true">
```

Tests check this attribute, not the visual style. The styling can change freely without breaking tests.

### Gotcha #3: Memory Leaks from Timers

**What's a memory leak?**

Imagine you turn on a faucet but forget to turn it off. Water keeps running even when you don't need it. A memory leak is similar — your code keeps doing work even after you've moved on, wasting computer resources.

**The problem:** If you set a timer and then remove the component from the page, the timer might still fire and try to update something that no longer exists.

**Our solution:** Every time we set a timer, we also provide cleanup instructions:
```typescript
useEffect(() => {
  const timerId = setTimeout(doSomething, 5000);

  // This runs when the component is removed:
  return () => clearTimeout(timerId);
}, [activeIndex]);
```

The `return () => clearTimeout(timerId)` part says: "If this component goes away, cancel the timer first." This prevents ghost timers from haunting your app.

### Gotcha #4: Duplicate Code

**What we avoided:** Writing the same light code three times

Instead of:
```tsx
// ❌ BAD: Copy-paste
<div className={isGreenOn ? "light active" : "light"}>Green</div>
<div className={isYellowOn ? "light active" : "light"}>Yellow</div>
<div className={isRedOn ? "light active" : "light"}>Red</div>
```

We use:
```tsx
// ✅ GOOD: Reusable component
{colors.map(color => (
  <Light key={color} color={color} isActive={activeColor === color} />
))}
```

This means if we need to change how lights work, we change one file instead of three places.

---

## 5. Design Decisions: Future Gotchas

These are problems we haven't hit yet, but could appear as the app grows.

### Gotcha #1: Flaky E2E Tests

**What could happen:**

Our browser tests wait for real time to pass (5 seconds for green to become yellow). On a fast computer, this works fine. But on a slow computer or a busy server, timing can be slightly off.

Imagine you set a 5-second egg timer, but someone bumps into you and you press the button a half-second late. The test expects yellow at exactly 5 seconds, but it arrives at 5.3 seconds. Test fails!

**The risk:** Tests might randomly pass or fail depending on how busy the computer is.

**How to mitigate:**
- Use generous timeouts (we use 6000ms to wait for a 5000ms transition)
- Consider using Playwright's fake clock API for E2E tests
- Don't run heavy programs while testing

### Gotcha #2: Multiple Stoplights Won't Sync

**What could happen:**

If someone adds a second stoplight to the page:
```tsx
<Stoplight />  {/* Light 1 */}
<Stoplight />  {/* Light 2 */}
```

Each stoplight has its own `activeIndex` state. They start at the same time, but over time might drift apart slightly. They definitely won't be synchronized.

**The risk:** If you need synchronized stoplights (like at a real intersection), this design won't work.

**How to fix:** You'd need to "lift state up" — move `activeIndex` to a parent component that shares it with both stoplights, or use React Context.

### Gotcha #3: Changing the Timing Array

**What could happen:**

The light sequence is defined as:
```typescript
const LIGHT_SEQUENCE = [
  { color: 'green', duration: 5000 },
  { color: 'yellow', duration: 1000 },
  { color: 'red', duration: 2000 },
];
```

If someone tries to change a timing after the app starts:
```typescript
LIGHT_SEQUENCE[0].duration = 10000; // Trying to make green 10 seconds
```

The hook might not notice this change because it doesn't do a deep comparison of the array contents.

**The risk:** Unexpected behavior when modifying configuration at runtime.

**How to fix:** Use `Object.freeze()` on the sequence to prevent accidental changes, or implement deep comparison in the hook.

### Gotcha #4: Browser Tab Suspension

**What could happen:**

When you switch to another browser tab, the browser tries to save battery by slowing down or pausing timers in the hidden tab.

Your stoplight might be on green, you switch tabs for 30 seconds, and when you come back, the browser "catches up" on all the missed timer events at once. The lights might flicker rapidly as they catch up.

**The risk:** Weird behavior when the tab is in the background.

**This is normal:** Most browsers do this, and for a stoplight demo it's probably fine. For critical timing (like a game), you'd need to track real elapsed time with `Date.now()`.

### Gotcha #5: Server-Side Rendering (SSR)

**What is SSR?**

Normally, React runs in your browser. But some frameworks (like Next.js) can run React on a server first, send HTML to the browser, then "hydrate" it with JavaScript.

**The problem:** `useState` and `useEffect` don't work on the server. The hook tries to set a timer, but there's no browser to set a timer in!

**The risk:** If you copy this code into a Next.js app, it might crash or behave oddly.

**How to fix:** Wrap timer logic in a check for the browser environment, or use `'use client'` directive in Next.js.

---

## 6. Future-Proofing

Here's what we've set up to keep code quality high over time.

### TypeScript Strict Mode

**What it is:** TypeScript can catch bugs before your code runs. Strict mode enables all the strictest checks.

**Our settings (in `tsconfig.json`):**
- `"strict": true` — Enable all strict checks
- `"noUnusedLocals": true` — Error if you declare a variable but never use it
- `"noUnusedParameters": true` — Error if a function has a parameter it doesn't use

**How to check:** Run `npm run build` — any TypeScript errors will stop the build.

### Test Coverage (95%+ Required)

**What is coverage?**

Coverage measures what percentage of your code is actually run by tests. If you have 100 lines of code and your tests only run 80 of them, you have 80% coverage.

**Why it matters:**
- Untested code might have bugs you don't know about
- High coverage means most code paths have been verified
- 95% threshold ensures we don't skip testing important parts

**How to check:**
```bash
npm run test:coverage
```

This generates a report showing which lines are tested. Our target is 95% or higher.

**Current status:** 100% coverage on all source files.

### Duplication Check (<3% Required)

**What is duplication?**

When you copy-paste code instead of reusing it, you create duplication. If that code has a bug, you now have the bug in multiple places and have to fix it everywhere.

**Why <3%?**
- Some duplication is unavoidable (imports, boilerplate)
- More than 3% suggests lazy copy-pasting
- The tool (jscpd) detects suspicious patterns

**How to check:**
```bash
npm run dup
```

**Current status:** 0% duplication.

### The Validation Script

**One command to check everything:**
```bash
npm run validate
```

This runs:
1. All unit tests with coverage check (must be 95%+)
2. Duplication check (must be <3%)

**Use this before committing code** to ensure you haven't broken anything.

### E2E Tests for Real Browser Behavior

**Why we have E2E tests too:**
- Unit tests use fake timers (fast but simulated)
- E2E tests use real browsers (slow but realistic)
- If something works in unit tests but fails in real browsers, E2E catches it

**How to run:**
```bash
npm run test:e2e
```

---

## 7. Alternative Designs & Tradeoffs

Here are other ways we could have built this, and why we didn't.

### Alternative 1: setInterval Instead of Chained setTimeout

```typescript
// Alternative approach
useEffect(() => {
  const id = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % 3);
  }, /* but what duration? */);
  return () => clearInterval(id);
}, []);
```

**Pros:**
- Simpler — just one timer that repeats
- Less code

**Cons:**
- All lights would need the same duration (can't do 5s/1s/2s)
- Harder to test with fake timers
- Can't easily pause and resume
- Doesn't clean up between transitions

**Why we didn't use it:** Different lights need different durations. `setInterval` fires at a fixed rate.

### Alternative 2: Three Boolean States

```typescript
const [isGreenOn, setIsGreenOn] = useState(true);
const [isYellowOn, setIsYellowOn] = useState(false);
const [isRedOn, setIsRedOn] = useState(false);
```

**Pros:**
- Very explicit about state
- Easy to read: "is green on? true"

**Cons:**
- Can get out of sync (what if two are `true`?)
- Three state updates instead of one
- More variables to manage
- Violates "single source of truth" principle

**Why we didn't use it:** Too easy to create bugs. One number is simpler and safer.

### Alternative 3: CSS-Only Animation

```css
@keyframes cycle {
  0%, 100% { /* green on */ }
  62.5% { /* yellow on */ }
  75% { /* red on */ }
}
```

**Pros:**
- No JavaScript timers at all
- Smoother animations
- Less CPU work

**Cons:**
- Hard to change timing dynamically
- Difficult to test (can't fake CSS animations easily)
- Can't pause/resume or respond to events
- Less control over exact behavior

**Why we didn't use it:** We need testable, controllable timing. CSS animations are hard to verify in tests.

### Alternative 4: React Context for State

```typescript
const StoplightContext = createContext('green');

function StoplightProvider({ children }) {
  const [color, setColor] = useState('green');
  // ... timer logic
  return (
    <StoplightContext.Provider value={color}>
      {children}
    </StoplightContext.Provider>
  );
}
```

**Pros:**
- Multiple components could read the same light state
- Good for synchronized stoplights
- State lives outside components

**Cons:**
- Overkill for a single stoplight
- Adds boilerplate code
- Harder to understand for newcomers
- We don't need to share state (yet)

**Why we didn't use it:** We only have one stoplight. Context adds complexity we don't need.

### Alternative 5: useReducer Instead of useState

```typescript
const reducer = (state, action) => {
  switch (action.type) {
    case 'NEXT': return (state + 1) % 3;
    default: return state;
  }
};
const [activeIndex, dispatch] = useReducer(reducer, 0);
```

**Pros:**
- More structured state updates
- Easier to add complex state transitions later
- Better for debugging (can log actions)

**Cons:**
- Our state is just a number — reducer is overkill
- More boilerplate code
- Harder for beginners to understand

**Why we didn't use it:** `useState` is perfect for a single number. `useReducer` is for complex state objects.

---

## Appendix: Definitions

**Hook**
A special function in React that lets you "hook into" React features. Hooks start with `use`, like `useState` or `useEffect`. They let function components have state and side effects.

**State**
Data that can change over time and causes the UI to update. When state changes, React re-renders the component to show the new data.

**Effect**
A side effect is anything that happens outside of rendering, like setting a timer, fetching data, or updating the document title. `useEffect` runs these side effects.

**Memory Leak**
When a program keeps using memory (or resources like timers) that it no longer needs. Over time, this can slow down or crash the program.

**Fake Timers**
A testing feature that lets you control time. Instead of waiting 5 real seconds, you can instantly "skip forward" in fake time. Vitest and Jest provide this with `vi.useFakeTimers()`.

**SSR (Server-Side Rendering)**
Running React on a server to generate HTML before sending it to the browser. This makes pages load faster, but React hooks like `useState` don't work on the server.

**Coverage**
A measurement of how much code is executed by tests. 100% coverage means every line was run at least once during testing. High coverage helps catch bugs.

**Duplication**
Copied-and-pasted code that appears in multiple places. Duplication makes code harder to maintain because you have to fix bugs in multiple places.

**CI (Continuous Integration)**
A system that automatically runs tests whenever you push code. If tests fail, it prevents bad code from being merged. Examples: GitHub Actions, Jenkins, CircleCI.

**Data Attributes**
HTML attributes that start with `data-` and store custom information. For example, `data-active="true"`. They don't affect how the page looks, but JavaScript and tests can read them.

**JSX**
A syntax extension that lets you write HTML-like code in JavaScript. React components use JSX to describe what should appear on screen.

**Derived State**
Values calculated from other state, rather than stored separately. For example, `isActive = (activeColor === "green")` is derived from `activeColor`.
