# Smoke Tests - Critical Path Validation

## 📋 Overview

**Category**: Smoke Tests
**Priority**: P0 (Blocker - Must Pass 100%)
**Purpose**: Validate critical functionality before deeper testing
**Execution**: Every build, before any other tests
**Total Tests**: 8 critical scenarios

---

## 🎯 Test Strategy

Smoke tests verify that:
- Application launches without critical errors
- All major screens are accessible
- Basic user flow works end-to-end
- No console errors block basic functionality
- Core game mechanics function at minimum level

**Pass Criteria**: 100% pass rate (any failure blocks further testing)

---

## ✅ Test Cases

### Test Case: [ST-001] Application Launch

**Priority**: P0 (Critical)
**Estimated Time**: 1 minute

#### Description
Verify that the application loads successfully without critical errors.

#### Preconditions
- Browser: Chrome (latest stable)
- Clean browser state (no cache)
- Test URL: `file:///Users/musinsa/study/media-tech-team-prj/index.html`

#### Test Steps

**Step 1**: Navigate to game URL
```javascript
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///Users/musinsa/study/media-tech-team-prj/index.html"
})
```

**Expected**: Page loads within 3 seconds

**Step 2**: Wait for START button to appear
```javascript
mcp__chrome-devtools__wait_for({ text: "START", timeout: 5000 })
```

**Expected**: START button visible within 5 seconds

**Step 3**: Take page snapshot
```javascript
mcp__chrome-devtools__take_snapshot({
  filePath: "tests/results/ST-001-snapshot.txt"
})
```

**Expected**:
- Title "Memory Card Game" visible
- START button present
- No loading indicators stuck

**Step 4**: Check for console errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: Zero console errors

**Step 5**: Verify network requests
```javascript
mcp__chrome-devtools__list_network_requests({})
```

**Expected**:
- All resources loaded successfully (status 200)
- No 404 or 500 errors
- p5.js library loaded

#### Pass Criteria
- [ ] Page loads in <3 seconds
- [ ] START button visible
- [ ] No console errors
- [ ] All resources loaded successfully
- [ ] Game title displayed correctly

#### Actual Results
[To be filled during test execution]

#### Notes
- This is the most critical test - all other tests depend on this passing
- If this fails, stop all testing and investigate immediately

---

### Test Case: [ST-002] Start Screen to Difficulty Selection

**Priority**: P0 (Critical)
**Estimated Time**: 1 minute

#### Description
Verify navigation from Start screen to Difficulty Selection screen.

#### Preconditions
- Application loaded successfully (ST-001 passed)
- On Start screen

#### Test Steps

**Step 1**: Take initial snapshot
```javascript
mcp__chrome-devtools__take_snapshot({})
```

**Expected**: START button visible with uid

**Step 2**: Click START button
```javascript
// Get uid from snapshot, example: "start-button"
mcp__chrome-devtools__click({ uid: "start-button" })
```

**Expected**: Screen transitions to Difficulty Selection

**Step 3**: Wait for difficulty screen
```javascript
mcp__chrome-devtools__wait_for({
  text: "Select Difficulty",
  timeout: 3000
})
```

**Expected**: "Select Difficulty" text appears within 3 seconds

**Step 4**: Verify difficulty buttons present
```javascript
mcp__chrome-devtools__take_snapshot({
  filePath: "tests/results/ST-002-difficulty-screen.txt"
})
```

**Expected**: All 4 difficulty buttons visible:
- EASY (12 cards)
- MEDIUM (16 cards)
- HARD (20 cards)
- HELL (30 cards)

