---
name: validate
description: Run full validation suite (coverage, duplication, e2e) and produce formatted report
user_invokable: true
---

# /validate - Full Validation Suite

Run all quality gate checks and produce a formatted report.

## Actions

1. **Run tests with coverage**
   ```bash
   npm run test:coverage
   ```
   - Required: 95%+ overall

2. **Check code duplication**
   ```bash
   npm run dup
   ```
   - Required: <3% duplication

3. **Run e2e tests (if configured)**
   ```bash
   npm run test:e2e
   ```
   - Mark as SKIPPED if Playwright not configured

## Output Format

```
## Validation Report

### Coverage: PASS/FAIL
- Current: XX%
- Required: 95%+
- Uncovered files/lines: [list if any]

### Duplication: PASS/FAIL
- Current: X.XX%
- Required: <3%
- Duplicated blocks: [list if any]

### E2E Tests: PASS/FAIL/SKIPPED
- Passed: X
- Failed: X
- Failures: [list with file:line if any]

### Overall: PASS/FAIL
```

## On Failure

- Coverage failure → suggest invoking **test** agent
- Duplication failure → suggest extracting duplicated blocks
- E2E failure → suggest invoking **debug** agent
