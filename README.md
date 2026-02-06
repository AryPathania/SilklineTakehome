# Stoplight Component

A React stoplight component that cycles through green, yellow, and red lights continuously.

## Features
- Configurable light sequence and timing
- TypeScript with strict mode
- 100% test coverage
- Clean separation of concerns (hook for logic, components for UI)

## Light Sequence
- Green: 5 seconds
- Yellow: 1 second
- Red: 2 seconds
- Repeats forever

## Commands
- `npm run dev` - Start dev server
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run dup` - Check code duplication
- `npm run validate` - Run all quality checks
- `npm run test:e2e` - Run Playwright e2e tests

## Architecture
```
src/
├── hooks/
│   └── useStoplightCycle.ts   # Timer + state logic
├── components/
│   ├── Stoplight.tsx          # Main component
│   ├── Stoplight.css          # Styling
│   └── Light.tsx              # Reusable light
└── __tests__/                 # Unit tests
```

## Quality Gates
- 95%+ test coverage
- <3% code duplication
- TypeScript strict mode (no errors)