**Step 5**: Take screenshot
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-002-difficulty-screen.png"
})
```

**Expected**: Difficulty selection screen displayed correctly

**Step 6**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No new console errors

#### Pass Criteria
- [ ] START button clickable
- [ ] Screen transitions smoothly
- [ ] All 4 difficulty buttons visible
- [ ] No console errors
- [ ] Transition completes in <3 seconds

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-003] Difficulty Selection to Game Start

**Priority**: P0 (Critical)
**Estimated Time**: 1 minute
**Difficulty**: Easy

#### Description
Verify selecting a difficulty level starts the game correctly.

#### Preconditions
- On Difficulty Selection screen (ST-002 passed)

#### Test Steps

**Step 1**: Take snapshot of difficulty screen
```javascript
mcp__chrome-devtools__take_snapshot({})
```

**Expected**: All difficulty buttons visible with uids

**Step 2**: Click EASY difficulty button
```javascript
// Get uid from snapshot, example: "easy-button"
mcp__chrome-devtools__click({ uid: "easy-button" })
```

**Expected**: Game initializes with Easy difficulty (12 cards)

**Step 3**: Wait for game to start
```javascript
mcp__chrome-devtools__wait_for({ text: "Timer:", timeout: 5000 })
```

**Expected**: Game UI appears within 5 seconds

**Step 4**: Verify game UI elements
```javascript
mcp__chrome-devtools__take_snapshot({
  filePath: "tests/results/ST-003-game-start.txt"
})
```

**Expected**: Game UI contains:
- Timer display
- Score display
- Pairs remaining display
- 12 cards (3x4 grid for Easy)

**Step 5**: Verify initial game state
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      screen: window.gameState?.currentScreen,
      timer: window.gameState?.timer,
      score: window.gameState?.score,
      cardCount: window.gameState?.cards?.length
    };
  }`
})
```

**Expected**:
- screen: "PLAYING"
- timer: 60 (Easy difficulty time limit)
- score: 0
- cardCount: 12

**Step 6**: Take screenshot of game board
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-003-game-board.png"
})
```

**Expected**: Game board displayed with 12 face-down cards

**Step 7**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No console errors

#### Pass Criteria
- [ ] Easy difficulty button clickable
- [ ] Game initializes within 5 seconds
- [ ] 12 cards displayed in grid
- [ ] Timer starts at 60 seconds
- [ ] Score starts at 0
- [ ] Game state is "PLAYING"
- [ ] No console errors

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-004] Basic Card Interaction

**Priority**: P0 (Critical)
**Estimated Time**: 2 minutes
**Difficulty**: Easy

#### Description
Verify basic card flipping and interaction works.

#### Preconditions
- Game started on Easy difficulty (ST-003 passed)
- 12 cards displayed face-down

#### Test Steps

**Step 1**: Take initial game snapshot
```javascript
mcp__chrome-devtools__take_snapshot({})
```

**Expected**: All 12 cards visible with uids

**Step 2**: Click first card
```javascript
// Get first card uid from snapshot, example: "card-0"
mcp__chrome-devtools__click({ uid: "card-0" })
```

**Expected**: Card flips to show face

**Step 3**: Wait for flip animation (brief pause)
```javascript
// Wait 500ms for animation
mcp__chrome-devtools__wait_for({ text: "", timeout: 500 })
```

**Step 4**: Verify first card flipped
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      firstCard: window.gameState?.firstCard?.id,
      firstCardFlipped: window.gameState?.firstCard?.flipped
    };
  }`
})
```

**Expected**:
- firstCard: 0 (or the clicked card ID)
- firstCardFlipped: true

**Step 5**: Click second card (different from first)
```javascript
// Get second card uid, example: "card-1"
mcp__chrome-devtools__click({ uid: "card-1" })
```

**Expected**: Second card flips

**Step 6**: Wait for match/mismatch logic
```javascript
// Wait 1 second for match evaluation
mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })
```

**Step 7**: Verify cards flipped back (if mismatch)
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      firstCard: window.gameState?.firstCard,
      secondCard: window.gameState?.secondCard,
      cards: window.gameState?.cards?.map(c => ({
        id: c.id,
        flipped: c.flipped,
        matched: c.matched
      }))
    };
  }`
})
```

**Expected**:
- If match: both cards stay flipped, matched: true
- If mismatch: both cards flip back, flipped: false

