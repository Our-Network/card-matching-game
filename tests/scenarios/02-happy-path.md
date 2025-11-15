# Happy Path Tests - Normal User Workflows

## 📋 Overview

**Category**: Happy Path Tests
**Priority**: P1 (High - Should Pass ≥95%)
**Purpose**: Verify normal user workflows and expected behaviors
**Execution**: Every release candidate
**Total Tests**: 25 test scenarios

---

## 🎯 Test Strategy

Happy path tests verify that:
- All normal user workflows complete successfully
- Each difficulty level functions correctly
- Score calculation is accurate
- Timer works as expected
- Win/lose conditions trigger properly
- UI updates reflect game state changes
- Transitions between screens are smooth

**Pass Criteria**: ≥95% pass rate (≤1 failure acceptable)

---

## ✅ Test Cases

### Category A: Difficulty Level Workflows (8 tests)

---

#### Test Case: [HP-001] Easy Difficulty Complete Game

**Priority**: P1
**Estimated Time**: 5 minutes
**Difficulty**: Easy (12 cards, 60 seconds)

**Description**: Complete full game on Easy difficulty from start to victory.

**Test Steps**:
1. Navigate to game → Click START → Select EASY
2. Verify 12 cards displayed in 3x4 grid
3. Verify timer starts at 60 seconds
4. Match all 6 pairs before timer expires
5. Verify victory screen appears
6. Verify final score > 0

**MCP Commands**:
```javascript
// Setup
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})
mcp__chrome-devtools__wait_for({ text: "START" })
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "start-button" })
mcp__chrome-devtools__wait_for({ text: "Select Difficulty" })
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "easy-button" })
mcp__chrome-devtools__wait_for({ text: "Timer:" })

// Get card layout
const cards = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.cards?.map(c => ({ id: c.id, value: c.value }))`
})

// Match all pairs (repeat for each pair)
// ... (matching logic)

// Verify victory
mcp__chrome-devtools__wait_for({ text: "Victory!", timeout: 5000 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/HP-001-victory.png"
})
```

**Pass Criteria**:
- [ ] 12 cards displayed correctly
- [ ] Timer starts at 60s
- [ ] All pairs matchable
- [ ] Victory screen appears
- [ ] Score calculated correctly
- [ ] No console errors

---

#### Test Case: [HP-002] Medium Difficulty Complete Game

**Priority**: P1
**Estimated Time**: 7 minutes
**Difficulty**: Medium (16 cards, 90 seconds)

**Description**: Complete full game on Medium difficulty.

**Test Steps**:
1. Navigate to game → START → Select MEDIUM
2. Verify 16 cards in 4x4 grid
3. Verify timer: 90 seconds
4. Match all 8 pairs
5. Verify victory screen

**Pass Criteria**:
- [ ] 16 cards displayed (4x4 grid)
- [ ] Timer starts at 90s
- [ ] All 8 pairs match correctly
- [ ] Victory condition triggers
- [ ] Score > Easy difficulty score (assuming perfect play)

---

#### Test Case: [HP-003] Hard Difficulty Complete Game

**Priority**: P1
**Estimated Time**: 10 minutes
**Difficulty**: Hard (20 cards, 120 seconds)

**Description**: Complete full game on Hard difficulty.

**Test Steps**:
1. Navigate → START → HARD
2. Verify 20 cards in 4x5 grid
3. Timer: 120 seconds
4. Match all 10 pairs
5. Victory screen

**Pass Criteria**:
- [ ] 20 cards displayed (4x5 or 5x4 grid)
- [ ] Timer: 120s
- [ ] All 10 pairs matchable
- [ ] Victory achieved

---

#### Test Case: [HP-004] Hell Difficulty Complete Game

**Priority**: P1
**Estimated Time**: 15 minutes
**Difficulty**: Hell (30 cards, 180 seconds)

**Description**: Complete full game on Hell difficulty.

**Test Steps**:
1. Navigate → START → HELL
2. Verify 30 cards (5x6 or 6x5 grid)
3. Timer: 180 seconds
4. Match all 15 pairs
5. Victory screen

**Pass Criteria**:
- [ ] 30 cards displayed correctly
- [ ] Timer: 180s
- [ ] All 15 pairs matchable
- [ ] Victory condition works
- [ ] Highest score potential

---

#### Test Case: [HP-005] Easy Difficulty Time Out (Lose Condition)

**Priority**: P1
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify lose condition when timer reaches 0.

**Test Steps**:
1. Start Easy difficulty (60s timer)
2. DO NOT match any pairs
3. Wait for timer to reach 0
4. Verify lose/defeat screen appears
5. Verify loss message displayed

**MCP Commands**:
```javascript
// Start game
// ... (setup steps)

