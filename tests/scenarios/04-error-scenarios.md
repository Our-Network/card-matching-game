# Error Scenario Tests - Failure Conditions & Error Handling

## 📋 Overview

**Category**: Error Scenario Tests
**Priority**: P2 (Medium - Should Pass ≥90%)
**Purpose**: Test error handling, graceful degradation, and recovery mechanisms
**Execution**: Major releases
**Total Tests**: 22 test scenarios

---

## 🎯 Test Strategy

Error scenario tests verify:
- Application handles errors gracefully
- Error messages are user-friendly
- No silent failures occur
- Recovery mechanisms work correctly
- Console errors are caught and handled
- Network failures don't crash app
- Invalid states detected and corrected

**Pass Criteria**: ≥90% pass rate (≤2 failures acceptable)

**Note**: Since this is a client-side game with no backend, error scenarios focus on:
- Resource loading failures
- Browser compatibility issues
- Invalid game states
- JavaScript runtime errors
- Console error handling

---

## ✅ Test Cases

### Category A: Resource Loading Failures (6 tests)

---

#### [ES-001] Missing p5.js Library
**Priority**: P1 | **Time**: 2min

**Description**: Test behavior if p5.js CDN fails to load.

**Steps**:
1. Block p5.js CDN request using DevTools
2. Load game
3. Verify error handling

**MCP Commands**:
```javascript
// Navigate with network blocking
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

// Check console for errors
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Verify app doesn't hang
mcp__chrome-devtools__take_snapshot({})
```

**Expected Behavior**:
- Console error: "p5 is not defined" or similar
- App fails gracefully
- User sees error message (ideally)

**Pass Criteria**:
- [ ] Error logged to console
- [ ] No infinite loading
- [ ] No browser crash
- [ ] (Ideal) User-friendly error message

---

#### [ES-002] Card Image Loading Failure
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Test if card images fail to load.

**Steps**:
1. Start game
2. Check if missing images handled gracefully
3. Verify game still playable (with placeholders)

**MCP Commands**:
```javascript
// Check network requests
mcp__chrome-devtools__list_network_requests({
  resourceTypes: ["image"]
})

// Verify any failed image loads
// Check console for image errors
mcp__chrome-devtools__list_console_messages({
  types: ["error", "warn"]
})
```

**Pass Criteria**:
- [ ] Missing images don't crash game
- [ ] Placeholder or fallback shown
- [ ] Game remains playable
- [ ] Console warnings (not errors) acceptable

---

#### [ES-003] Sound File Loading Failure
**Priority**: P3 | **Time**: 2min

**Description**: Test if sound files fail to load.

**Steps**:
1. Start game with sound files blocked
2. Verify game works without sound
3. Check console for audio errors

**Pass Criteria**:
- [ ] Game plays silently without crashing
- [ ] No critical errors
- [ ] Audio errors handled gracefully

---

#### [ES-004] CSS Stylesheet Loading Failure
**Priority**: P2 | **Time**: 2min

**Description**: Test if CSS fails to load.

**Steps**:
1. Block CSS file
2. Load game
3. Verify functional but unstyled

**Pass Criteria**:
- [ ] Game functional (even if ugly)
- [ ] No JavaScript errors due to missing CSS
- [ ] Core mechanics work

---

#### [ES-005] Slow Network Simulation (3G)
**Priority**: P2 | **Time**: 3min

**Description**: Test game loading on slow 3G network.

**Steps**:
1. Enable Slow 3G throttling
2. Load game
3. Verify loading completes eventually

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ networkConditions: "Slow 3G" })
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})
// Wait up to 30 seconds for load
mcp__chrome-devtools__wait_for({ text: "START", timeout: 30000 })
```

**Pass Criteria**:
- [ ] Game loads within 30 seconds
- [ ] No timeout errors
- [ ] Functional after load

---

#### [ES-006] Offline Mode
**Priority**: P2 | **Time**: 2min

**Description**: Test game behavior when offline (after initial load).

**Steps**:
1. Load game normally
2. Disconnect network (Offline mode)
3. Play game
4. Verify full functionality

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ networkConditions: "Offline" })
// Game should still work (client-side)
```