**Step 8**: Take screenshot after interaction
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-004-after-interaction.png"
})
```

**Step 9**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No console errors

#### Pass Criteria
- [ ] First card flips when clicked
- [ ] Second card flips when clicked
- [ ] Match/mismatch logic executes
- [ ] Cards behave correctly (stay flipped if match, flip back if mismatch)
- [ ] No console errors
- [ ] No stuck animations

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-005] Timer Countdown Basic Functionality

**Priority**: P0 (Critical)
**Estimated Time**: 2 minutes
**Difficulty**: Easy

#### Description
Verify that the timer counts down during gameplay.

#### Preconditions
- Game started on Easy difficulty (ST-003 passed)
- Timer visible and running

#### Test Steps

**Step 1**: Get initial timer value
```javascript
const initialTimer = mcp__chrome-devtools__evaluate_script({
  function: `() => { return window.gameState?.timer; }`
})
```

**Expected**: Timer value ≈ 60 seconds (Easy difficulty)

**Step 2**: Wait 3 seconds
```javascript
// Use external timing or wait mechanism
mcp__chrome-devtools__wait_for({ text: "", timeout: 3000 })
```

**Step 3**: Get timer value after 3 seconds
```javascript
const afterTimer = mcp__chrome-devtools__evaluate_script({
  function: `() => { return window.gameState?.timer; }`
})
```

**Expected**: Timer decreased by approximately 3 seconds (±0.2 seconds tolerance)

**Step 4**: Verify timer display updates
```javascript
mcp__chrome-devtools__take_snapshot({})
```

**Expected**: Timer display shows updated value

**Step 5**: Take screenshot of timer
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-005-timer.png"
})
```

**Step 6**: Validate timer math
```javascript
// Calculate difference: initialTimer - afterTimer should be ≈ 3
// Tolerance: ±0.2 seconds (accounting for execution time)
```

**Expected**: Timer decreased correctly

**Step 7**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No console errors

#### Pass Criteria
- [ ] Timer starts at correct value (60s for Easy)
- [ ] Timer counts down continuously
- [ ] Timer accuracy within ±0.2 seconds
- [ ] Timer display updates visually
- [ ] No console errors

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-006] Complete Game Flow (Quick Win)

**Priority**: P0 (Critical)
**Estimated Time**: 5 minutes
**Difficulty**: Easy

#### Description
Verify complete game flow from start to victory screen by matching all pairs.

#### Preconditions
- Game can be started (ST-001, ST-002, ST-003 passed)
- Card interaction works (ST-004 passed)

#### Test Steps

**Step 1**: Start game on Easy difficulty
```javascript
// Navigate, click START, select EASY (repeat ST-001 to ST-003)
```

**Step 2**: Get all card positions and values
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return window.gameState?.cards?.map(c => ({
      id: c.id,
      value: c.value,
      matched: c.matched
    }));
  }`
})
```

**Expected**: List of 12 cards with their values

**Step 3**: Match all 6 pairs systematically
```javascript
// For each pair (using card values from Step 2):
// 1. Take snapshot to get card uids
// 2. Click first card of pair
// 3. Click second card of pair
// 4. Wait for match animation
// 5. Verify pair matched

// Example for first pair:
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-6" }) // Matching card
mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })

// Repeat for all 6 pairs
```

**Expected**: All pairs matched successfully

**Step 4**: Wait for victory screen
```javascript
mcp__chrome-devtools__wait_for({ text: "Victory!", timeout: 5000 })
```

**Expected**: Victory screen appears within 5 seconds of last match

**Step 5**: Verify victory screen elements
```javascript
mcp__chrome-devtools__take_snapshot({
  filePath: "tests/results/ST-006-victory-screen.txt"
})
```

**Expected**: Victory screen shows:
- "Victory!" or success message
- Final score
- Time taken
- Retry button

**Step 6**: Verify game state
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      screen: window.gameState?.currentScreen,
      score: window.gameState?.score,
      allMatched: window.gameState?.cards?.every(c => c.matched)
    };
  }`
})
```

**Expected**:
- screen: "RESULT"
- score: > 0
- allMatched: true