// Wait for timer to expire
const checkTimer = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.timer`
})

// Repeat check every 5 seconds until timer ≤ 0

// Verify game over
mcp__chrome-devtools__wait_for({ text: "Defeat", timeout: 2000 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/HP-005-defeat.png"
})

const finalState = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    screen: window.gameState?.currentScreen,
    timer: window.gameState?.timer
  })`
})
```

**Pass Criteria**:
- [ ] Timer counts down to 0
- [ ] Defeat/loss screen appears
- [ ] Loss message displayed
- [ ] Game state: RESULT
- [ ] Retry button available

---

#### Test Case: [HP-006] Multiple Difficulty Levels in Same Session

**Priority**: P1
**Estimated Time**: 8 minutes

**Description**: Play multiple difficulty levels consecutively without reload.

**Test Steps**:
1. Complete Easy difficulty (win or lose)
2. Click Retry → Select Medium
3. Complete Medium
4. Click Retry → Select Hard
5. Complete Hard
6. Verify each game isolated (no state bleed)

**Pass Criteria**:
- [ ] Each difficulty starts with correct settings
- [ ] No state persistence between games
- [ ] Scores reset properly
- [ ] Timers reset correctly
- [ ] Card counts correct for each difficulty

---

#### Test Case: [HP-007] Difficulty Level Visual Verification

**Priority**: P2
**Estimated Time**: 10 minutes

**Description**: Verify visual layout for all difficulty levels.

**Test Steps**:
1. For each difficulty (Easy, Medium, Hard, Hell):
   - Start game
   - Take screenshot of game board
   - Verify grid layout
   - Verify card spacing
   - Verify UI element positions

**MCP Commands**:
```javascript
// For each difficulty:
mcp__chrome-devtools__resize_page({ width: 1920, height: 1080 })
// Start game at difficulty
mcp__chrome-devtools__take_screenshot({
  filePath: `tests/results/HP-007-${difficulty}-layout.png`
})

// Measure element positions
const layout = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    cardPositions: window.gameState?.cards?.map(c => c.position),
    gridDimensions: { /* grid info */ }
  })`
})
```

**Pass Criteria**:
- [ ] Easy: 3x4 grid fits viewport
- [ ] Medium: 4x4 grid fits viewport
- [ ] Hard: 4x5 or 5x4 grid fits
- [ ] Hell: 5x6 or 6x5 grid fits
- [ ] No card overlap
- [ ] UI elements not obscured
- [ ] Consistent visual design

---

#### Test Case: [HP-008] Difficulty Selection Navigation

**Priority**: P2
**Estimated Time**: 3 minutes

**Description**: Verify all difficulty buttons are clickable and lead to correct games.

**Test Steps**:
1. Reach difficulty selection screen
2. Hover over each difficulty button
3. Verify hover effects
4. Click each button (one at a time, reload between)
5. Verify correct difficulty loads

**Pass Criteria**:
- [ ] All 4 buttons clickable
- [ ] Hover effects work
- [ ] Correct card counts for each
- [ ] Correct timers for each
- [ ] Button labels accurate

---

### Category B: Score System (5 tests)

---

#### Test Case: [HP-009] Base Score Calculation

**Priority**: P1
**Estimated Time**: 3 minutes
**Difficulty**: Easy

**Description**: Verify base score calculation for single pair match.

**Test Steps**:
1. Start Easy difficulty
2. Get initial score (should be 0)
3. Match first pair
4. Get score after first match
5. Verify score increased correctly

**MCP Commands**:
```javascript
const initialScore = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.score`
})
// Expected: 0

// Match a pair
// ... (card matching steps)

const afterScore = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.score`
})
// Expected: > 0 (base match points)
```

**Pass Criteria**:
- [ ] Initial score: 0
- [ ] Score increases after match
- [ ] Score increment consistent
- [ ] Score displayed on UI

---

#### Test Case: [HP-010] Combo System Verification

**Priority**: P1
**Estimated Time**: 4 minutes
**Difficulty**: Easy

