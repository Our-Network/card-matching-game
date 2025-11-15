# Edge Case Tests - Boundary Conditions & Unusual Scenarios

## 📋 Overview

**Category**: Edge Case Tests
**Priority**: P2 (Medium - Should Pass ≥90%)
**Purpose**: Test boundary conditions, unusual behaviors, and edge cases that might cause bugs
**Execution**: Release candidates and major updates
**Total Tests**: 35 test scenarios

---

## 🎯 Test Strategy

Edge case tests verify:
- Rapid user interactions don't break the game
- Boundary values handled correctly
- Timing-sensitive operations work under stress
- Unusual but valid user behaviors function properly
- State transitions handle edge conditions
- Animation interruptions don't cause errors

**Pass Criteria**: ≥90% pass rate (≤3 failures acceptable)

---

## ✅ Test Cases

### Category A: Rapid Interactions (8 tests)

---

#### [EC-001] Rapid Card Clicking
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Click cards rapidly in succession to test click handling.

**Steps**:
1. Start Easy game
2. Rapidly click multiple cards (5-10 clicks within 2 seconds)
3. Verify game handles clicks properly

**MCP Commands**:
```javascript
mcp__chrome-devtools__take_snapshot({})
// Rapid clicks (no delays)
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" })
mcp__chrome-devtools__click({ uid: "card-2" })
mcp__chrome-devtools__click({ uid: "card-3" })
mcp__chrome-devtools__click({ uid: "card-4" })
// Check state
mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    firstCard: window.gameState?.firstCard,
    secondCard: window.gameState?.secondCard,
    locked: window.gameState?.locked
  })`
})
```

**Pass Criteria**:
- [ ] Only 2 cards flip at a time
- [ ] Additional clicks ignored during match evaluation
- [ ] No stuck flipped cards
- [ ] No console errors
- [ ] Game remains playable

---

#### [EC-002] Double-Click Same Card
**Priority**: P2 | **Time**: 1min | **Difficulty**: Easy

**Description**: Double-click the same card rapidly.

**Steps**:
1. Start game
2. Double-click a single card quickly
3. Verify card doesn't glitch or flip twice

**Pass Criteria**:
- [ ] Card flips once only
- [ ] Second click ignored
- [ ] No animation glitches

---

#### [EC-003] Click During Flip Animation
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Click a third card while two cards are flipping.

**Steps**:
1. Click first card → immediately click second → immediately click third
2. Verify third click handled appropriately

**Pass Criteria**:
- [ ] Third click queued or ignored
- [ ] First two cards complete flip
- [ ] No animation interruption
- [ ] Game state consistent

---

#### [EC-004] Click Already Matched Card
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Click on cards that are already matched.

**Steps**:
1. Match a pair successfully
2. Try clicking matched cards
3. Verify clicks ignored

**Pass Criteria**:
- [ ] Matched cards not clickable
- [ ] No state changes
- [ ] No visual feedback on click

---

#### [EC-005] Rapid Retry Button Clicking
**Priority**: P2 | **Time**: 2min

**Description**: Rapidly click Retry button multiple times.

**Steps**:
1. Complete game (win or lose)
2. Rapidly click Retry 5+ times
3. Verify single transition to difficulty screen

**Pass Criteria**:
- [ ] Single transition occurs
- [ ] No duplicate game initializations
- [ ] No console errors

---

#### [EC-006] Rapid Difficulty Selection
**Priority**: P2 | **Time**: 2min

**Description**: Rapidly click different difficulty buttons.

**Steps**:
1. Reach difficulty screen
2. Quickly click Easy → Medium → Hard in succession
3. Verify only one difficulty starts

**Pass Criteria**:
- [ ] Only last clicked difficulty starts
- [ ] OR first click processed, others ignored
- [ ] No conflicting game states

---

#### [EC-007] Spam START Button
**Priority**: P2 | **Time**: 1min

**Description**: Rapidly click START button multiple times.

**Steps**:
1. On start screen, click START 10+ times rapidly
2. Verify single transition

**Pass Criteria**:
- [ ] Single transition to difficulty screen
- [ ] No duplicate screens
- [ ] No errors

---

#### [EC-008] Click During Screen Transition
**Priority**: P2 | **Time**: 2min

**Description**: Click elements during screen transitions.

**Steps**:
1. Click START
2. Immediately try clicking on transitioning elements
3. Verify clicks ignored or queued appropriately

**Pass Criteria**:
- [ ] Transition completes smoothly
- [ ] No premature interactions
- [ ] No broken state

---

### Category B: Timer Edge Cases (6 tests)

---

#### [EC-009] Timer at Exactly 1 Second
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Test behavior when timer is at exactly 1 second.

**Steps**:
1. Start Easy (60s timer)
2. Wait until timer = 1 second
3. Quickly match a pair
4. Verify if match counts or game ends

**MCP Commands**:
```javascript
// Wait until timer ≈ 1
let timer = 100
while (timer > 1.5) {
  mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })
  timer = mcp__chrome-devtools__evaluate_script({
    function: `() => window.gameState?.timer`
  })
}
// Try to match a pair
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" })
// Check if game ends or match counts
```

**Pass Criteria**:
- [ ] Consistent behavior (either match counts or doesn't)
- [ ] Timer reaches 0 gracefully
- [ ] No timer going negative

---

#### [EC-010] Match Exactly at Timer Zero
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Click cards at the exact moment timer hits 0.

**Steps**:
1. Wait until timer ≈ 0.5 seconds
2. Click two cards
3. Verify race condition handled

**Pass Criteria**:
- [ ] Either match counts or game ends
- [ ] No stuck state
- [ ] Consistent behavior

---

#### [EC-011] Last Second Victory
**Priority**: P2 | **Time**: 5min | **Difficulty**: Easy

**Description**: Win game with <1 second remaining.

**Steps**:
1. Match all pairs except last one
2. Wait until timer < 1 second
3. Match final pair
4. Verify victory (not defeat)

**Pass Criteria**:
- [ ] Victory screen appears
- [ ] Not defeat screen
- [ ] Timer bonus calculated correctly

---

#### [EC-012] Timer Display at Boundary Values
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Verify timer displays correctly at boundaries (59, 60, 0, 1).

**Steps**:
1. Start Easy (60s)
2. Observe timer at: 60s, 59s, 30s, 10s, 5s, 1s, 0s
3. Take screenshots at each boundary

**Pass Criteria**:
- [ ] Timer displays correctly at all boundaries
- [ ] No display glitches (e.g., "60:00" vs "1:00")
- [ ] Consistent formatting

---

#### [EC-013] Timer After Page Visibility Change
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Test timer behavior when tab loses/gains focus.

**Steps**:
1. Start game
2. Switch to another tab (page hidden)
3. Wait 5 seconds
4. Return to game tab
5. Verify timer continued or handled appropriately

**Pass Criteria**:
- [ ] Timer doesn't run during hidden state (OR)
- [ ] Timer continues and accounts for hidden time
- [ ] Consistent documented behavior

---

#### [EC-014] Timer During Performance Lag
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Test timer accuracy under CPU throttling.

**Steps**:
1. Enable 4x CPU throttling
2. Start game
3. Measure timer over 10 seconds
4. Verify accuracy maintained

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ cpuThrottlingRate: 4 })
// Start game and measure timer
// ... (timing test)
mcp__chrome-devtools__emulate({ cpuThrottlingRate: 1 }) // Reset
```