**Step 7**: Take final screenshot
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-006-victory-complete.png"
})
```

**Step 8**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No console errors throughout entire game

#### Pass Criteria
- [ ] All 6 pairs matchable
- [ ] Victory condition triggers correctly
- [ ] Victory screen displays properly
- [ ] Game state transitions to RESULT
- [ ] Final score calculated and displayed
- [ ] No console errors
- [ ] Complete flow works end-to-end

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-007] All Difficulty Levels Launch

**Priority**: P0 (Critical)
**Estimated Time**: 4 minutes

#### Description
Verify that all 4 difficulty levels can be started successfully.

#### Preconditions
- Application loads successfully (ST-001 passed)
- Difficulty selection works (ST-002 passed)

#### Test Steps

**For Each Difficulty (Easy, Medium, Hard, Hell):**

**Step 1**: Navigate to game and reach difficulty selection
```javascript
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///Users/musinsa/study/media-tech-team-prj/index.html"
})
mcp__chrome-devtools__wait_for({ text: "START" })
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "start-button" })
mcp__chrome-devtools__wait_for({ text: "Select Difficulty" })
```

**Step 2**: Select difficulty
```javascript
mcp__chrome-devtools__take_snapshot({})
// Click respective difficulty button:
// - easy-button (12 cards, 60s)
// - medium-button (16 cards, 90s)
// - hard-button (20 cards, 120s)
// - hell-button (30 cards, 180s)
mcp__chrome-devtools__click({ uid: "[difficulty]-button" })
```

**Step 3**: Wait for game start
```javascript
mcp__chrome-devtools__wait_for({ text: "Timer:", timeout: 5000 })
```

**Step 4**: Verify card count and timer
```javascript
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      difficulty: window.CONFIG?.DIFFICULTY,
      cardCount: window.gameState?.cards?.length,
      timer: window.gameState?.timer
    };
  }`
})
```

**Expected per difficulty**:
- **Easy**: cardCount: 12, timer: 60
- **Medium**: cardCount: 16, timer: 90
- **Hard**: cardCount: 20, timer: 120
- **Hell**: cardCount: 30, timer: 180

**Step 5**: Take screenshot
```javascript
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/ST-007-[difficulty]-board.png"
})
```