**Description**: Verify combo system increases score for consecutive matches.

**Test Steps**:
1. Start Easy difficulty
2. Match first pair (combo = 1)
3. Immediately match second pair (combo = 2)
4. Immediately match third pair (combo = 3)
5. Verify score increases with combo multiplier

**MCP Commands**:
```javascript
// After each match, check score and combo:
const gameState = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    score: window.gameState?.score,
    combo: window.gameState?.combo,
    lastMatchScore: window.gameState?.lastMatchScore
  })`
})
```

**Pass Criteria**:
- [ ] Combo counter increases (1, 2, 3, ...)
- [ ] Score multiplier increases with combo
- [ ] Combo displayed on UI
- [ ] Combo resets on mismatch or timeout

---

#### Test Case: [HP-011] Score Persistence Across Screens

**Priority**: P2
**Estimated Time**: 5 minutes
**Difficulty**: Easy

**Description**: Verify score persists from gameplay to result screen.

**Test Steps**:
1. Complete Easy game (win)
2. Note final score during gameplay
3. Verify same score shown on victory screen
4. Take screenshot of both scores

**Pass Criteria**:
- [ ] Score on victory screen matches gameplay score
- [ ] Score doesn't reset during transition
- [ ] Final score accurate

---

#### Test Case: [HP-012] Score Display Format

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify score displays correctly (formatting, positioning).

**Test Steps**:
1. Start game
2. Match pairs and accumulate score
3. Verify score format (e.g., "Score: 1000")
4. Verify score updates in real-time

**Pass Criteria**:
- [ ] Score formatted correctly
- [ ] Score position visible
- [ ] Real-time updates
- [ ] No overlapping UI elements

---

#### Test Case: [HP-013] Maximum Score Validation

**Priority**: P2
**Estimated Time**: 7 minutes
**Difficulty**: Easy

**Description**: Verify maximum possible score calculation (perfect play).

**Test Steps**:
1. Start Easy difficulty
2. Match all pairs consecutively (maximum combo)
3. Complete in minimum time
4. Verify maximum score achieved

**MCP Commands**:
```javascript
// Match all pairs rapidly without mistakes
// ... (perfect play logic)

const finalScore = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    score: window.gameState?.score,
    maxCombo: window.gameState?.maxComboReached
  })`
})
```

**Pass Criteria**:
- [ ] Maximum combo reached
- [ ] Time bonus applied
- [ ] Score is maximum possible
- [ ] Consistent across attempts

---

### Category C: Timer System (4 tests)

---

#### Test Case: [HP-014] Timer Accuracy Test (10 seconds)

**Priority**: P1
**Estimated Time**: 1 minute
**Difficulty**: Easy

**Description**: Verify timer countdown accuracy over 10 seconds.

**Test Steps**:
1. Start Easy game (60s timer)
2. Record initial timer value and real time
3. Wait exactly 10 seconds (external timer)
4. Record timer value and real time
5. Calculate difference

**MCP Commands**:
```javascript
const t1 = {
  timer: mcp__chrome-devtools__evaluate_script({
    function: `() => window.gameState?.timer`
  }),
  realTime: Date.now()
}

// Wait 10 seconds
mcp__chrome-devtools__wait_for({ text: "", timeout: 10000 })

const t2 = {
  timer: mcp__chrome-devtools__evaluate_script({
    function: `() => window.gameState?.timer`
  }),
  realTime: Date.now()
}

// Calculate: (t1.timer - t2.timer) should ≈ 10 ± 0.2 seconds
// realTime diff should ≈ 10000ms
```

**Pass Criteria**:
- [ ] Timer accuracy within ±200ms over 10 seconds (±2%)
- [ ] Timer decreases linearly
- [ ] No timer freezes or jumps

---

#### Test Case: [HP-015] Timer Display Update Rate

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify timer display updates smoothly.

**Test Steps**:
1. Start game
2. Take multiple screenshots at 1-second intervals
3. Verify timer updates visually
4. Check for smooth countdown (no skips)

**Pass Criteria**:
- [ ] Timer updates at least once per second
- [ ] No visual jumps or freezes
- [ ] Smooth animation/transition

---

#### Test Case: [HP-016] Timer Pause During Card Flip

**Priority**: P2
**Estimated Time**: 3 minutes
**Difficulty**: Easy