**Pass Criteria**:
- [ ] Game fully functional offline
- [ ] No network errors break gameplay
- [ ] All client-side features work

---

### Category B: Browser Compatibility & Console Errors (6 tests)

---

#### [ES-007] JavaScript Console Errors Detection
**Priority**: P1 | **Time**: 5min | **Difficulty**: Easy

**Description**: Comprehensive console error check during full gameplay.

**Steps**:
1. Clear console
2. Complete full game (start to victory)
3. Check console for any errors

**MCP Commands**:
```javascript
// Full game playthrough
// ... (complete game steps)

// Final error check
const errors = mcp__chrome-devtools__list_console_messages({
  types: ["error"]
})

// Document any errors found
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ES-007-console-errors.png"
})
```

**Pass Criteria**:
- [ ] Zero JavaScript errors
- [ ] Any warnings documented
- [ ] No unhandled promise rejections

---

#### [ES-008] Console Warning Analysis
**Priority**: P2 | **Time**: 3min

**Description**: Document and analyze all console warnings.

**Steps**:
1. Play through game
2. Collect all warnings
3. Categorize (deprecation, performance, etc.)

**Pass Criteria**:
- [ ] All warnings documented
- [ ] No critical warnings
- [ ] Acceptable warnings noted

---

#### [ES-009] Uncaught Exception Test
**Priority**: P1 | **Time**: 2min

**Description**: Verify uncaught exceptions don't crash game.

**Steps**:
1. Inject intentional error via console
2. Verify game continues running
3. Check error logged correctly

**MCP Commands**:
```javascript
// Inject error
mcp__chrome-devtools__evaluate_script({
  function: `() => { throw new Error("Test Error"); }`
})

// Verify game still functional
mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })
mcp__chrome-devtools__take_snapshot({})
```

**Pass Criteria**:
- [ ] Error logged to console
- [ ] Game doesn't freeze
- [ ] UI remains responsive

---

#### [ES-010] Invalid Function Call Handling
**Priority**: P2 | **Time**: 2min

**Description**: Call non-existent functions and verify handling.

**Steps**:
1. Try calling undefined game functions
2. Verify errors caught

**MCP Commands**:
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    try {
      window.nonExistentFunction();
    } catch (e) {
      return { error: e.message };
    }
  }`
})
```

**Pass Criteria**:
- [ ] Errors caught and logged
- [ ] No app crash

---

#### [ES-011] Memory Pressure Simulation
**Priority**: P2 | **Time**: 5min

**Description**: Test game under memory constraints.

**Steps**:
1. Open DevTools Memory profiler
2. Take heap snapshot before game
3. Play multiple games
4. Take heap snapshot after
5. Check for memory leaks

**Pass Criteria**:
- [ ] Memory growth < 100MB after 10 games
- [ ] No detached DOM nodes
- [ ] Garbage collection working

---

#### [ES-012] localStorage Unavailable
**Priority**: P3 | **Time**: 2min

**Description**: Test if game uses localStorage and handles unavailability.

**Steps**:
1. Disable localStorage (incognito mode or blocked)
2. Load game
3. Verify game works without localStorage

**MCP Commands**:
```javascript
// Check if localStorage used
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    try {
      return {
        available: !!window.localStorage,
        items: Object.keys(window.localStorage || {})
      };
    } catch (e) {
      return { error: e.message };
    }
  }`
})
```

**Pass Criteria**:
- [ ] Game works without localStorage
- [ ] No critical errors if localStorage blocked
- [ ] Graceful degradation

---

### Category C: Invalid Game States (5 tests)

---

#### [ES-013] Corrupted Game State Recovery
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Inject invalid game state and verify recovery.

**Steps**:
1. Start game normally
2. Manually corrupt gameState via console
3. Trigger game action
4. Verify error handling

**MCP Commands**:
```javascript
// Corrupt game state
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    window.gameState.timer = -100; // Invalid negative timer
    window.gameState.score = "invalid"; // Wrong type
  }`
})

// Try game action (click card)
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "card-0" })

// Check for errors
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Pass Criteria**:
- [ ] Errors logged
- [ ] Game recovers or resets gracefully
- [ ] No infinite loops or freezes

---

#### [ES-014] Missing gameState Object
**Priority**: P2 | **Time**: 2min

**Description**: Delete gameState object and verify handling.

**Steps**:
1. Start game
2. Delete window.gameState via console
3. Trigger game actions
4. Verify error handling

**MCP Commands**:
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => { delete window.gameState; }`
})