**Pass Criteria**:
- [ ] Timer accuracy ±500ms (more tolerance under throttling)
- [ ] Game remains playable
- [ ] No timer freezes

---

### Category C: Card State Edge Cases (7 tests)

---

#### [EC-015] First and Last Cards as Pair
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Match the first (index 0) and last (index 11) cards.

**Steps**:
1. Start Easy game
2. Find cards at position 0 and 11 that match
3. Match them
4. Verify match works correctly

**Pass Criteria**:
- [ ] First and last cards match successfully
- [ ] No index boundary errors

---

#### [EC-016] All Cards of Same Type (Impossible Scenario Test)
**Priority**: P3 | **Time**: N/A

**Description**: Test if game prevents generating all same-value cards (should be impossible).

**Steps**:
1. Code inspection: verify card generation logic
2. Ensure card values distributed correctly

**Pass Criteria**:
- [ ] Card generation ensures pairs
- [ ] No duplicate values beyond pairs

---

#### [EC-017] Single Remaining Pair
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Test behavior with only one unmatched pair remaining.

**Steps**:
1. Match 5 out of 6 pairs
2. Leave 1 pair remaining
3. Match final pair
4. Verify victory triggers

**Pass Criteria**:
- [ ] Victory triggers correctly
- [ ] Remaining pair counter shows 1 → 0
- [ ] Score calculated correctly