**Description**: Verify if timer continues during card flip animations.

**Test Steps**:
1. Start game
2. Record timer before click
3. Click two cards (trigger flip animation)
4. Record timer after animation completes
5. Verify timer continued during animation

**MCP Commands**:
```javascript
const beforeFlip = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.timer`
})

mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" })
mcp__chrome-devtools__wait_for({ text: "", timeout: 1500 })

const afterFlip = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.timer`
})

// Timer should have decreased by ≈1-2 seconds
```

**Pass Criteria**:
- [ ] Timer doesn't pause during animations
- [ ] Timer continues in background
- [ ] Time elapsed ≈ animation duration

---

#### Test Case: [HP-017] Timer Reaches Zero Behavior

**Priority**: P1
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify timer behavior when reaching exactly 0.

**Test Steps**:
1. Start Easy game
2. Wait for timer to reach 5 seconds
3. Watch timer count down: 5, 4, 3, 2, 1, 0
4. Verify game ends immediately at 0
5. Verify defeat screen appears

**MCP Commands**:
```javascript
// Wait until timer ≈ 5 seconds
let timer = 100
while (timer > 5) {
  mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })
  timer = mcp__chrome-devtools__evaluate_script({
    function: `() => window.gameState?.timer`
  })
}

// Record last few seconds
// ... (observe countdown)

// Verify game over at 0
mcp__chrome-devtools__wait_for({ text: "Defeat", timeout: 7000 })
```

**Pass Criteria**:
- [ ] Timer counts down to exactly 0
- [ ] Game ends at 0 (not negative)
- [ ] Defeat screen appears immediately
- [ ] No timer display glitches

---

### Category D: UI & Visual Feedback (4 tests)

---

#### Test Case: [HP-018] Card Hover Effects

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify hover effects on cards.

**Test Steps**:
1. Start game
2. Hover over face-down card
3. Take screenshot of hover state
4. Verify visual feedback (scale, glow, etc.)
5. Move mouse away, verify hover removed

**MCP Commands**:
```javascript
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__hover({ uid: "card-3" })
mcp__chrome-devtools__wait_for({ text: "", timeout: 300 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/HP-018-hover.png"
})
```

**Pass Criteria**:
- [ ] Hover effect visible
- [ ] Effect smooth (no lag)
- [ ] Effect removed on mouse out
- [ ] Matched cards don't show hover

---

#### Test Case: [HP-019] Card Flip Animation Smoothness

**Priority**: P2
**Estimated Time**: 3 minutes
**Difficulty**: Easy

**Description**: Verify card flip animations are smooth.

**Test Steps**:
1. Start game
2. Click several cards one at a time
3. Observe flip animations
4. Take video/screenshots during flips
5. Verify smooth rotation

**Pass Criteria**:
- [ ] Flip animation completes smoothly
- [ ] No stuttering or lag
- [ ] Consistent animation speed
- [ ] Face reveals correctly

---

#### Test Case: [HP-020] Match Success Visual Feedback

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify visual feedback when pairs match.

**Test Steps**:
1. Start game
2. Match a pair
3. Observe success animation (particle effect, glow, etc.)
4. Take screenshot of match feedback
5. Verify matched cards stay face-up

**MCP Commands**:
```javascript
// Match a pair
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-6" })
mcp__chrome-devtools__wait_for({ text: "", timeout: 500 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/HP-020-match-feedback.png"
})

// Verify cards stay flipped
const cards = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.cards?.filter(c => c.id === 0 || c.id === 6)`
})
// Expect: both have matched: true, flipped: true
```

**Pass Criteria**:
- [ ] Success animation plays
- [ ] Matched cards stay face-up
- [ ] Visual distinction for matched cards
- [ ] Animation completes without errors

---

#### Test Case: [HP-021] Mismatch Visual Feedback

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify visual feedback when pairs don't match.

**Test Steps**:
1. Start game
2. Click two non-matching cards
3. Observe mismatch behavior
4. Verify cards flip back after delay
5. Take screenshots before/after

**MCP Commands**:
```javascript
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" }) // Non-matching
mcp__chrome-devtools__wait_for({ text: "", timeout: 1500 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/HP-021-mismatch.png"
})

// Verify cards flipped back
const cards = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.cards?.filter(c => c.id === 0 || c.id === 1)`
})
// Expect: both have flipped: false
```