// Try clicking
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "card-0" })
```

**Pass Criteria**:
- [ ] Errors caught
- [ ] Game doesn't crash browser
- [ ] User notified (ideally)

---

#### [ES-015] Negative Score Injection
**Priority**: P3 | **Time**: 2min

**Description**: Set score to negative value and verify handling.

**Steps**:
1. Start game
2. Set score to -1000
3. Complete game
4. Verify score displays correctly (or resets)

**MCP Commands**:
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => { window.gameState.score = -1000; }`
})
```

**Pass Criteria**:
- [ ] Negative score either rejected or displayed
- [ ] No calculation errors
- [ ] Victory screen shows correct value

---

#### [ES-016] Invalid Difficulty Configuration
**Priority**: P2 | **Time**: 2min

**Description**: Corrupt difficulty config and verify handling.

**Steps**:
1. Set invalid difficulty (e.g., 0 cards)
2. Try starting game
3. Verify error handling

**MCP Commands**:
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    window.CONFIG = {
      DIFFICULTY: { cardCount: 0, time: -10 }
    };
  }`
})
```

**Pass Criteria**:
- [ ] Invalid config detected
- [ ] Default values used OR error shown
- [ ] Game doesn't start with invalid config

---

#### [ES-017] Infinite Loop Prevention
**Priority**: P1 | **Time**: 3min

**Description**: Test that game doesn't enter infinite loops.

**Steps**:
1. Monitor for infinite loops during gameplay
2. Check requestAnimationFrame usage
3. Verify game loop has exit conditions

**Pass Criteria**:
- [ ] No infinite loops during normal play
- [ ] Frame rate stable (no runaway loops)
- [ ] Browser remains responsive

---

### Category D: Timing & Race Conditions (3 tests)

---

#### [ES-018] Race Condition - Multiple Timers
**Priority**: P2 | **Time**: 3min

**Description**: Verify only one timer runs at a time.

**Steps**:
1. Start game
2. Check number of active intervals/timers
3. Verify timer cleanup on game end
4. Start new game, verify old timer cleared

**MCP Commands**:
```javascript
// Before game
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    // Check active timers (implementation-specific)
    return { timerCount: /* check timer implementation */ };
  }`
})
```

**Pass Criteria**:
- [ ] Only one timer active during game
- [ ] Old timers cleared on reset
- [ ] No timer leaks

---

#### [ES-019] Async Operation Failure
**Priority**: P2 | **Time**: 2min

**Description**: Test failed async operations (if any).

**Steps**:
1. Check for any async/await or Promises
2. Simulate Promise rejection
3. Verify error handling

**Pass Criteria**:
- [ ] Rejected promises caught
- [ ] No unhandled promise rejections
- [ ] Appropriate fallbacks

---

#### [ES-020] Animation Frame Drop Recovery
**Priority**: P3 | **Time**: 3min

**Description**: Test game under extreme frame rate drops.