---

#### [EC-018] Flip Same Card Twice (Back and Forth)
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Click card → let it flip back → click same card again.

**Steps**:
1. Click card (flips)
2. Click non-matching card
3. Both flip back after delay
4. Click first card again
5. Verify second flip works

**Pass Criteria**:
- [ ] Card flips again correctly
- [ ] No state corruption
- [ ] Animation plays fully

---

#### [EC-019] Match Interruption by Timer Expiry
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Timer expires during match evaluation.

**Steps**:
1. Wait until timer < 2 seconds
2. Click two cards (start match evaluation)
3. Timer expires during evaluation
4. Verify behavior (game ends immediately or match completes)

**Pass Criteria**:
- [ ] Consistent behavior
- [ ] No stuck state
- [ ] Either match counts or doesn't (documented)

---

#### [EC-020] Hover Then Click Rapidly
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Hover over card, then immediately click.

**Steps**:
1. Hover over card
2. Immediately click while hover effect active
3. Verify click registers

**Pass Criteria**:
- [ ] Click registers correctly
- [ ] Hover doesn't block click
- [ ] Animation transitions smoothly

---

#### [EC-021] Matched Cards Hover (Should Not Respond)
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Hover over already matched cards.

**Steps**:
1. Match a pair
2. Hover over matched cards
3. Verify no hover effect

**Pass Criteria**:
- [ ] No hover effect on matched cards
- [ ] Matched cards visually distinct

---

### Category D: Score Edge Cases (5 tests)

---

#### [EC-022] Score Overflow Test (Maximum Score)
**Priority**: P3 | **Time**: 10min | **Difficulty**: Hell

**Description**: Achieve maximum possible score to test overflow.

**Steps**:
1. Play Hell difficulty (30 cards)
2. Match all pairs with maximum combo
3. Complete in minimum time
4. Verify score displays correctly (no overflow)

**Pass Criteria**:
- [ ] Score calculated correctly
- [ ] No integer overflow (if score uses integers)
- [ ] Score displays without truncation

---

#### [EC-023] Zero Score Victory (Impossible?)
**Priority**: P3 | **Time**: N/A

**Description**: Verify it's impossible to win with 0 score.

**Steps**:
1. Code inspection: minimum score for victory
2. Ensure score > 0 for any match

**Pass Criteria**:
- [ ] Victory requires score > 0
- [ ] Score system properly implemented

---

#### [EC-024] Combo Reset on Mismatch
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Verify combo resets to 0 after mismatch.

**Steps**:
1. Build combo to 3 (match 3 pairs consecutively)
2. Mismatch a pair
3. Verify combo resets to 0
4. Match next pair, combo should be 1

**MCP Commands**:
```javascript
// After 3 matches
const beforeMismatch = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.combo`
})
// Expected: 3

// Mismatch
mcp__chrome-devtools__click({ uid: "card-x" })
mcp__chrome-devtools__click({ uid: "card-y" }) // Non-matching
mcp__chrome-devtools__wait_for({ text: "", timeout: 1500 })

const afterMismatch = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.combo`
})
// Expected: 0
```

**Pass Criteria**:
- [ ] Combo resets to 0 on mismatch
- [ ] Next match starts combo at 1
- [ ] Combo display updates correctly

---

#### [EC-025] Score Update Timing (Visual Lag)
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Verify score updates immediately after match.

