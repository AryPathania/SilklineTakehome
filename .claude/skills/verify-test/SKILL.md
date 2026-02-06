---
name: verify-test
description: Verify a test actually fails when functionality breaks
user_invokable: true
args: "<test-name-or-file>"
---

# /verify-test - Test Verification Protocol

Verify that a test actually fails when the functionality it covers is broken.

## Usage

```
/verify-test <test-name-or-file>
```

Examples:
- `/verify-test "transitions from green to yellow"`
- `/verify-test src/__tests__/Stoplight.test.tsx`

## Actions

1. **Identify the test**
   - Find the test file and specific test case
   - Read the test to understand what it's testing

2. **Identify the code under test**
   - Find the source code the test covers
   - Identify the specific functionality being tested

3. **Break the code**
   - For timing/transition tests: Comment out `setActiveIndex` call
   - For rendering tests: Remove or hide the element being tested
   - Document exactly what was changed

4. **Run the test**
   ```bash
   npm run test -- --testNamePattern="<test-name>"
   ```

5. **Verify failure**
   - Confirm the test fails
   - Verify the failure message matches what we expect

6. **Revert the break**
   - Undo the breaking change
   - Confirm the test passes again

## Output Format

```
## Test Verification Report

### Test: [test name]
### File: [test file path]

### Code Under Test:
- File: [source file]
- Function/Component: [name]

### Break Applied:
[Exact change made to break the code]

### Test Result After Break:
- Status: FAILED (expected)
- Error: [error message]

### After Revert:
- Status: PASSED

### Verification: ✅ PASSED / ❌ FAILED
```

## Failure Cases

If the test does NOT fail when code is broken:
- The test is weak and needs to be rewritten
- Suggest specific improvements to make the test meaningful