**Steps**:
1. Enable heavy CPU throttling (10x+)
2. Play game
3. Verify game remains functional (even if slow)

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ cpuThrottlingRate: 10 })
// Play game (will be very slow)
```

**Pass Criteria**:
- [ ] Game functions despite low FPS
- [ ] No errors due to dropped frames
- [ ] Timer accuracy maintained (±1 second tolerance)

---

### Category E: Browser-Specific Issues (2 tests)

---

#### [ES-021] Window Resize Edge Cases
**Priority**: P3 | **Time**: 2min

**Description**: Rapid window resizing during gameplay.

**Steps**:
1. Start game
2. Rapidly resize window multiple times
3. Verify game adapts or remains stable

**MCP Commands**:
```javascript
mcp__chrome-devtools__resize_page({ width: 1920, height: 1080 })
// Play briefly
mcp__chrome-devtools__resize_page({ width: 1000, height: 800 })
// Play briefly
mcp__chrome-devtools__resize_page({ width: 1600, height: 900 })
```

**Pass Criteria**:
- [ ] No errors during resize
- [ ] Game remains playable
- [ ] Layout reflows correctly

---

#### [ES-022] Tab Switching During Gameplay
**Priority**: P2 | **Time**: 3min

**Description**: Switch tabs/windows during active game.

**Steps**:
1. Start game
2. Switch to another tab (page hidden)
3. Wait 10 seconds
4. Return to game tab
5. Verify game state

**Pass Criteria**:
- [ ] Game pauses OR continues (documented behavior)
- [ ] Timer handled appropriately
- [ ] No errors on tab return
- [ ] Game recovers correctly

---

## 📊 Test Summary

### Total Test Cases: 22

| Category | Test Count | Priority Distribution |
|----------|------------|----------------------|
| Resource Loading | 6 | P1-P3 |
| Browser Compatibility | 6 | P1-P3 |
| Invalid Game States | 5 | P1-P3 |
| Timing & Race Conditions | 3 | P2-P3 |
| Browser-Specific | 2 | P2-P3 |

### Priority Breakdown
- **P1 (High)**: 5 tests (critical error handling)
- **P2 (Medium)**: 13 tests
- **P3 (Low)**: 4 tests

### Pass Criteria
- **Required**: ≥20/22 tests pass (≥91%)
- **Acceptable**: Up to 2 failures (preferably P3)

---

## 🐛 Error Handling Best Practices

### Expected Error Types:
1. **Resource Loading Errors**: Missing files, network failures
2. **JavaScript Errors**: undefined is not a function, null reference
3. **State Errors**: Invalid game state, corrupted data
4. **Timing Errors**: Race conditions, timer issues
5. **Browser Errors**: API unavailable, compatibility issues

### Error Severity Guidelines:
- **Critical (P0)**: Game completely broken, unrecoverable
- **High (P1)**: Major feature broken, poor error handling
- **Medium (P2)**: Minor issues, graceful degradation missing
- **Low (P3)**: Edge case errors, non-critical

### Error Handling Checklist:
- [ ] All errors logged to console
- [ ] User-friendly error messages (where applicable)
- [ ] Graceful degradation (game continues if possible)
- [ ] Recovery mechanisms (retry, reset)
- [ ] No silent failures

---

## 📝 Execution Notes

### Testing Tips:
1. **Use Browser DevTools** extensively
2. **Monitor Console** during all tests
3. **Check Network Tab** for failed requests
4. **Profile Memory** for leak detection
5. **Test in Incognito** for clean state

### Debugging Strategies:
- Enable "Pause on exceptions" in DevTools
- Use verbose error logging
- Test error scenarios in isolation
- Document exact steps to reproduce errors
- Take screenshots of error states

### Common Pitfalls:
- Assuming client-side game has no error scenarios
- Skipping resource loading tests
- Not testing console error handling
- Ignoring memory leaks
- Not testing browser compatibility

---

## 🚨 Critical Error Scenarios

### Must-Fix Errors (P0/P1):
1. **JavaScript errors** that break game loop
2. **Memory leaks** causing browser slowdown
3. **Unhandled exceptions** crashing the game
4. **Resource loading** failures freezing app
5. **Infinite loops** locking browser

### Acceptable Errors (P2/P3):
1. **Console warnings** (non-critical)
2. **Missing optional features** (sound, images)
3. **Edge case errors** (rare scenarios)
4. **Performance degradation** under extreme load

---

## 🔗 Related Documents

- **Previous**: `03-edge-cases.md`
- **Next**: `05-performance.md`
- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`
- **Bug Reports**: `../bugs/`

---

**Remember**: Good error handling distinguishes professional apps from amateur ones!