**Steps**:
1. Match a pair
2. Check score immediately (within 100ms)
3. Verify score increased

**Pass Criteria**:
- [ ] Score updates within 100ms of match
- [ ] No delayed score update
- [ ] Visual feedback immediate

---

#### [EC-026] Final Score Consistency
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Verify final score on victory screen matches last displayed score.

**Steps**:
1. Complete game
2. Note score before last match
3. Match final pair
4. Compare final score on victory screen

**Pass Criteria**:
- [ ] Scores match exactly
- [ ] Final score = gameplay score + final match points

---

### Category E: UI Boundary Cases (5 tests)

---

#### [EC-027] Grid Layout with Odd Card Counts
**Priority**: P2 | **Time**: 3min | **Difficulty**: All

**Description**: Verify grid layouts for all difficulties (12, 16, 20, 30).

**Steps**:
1. For each difficulty:
   - Start game
   - Take screenshot
   - Verify grid dimensions
   - Check for card overlap or gaps

**Pass Criteria**:
- [ ] Easy: 3x4 or 4x3 grid (12 cards)
- [ ] Medium: 4x4 grid (16 cards)
- [ ] Hard: 4x5 or 5x4 grid (20 cards)
- [ ] Hell: 5x6 or 6x5 grid (30 cards)
- [ ] No card overlaps
- [ ] Even spacing

---

#### [EC-028] Screen Resize During Gameplay
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Resize browser window during active game.

**Steps**:
1. Start game at 1920x1080
2. Resize to 1366x768 during gameplay
3. Verify layout adjusts or remains stable

**MCP Commands**:
```javascript
mcp__chrome-devtools__resize_page({ width: 1920, height: 1080 })
// Start game
mcp__chrome-devtools__resize_page({ width: 1366, height: 768 })
// Verify game still playable
```

**Pass Criteria**:
- [ ] Game remains playable
- [ ] Cards still clickable
- [ ] UI elements visible
- [ ] No layout breaks

---

#### [EC-029] Very Small Viewport
**Priority**: P3 | **Time**: 2min | **Difficulty**: Easy

**Description**: Test game at minimum reasonable viewport (800x600).

**Steps**:
1. Resize to 800x600
2. Start Easy game
3. Verify playability

**MCP Commands**:
```javascript
mcp__chrome-devtools__resize_page({ width: 800, height: 600 })
```

**Pass Criteria**:
- [ ] Game loads
- [ ] Cards visible (may be small)
- [ ] Buttons clickable
- [ ] Critical UI elements accessible

---

#### [EC-030] Very Large Viewport
**Priority**: P3 | **Time**: 2min | **Difficulty**: Easy

**Description**: Test game at large viewport (2560x1440).

**Steps**:
1. Resize to 2560x1440
2. Start game
3. Verify layout scales appropriately

**MCP Commands**:
```javascript
mcp__chrome-devtools__resize_page({ width: 2560, height: 1440 })
```

**Pass Criteria**:
- [ ] Game centered or fills space appropriately
- [ ] Cards not excessively large
- [ ] UI proportions maintained

---

#### [EC-031] Long Game Session (Memory Leak Test)
**Priority**: P2 | **Time**: 15min | **Difficulty**: Easy

**Description**: Play multiple consecutive games to test for memory leaks.

**Steps**:
1. Complete 10 consecutive games (win or lose)
2. Monitor memory usage after each game
3. Verify no significant memory growth

**MCP Commands**:
```javascript
// Before games
const memBefore = mcp__chrome-devtools__evaluate_script({
  function: `() => performance.memory?.usedJSHeapSize`
})

// Play 10 games
// ... (game loops)

// After games
const memAfter = mcp__chrome-devtools__evaluate_script({
  function: `() => performance.memory?.usedJSHeapSize`
})
// Calculate growth: should be minimal
```

**Pass Criteria**:
- [ ] Memory growth < 50MB after 10 games
- [ ] No significant performance degradation
- [ ] No increasing console errors

---

### Category F: Keyboard Shortcut Edge Cases (4 tests)

---