**Pass Criteria**:
- [ ] Cards flip back after delay (~1 second)
- [ ] Delay appropriate for user to see
- [ ] No stuck cards
- [ ] Combo resets (if applicable)

---

### Category E: Retry & Reset Functionality (4 tests)

---

#### Test Case: [HP-022] Retry Button After Victory

**Priority**: P1
**Estimated Time**: 3 minutes
**Difficulty**: Easy

**Description**: Verify retry button works after winning.

**Test Steps**:
1. Complete Easy game (win)
2. Verify Retry button appears
3. Click Retry button
4. Verify return to difficulty selection
5. Start new game

**MCP Commands**:
```javascript
// Complete game
// ... (win condition reached)

mcp__chrome-devtools__wait_for({ text: "Retry" })
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "retry-button" })
mcp__chrome-devtools__wait_for({ text: "Select Difficulty", timeout: 3000 })

// Verify reset
const state = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    screen: window.gameState?.currentScreen,
    score: window.gameState?.score,
    timer: window.gameState?.timer
  })`
})
// Expect: screen = START or DIFFICULTY, score = 0, timer reset
```

**Pass Criteria**:
- [ ] Retry button appears after victory
- [ ] Button clickable
- [ ] Returns to difficulty selection
- [ ] Game state resets
- [ ] Can start new game

---

#### Test Case: [HP-023] Retry Button After Defeat

**Priority**: P1
**Estimated Time**: 3 minutes
**Difficulty**: Easy

**Description**: Verify retry button works after losing.

**Test Steps**:
1. Start Easy game
2. Wait for timer to expire (lose)
3. Verify Retry button appears
4. Click Retry
5. Start new game

**Pass Criteria**:
- [ ] Retry button appears after defeat
- [ ] Button clickable
- [ ] Returns to difficulty selection
- [ ] Can retry same or different difficulty

---

#### Test Case: [HP-024] ESC Key Reset Functionality

**Priority**: P2
**Estimated Time**: 2 minutes
**Difficulty**: Easy

**Description**: Verify ESC key resets game to start screen.

**Test Steps**:
1. Start game and play partially
2. Press ESC key
3. Verify immediate return to start screen
4. Verify game state reset

**MCP Commands**:
```javascript
// Start game
// ... (play partially)

mcp__chrome-devtools__press_key({ key: "Escape" })
mcp__chrome-devtools__wait_for({ text: "START", timeout: 2000 })

const state = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.currentScreen`
})
// Expect: "START"
```

**Pass Criteria**:
- [ ] ESC key resets immediately
- [ ] Returns to start screen
- [ ] Game state cleared
- [ ] No errors during reset

---

#### Test Case: [HP-025] Multiple Retry Cycles

**Priority**: P2
**Estimated Time**: 5 minutes

**Description**: Verify retry works correctly across multiple games.

**Test Steps**:
1. Complete game → Retry → Complete → Retry → Complete
2. Verify state resets each time
3. Verify no memory leaks or performance degradation
4. Verify scores don't carry over

**Pass Criteria**:
- [ ] Each game starts fresh
- [ ] No state bleed between games
- [ ] Performance consistent
- [ ] No increasing errors

---

## 📊 Test Summary

### Total Test Cases: 25

| Category | Test Count | Priority |
|----------|------------|----------|
| Difficulty Workflows | 8 | P1 |
| Score System | 5 | P1-P2 |
| Timer System | 4 | P1-P2 |
| UI & Visual | 4 | P2 |
| Retry & Reset | 4 | P1-P2 |

### Priority Breakdown
- **P1 (High)**: 15 tests
- **P2 (Medium)**: 10 tests

### Pass Criteria
- **Required**: ≥24/25 tests pass (≥96%)
- **Acceptable**: 1 P2 test may fail

---

## 📝 Execution Notes

### Test Order Recommendation
1. Run all P1 tests first (15 tests)
2. If P1 pass rate < 95%, stop and fix issues
3. Run P2 tests (10 tests)
4. Document any failures

### Environment
- Browser: Chrome (latest)
- Viewport: 1920x1080
- Network: WiFi or Fast 4G
- CPU: No throttling

---

## 🔗 Related Documents

- **Previous**: `01-smoke-tests.md`
- **Next**: `03-edge-cases.md`
- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`

---

**Note**: These tests assume smoke tests (ST-001 to ST-008) passed 100%!