**Step 6**: Check console for errors
```javascript
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Expected**: No console errors for this difficulty

#### Pass Criteria
- [ ] Easy difficulty launches (12 cards, 60s)
- [ ] Medium difficulty launches (16 cards, 90s)
- [ ] Hard difficulty launches (20 cards, 120s)
- [ ] Hell difficulty launches (30 cards, 180s)
- [ ] All card counts correct
- [ ] All timer values correct
- [ ] No console errors for any difficulty
- [ ] Grid layouts display correctly

#### Actual Results
[To be filled during test execution]

---

### Test Case: [ST-008] No Critical Console Errors During Play

**Priority**: P0 (Critical)
**Estimated Time**: 3 minutes
**Difficulty**: Easy

#### Description
Verify that no critical console errors occur during typical gameplay.

#### Preconditions
- Game can be started (ST-003 passed)
- Card interaction works (ST-004 passed)

#### Test Steps

**Step 1**: Clear browser console and start fresh
```javascript
mcp__chrome-devtools__navigate_page({
  type: "reload",
  ignoreCache: true
})
```

**Step 2**: Navigate through all screens
```javascript
// Start screen
mcp__chrome-devtools__wait_for({ text: "START" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Difficulty screen
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "start-button" })
mcp__chrome-devtools__wait_for({ text: "Select Difficulty" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Game screen
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "easy-button" })
mcp__chrome-devtools__wait_for({ text: "Timer:" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Step 3**: Perform various game actions
```javascript
// Click multiple cards
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-1" })
mcp__chrome-devtools__wait_for({ text: "", timeout: 1500 })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Try rapid clicks
mcp__chrome-devtools__click({ uid: "card-2" })
mcp__chrome-devtools__click({ uid: "card-3" })
mcp__chrome-devtools__wait_for({ text: "", timeout: 1500 })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Hover over cards
mcp__chrome-devtools__hover({ uid: "card-4" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Step 4**: Test keyboard shortcuts
```javascript
// Press G key (debug mode)
mcp__chrome-devtools__press_key({ key: "g" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Press D key (hitbox display)
mcp__chrome-devtools__press_key({ key: "d" })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })

// Press ESC key (reset)
mcp__chrome-devtools__press_key({ key: "Escape" })
mcp__chrome-devtools__wait_for({ text: "START", timeout: 3000 })
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

**Step 5**: Check for any warnings
```javascript
mcp__chrome-devtools__list_console_messages({
  types: ["error", "warn"]
})
```

**Step 6**: Verify network requests
```javascript
mcp__chrome-devtools__list_network_requests({})
```

**Expected**: All requests successful, no 404/500 errors

#### Pass Criteria
- [ ] Zero console errors on start screen
- [ ] Zero console errors on difficulty screen
- [ ] Zero console errors during gameplay
- [ ] Zero console errors on card interactions
- [ ] Zero console errors on keyboard shortcuts
- [ ] No critical warnings
- [ ] All network requests successful
- [ ] Application remains stable throughout

#### Actual Results
[To be filled during test execution]

---

## 📊 Test Summary

### Total Test Cases: 8

| Test ID | Test Name | Priority | Status |
|---------|-----------|----------|--------|
| ST-001 | Application Launch | P0 | ⏳ Pending |
| ST-002 | Start to Difficulty Selection | P0 | ⏳ Pending |
| ST-003 | Difficulty Selection to Game | P0 | ⏳ Pending |
| ST-004 | Basic Card Interaction | P0 | ⏳ Pending |
| ST-005 | Timer Countdown | P0 | ⏳ Pending |
| ST-006 | Complete Game Flow | P0 | ⏳ Pending |
| ST-007 | All Difficulty Levels | P0 | ⏳ Pending |
| ST-008 | No Critical Errors | P0 | ⏳ Pending |

### Pass Criteria
**Required**: 8/8 tests must pass (100%)
**Blocking**: Any failure stops further testing

---

## 🚨 Failure Response

### If Any Smoke Test Fails:
1. **STOP ALL TESTING** immediately
2. Document failure with screenshots and logs
3. Report as P0 (Critical) bug
4. Investigate and fix before proceeding
5. Rerun all smoke tests after fix
6. Do not proceed to other test suites until 100% pass

### Common Failure Scenarios:
- **ST-001 fails**: Check file paths, resource loading, p5.js library
- **ST-002/003 fails**: Check screen transition logic, button event handlers
- **ST-004 fails**: Check card interaction logic, state management
- **ST-005 fails**: Check timer implementation, interval management
- **ST-006 fails**: Check win condition logic, score calculation
- **ST-007 fails**: Check difficulty configuration, card generation
- **ST-008 fails**: Check all console errors, fix critical issues

---

## 📝 Execution Notes

### Before Running:
- [ ] Browser: Chrome (latest stable version)
- [ ] Clean browser state (clear cache and cookies)
- [ ] Close other tabs to avoid interference
- [ ] Disable browser extensions that might interfere
- [ ] Ensure stable environment (no CPU/network throttling)

### During Execution:
- [ ] Run tests sequentially in order (ST-001 → ST-008)
- [ ] Document any unexpected behaviors
- [ ] Save all screenshots and snapshots
- [ ] Record console messages for each test
- [ ] Note execution time for each test

### After Execution:
- [ ] Calculate pass rate (must be 100%)
- [ ] Document all failures with evidence
- [ ] Create bug reports for any failures
- [ ] Store results in `tests/results/`
- [ ] Proceed to happy path tests only if 100% pass

---

## 🔗 Related Documents

- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`
- **Next Suite**: `02-happy-path.md` (only after 100% pass)
- **Bug Reports**: `../bugs/`
- **Test Results**: `../results/`

---

**Remember**: Smoke tests are the foundation. 100% pass rate is mandatory!