#### [EC-032] ESC During Match Evaluation
**Priority**: P2 | **Time**: 2min | **Difficulty**: Easy

**Description**: Press ESC while cards are evaluating a match.

**Steps**:
1. Click two cards (start match evaluation)
2. Immediately press ESC during evaluation
3. Verify reset happens cleanly

**MCP Commands**:
```javascript
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" })
// Immediately press ESC (no wait)
mcp__chrome-devtools__press_key({ key: "Escape" })
```

**Pass Criteria**:
- [ ] Game resets immediately
- [ ] No stuck animations
- [ ] Returns to start screen

---

#### [EC-033] Rapid ESC Key Spam
**Priority**: P2 | **Time**: 1min | **Difficulty**: Easy

**Description**: Rapidly press ESC multiple times.

**Steps**:
1. Start game
2. Press ESC 10+ times rapidly
3. Verify single reset occurs

**Pass Criteria**:
- [ ] Single reset to start screen
- [ ] No multiple resets or errors

---

#### [EC-034] Debug Key (G) During Gameplay
**Priority**: P3 | **Time**: 2min | **Difficulty**: Easy

**Description**: Press G key (debug mode) during active game.

**Steps**:
1. Start game
2. Press G key
3. Verify debug mode toggles
4. Verify game still playable

**Pass Criteria**:
- [ ] Debug mode activates/deactivates
- [ ] Game remains playable
- [ ] No errors

---

#### [EC-035] Hitbox Display (D) Toggle During Gameplay
**Priority**: P3 | **Time**: 2min | **Difficulty**: Easy

**Description**: Press D key to toggle hitbox display during gameplay.

**Steps**:
1. Start game
2. Press D key
3. Verify hitboxes shown/hidden
4. Verify clicks still register correctly

**Pass Criteria**:
- [ ] Hitbox display toggles
- [ ] Game remains playable
- [ ] Click detection unaffected

---

## 📊 Test Summary

### Total Test Cases: 35

| Category | Test Count | Priority Distribution |
|----------|------------|----------------------|
| Rapid Interactions | 8 | P2 |
| Timer Edge Cases | 6 | P2 |
| Card State Edge Cases | 7 | P2-P3 |
| Score Edge Cases | 5 | P2-P3 |
| UI Boundary Cases | 5 | P2-P3 |
| Keyboard Shortcuts | 4 | P2-P3 |

### Priority Breakdown
- **P2 (Medium)**: 29 tests
- **P3 (Low)**: 6 tests

### Pass Criteria
- **Required**: ≥32/35 tests pass (≥91%)
- **Acceptable**: Up to 3 failures (preferably P3)

---

## 🐛 Common Issues Expected

### Likely Bug Areas:
1. **Race Conditions**: Timer expiry during match evaluation
2. **Rapid Clicks**: Multiple clicks breaking state machine
3. **Animation Interruptions**: ESC or new clicks during animations
4. **Boundary Values**: Timer at 0 or 1 second behavior
5. **Memory Leaks**: Multiple game sessions increasing memory
6. **UI Scaling**: Extreme viewport sizes breaking layout

### Bug Severity Guidelines:
- **P0**: Game crashes, data loss, broken core mechanics
- **P1**: Major features broken, poor UX, significant bugs
- **P2**: Minor issues, edge case bugs, cosmetic problems
- **P3**: Rare bugs, non-critical issues, nice-to-fix

---

## 📝 Execution Notes

### Best Practices for Edge Case Testing:
1. **Document unexpected behaviors** even if they don't cause errors
2. **Take screenshots** of visual glitches or anomalies
3. **Record console messages** for all tests
4. **Note timing issues** (race conditions, delays)
5. **Test multiple times** for flaky behaviors

### Debugging Tips:
- Use browser DevTools Timeline for performance issues
- Enable verbose logging for state transitions
- Use slow motion or breakpoints for rapid interaction tests
- Monitor memory usage for long session tests

---

## 🔗 Related Documents

- **Previous**: `02-happy-path.md`
- **Next**: `04-error-scenarios.md`
- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`

---

**Remember**: Edge cases often reveal the most critical bugs in production!
