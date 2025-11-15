# Chrome DevTools MCP Testing Guide

## 📋 Overview

**Chrome DevTools MCP** (Model Context Protocol) provides 27 professional testing tools for automated E2E testing through Claude Code. This guide explains how to use these tools effectively for testing the Memory Card Game.

---

## 🛠️ Available Tools (27 Total)

### Category 1: Input Tools (8 tools)
Simulate user interactions with the application.

### Category 2: Navigation (5 tools)
Control browser pages and navigation.

### Category 3: Performance (3 tools)
Measure and analyze performance metrics.

### Category 4: Network (2 tools)
Monitor and analyze network requests.

### Category 5: Console (2 tools)
Capture and analyze console messages.

### Category 6: Debugging (7 tools)
Debug, inspect, and validate application state.

---

## 📖 Tool Reference Guide

### 🖱️ Input Tools (User Interactions)

#### 1. `mcp__chrome-devtools__click`
**Purpose**: Click on an element
**Use Case**: Click buttons, cards, clickable areas

**Parameters**:
- `uid` (required): Element identifier from snapshot
- `dblClick` (optional): Set to `true` for double-click

**Example**:
```javascript
// Click the Start button
mcp__chrome-devtools__click({ uid: "start-button" })

// Double-click a card (if needed)
mcp__chrome-devtools__click({ uid: "card-5", dblClick: true })
```

**Best Practices**:
- Always take a snapshot first to get element UIDs
- Wait for elements to be visible before clicking
- Verify click was successful (check state change)

---

#### 2. `mcp__chrome-devtools__hover`
**Purpose**: Hover over an element to trigger hover effects
**Use Case**: Test hover animations, tooltips, visual feedback

**Parameters**:
- `uid` (required): Element identifier from snapshot

**Example**:
```javascript
// Hover over a card to see hover effect
mcp__chrome-devtools__hover({ uid: "card-3" })
```

**Best Practices**:
- Use before click to test hover states
- Verify visual changes with screenshots
- Test hover timeout effects

---

#### 3. `mcp__chrome-devtools__fill`
**Purpose**: Type text into input fields or select options
**Use Case**: Form inputs (not heavily used in card game)

**Parameters**:
- `uid` (required): Element identifier
- `value` (required): Text to fill or option to select

**Example**:
```javascript
// If there was a name input
mcp__chrome-devtools__fill({ uid: "player-name", value: "TestPlayer" })
```

---

#### 4. `mcp__chrome-devtools__fill_form`
**Purpose**: Fill multiple form elements at once
**Use Case**: Batch form filling (not applicable to card game)

**Parameters**:
- `elements`: Array of `{ uid, value }` objects

**Example**:
```javascript
mcp__chrome-devtools__fill_form({
  elements: [
    { uid: "input-1", value: "value1" },
    { uid: "input-2", value: "value2" }
  ]
})
```

---

#### 5. `mcp__chrome-devtools__press_key`
**Purpose**: Press keyboard keys
**Use Case**: Keyboard shortcuts (G, D, ESC in game)

**Parameters**:
- `key` (required): Key name or combination (e.g., "Escape", "Control+A")

**Example**:
```javascript
// Press ESC to reset game
mcp__chrome-devtools__press_key({ key: "Escape" })

// Press G for debug mode
mcp__chrome-devtools__press_key({ key: "g" })

// Press D for hitbox display
mcp__chrome-devtools__press_key({ key: "d" })
```

**Common Keys**:
- `"Enter"`, `"Escape"`, `"Tab"`, `"Space"`
- `"ArrowUp"`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"`
- `"Control+Key"`, `"Shift+Key"`, `"Alt+Key"`

---

#### 6. `mcp__chrome-devtools__drag`
**Purpose**: Drag and drop elements
**Use Case**: Not applicable to card game

---

#### 7. `mcp__chrome-devtools__handle_dialog`
**Purpose**: Handle browser alerts, confirms, prompts
**Use Case**: If game shows browser dialogs

**Parameters**:
- `action` (required): `"accept"` or `"dismiss"`
- `promptText` (optional): Text for prompt dialog

**Example**:
```javascript
// Accept a confirm dialog
mcp__chrome-devtools__handle_dialog({ action: "accept" })

// Dismiss an alert
mcp__chrome-devtools__handle_dialog({ action: "dismiss" })
```

---

#### 8. `mcp__chrome-devtools__upload_file`
**Purpose**: Upload files through file input
**Use Case**: Not applicable to card game

---

### 🧭 Navigation Tools

#### 1. `mcp__chrome-devtools__navigate_page`
**Purpose**: Navigate to URL or control browser history
**Use Case**: Load game, navigate back/forward, reload

**Parameters**:
- `type`: `"url"`, `"back"`, `"forward"`, `"reload"`
- `url` (if type=url): Target URL
- `ignoreCache` (optional): Clear cache on reload
- `timeout` (optional): Max wait time in ms

**Examples**:
```javascript
// Load the game
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

// Reload page (test initialization)
mcp__chrome-devtools__navigate_page({ type: "reload" })

// Reload ignoring cache
mcp__chrome-devtools__navigate_page({
  type: "reload",
  ignoreCache: true
})

// Go back in history
mcp__chrome-devtools__navigate_page({ type: "back" })
```

---

#### 2. `mcp__chrome-devtools__new_page`
**Purpose**: Open a new browser tab
**Use Case**: Multi-tab testing, parallel games

**Parameters**:
- `url` (required): URL to load
- `timeout` (optional): Max wait time

**Example**:
```javascript
mcp__chrome-devtools__new_page({
  url: "file:///path/to/index.html"
})
```

---

#### 3. `mcp__chrome-devtools__list_pages`
**Purpose**: Get list of open tabs
**Use Case**: Verify tab count, find page indexes

**Example**:
```javascript
mcp__chrome-devtools__list_pages({})
```

---

#### 4. `mcp__chrome-devtools__select_page`
**Purpose**: Switch to a specific tab
**Use Case**: Multi-tab testing

**Parameters**:
- `pageIdx` (required): Page index from list_pages

**Example**:
```javascript
mcp__chrome-devtools__select_page({ pageIdx: 0 })
```

---

#### 5. `mcp__chrome-devtools__close_page`
**Purpose**: Close a browser tab
**Use Case**: Cleanup after multi-tab tests

**Parameters**:
- `pageIdx` (required): Page index to close

**Example**:
```javascript
mcp__chrome-devtools__close_page({ pageIdx: 1 })
```

---

### ⚡ Performance Tools

#### 1. `mcp__chrome-devtools__performance_start_trace`
**Purpose**: Start recording performance trace
**Use Case**: Measure Core Web Vitals, animation performance

**Parameters**:
- `reload` (required): Auto-reload page after starting trace
- `autoStop` (required): Auto-stop trace after page load

**Example**:
```javascript
// Start trace with reload
mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})
```

**Best Practices**:
- Use for page load performance
- Measure specific user interactions
- Combine with timer accuracy tests

---

#### 2. `mcp__chrome-devtools__performance_stop_trace`
**Purpose**: Stop performance recording
**Use Case**: End manual trace recording

**Example**:
```javascript
mcp__chrome-devtools__performance_stop_trace({})
```

**Returns**: Performance insights including:
- Core Web Vitals (LCP, FID, CLS)
- Load times
- Rendering metrics
- Available insight sets for detailed analysis

---

#### 3. `mcp__chrome-devtools__performance_analyze_insight`
**Purpose**: Get detailed analysis of specific performance insight
**Use Case**: Deep dive into performance issues

**Parameters**:
- `insightSetId` (required): ID from trace results
- `insightName` (required): Insight name (e.g., "LCPBreakdown")

**Example**:
```javascript
mcp__chrome-devtools__performance_analyze_insight({
  insightSetId: "insight-123",
  insightName: "LCPBreakdown"
})
```

---

### 🌐 Network Tools

#### 1. `mcp__chrome-devtools__list_network_requests`
**Purpose**: Get all network requests
**Use Case**: Verify resource loading, check for errors

**Parameters**:
- `resourceTypes` (optional): Filter by type (e.g., `["script", "image"]`)
- `pageIdx` (optional): Pagination (0-based)
- `pageSize` (optional): Requests per page
- `includePreservedRequests` (optional): Include previous navigations

**Example**:
```javascript
// Get all requests
mcp__chrome-devtools__list_network_requests({})

// Get only script and image requests
mcp__chrome-devtools__list_network_requests({
  resourceTypes: ["script", "image"]
})
```

**Resource Types**:
- `document`, `stylesheet`, `image`, `media`, `font`, `script`
- `xhr`, `fetch`, `websocket`, `manifest`, `other`

---

#### 2. `mcp__chrome-devtools__get_network_request`
**Purpose**: Get detailed info about a specific request
**Use Case**: Investigate failed requests

**Parameters**:
- `reqid` (optional): Request ID from list, or currently selected in DevTools

**Example**:
```javascript
// Get specific request
mcp__chrome-devtools__get_network_request({ reqid: 123 })

// Get currently selected request
mcp__chrome-devtools__get_network_request({})
```

---

### 📝 Console Tools

#### 1. `mcp__chrome-devtools__list_console_messages`
**Purpose**: Get all console messages
**Use Case**: Check for errors, warnings, logs

**Parameters**:
- `types` (optional): Filter by type (e.g., `["error", "warn"]`)
- `pageIdx` (optional): Pagination
- `pageSize` (optional): Messages per page
- `includePreservedMessages` (optional): Include previous navigations

**Example**:
```javascript
// Get all console messages
mcp__chrome-devtools__list_console_messages({})

// Get only errors
mcp__chrome-devtools__list_console_messages({
  types: ["error"]
})

// Get errors and warnings
mcp__chrome-devtools__list_console_messages({
  types: ["error", "warn"]
})
```

**Message Types**:
- `log`, `debug`, `info`, `error`, `warn`
- `dir`, `dirxml`, `table`, `trace`, `clear`
- `startGroup`, `startGroupCollapsed`, `endGroup`
- `assert`, `profile`, `profileEnd`, `count`, `timeEnd`, `verbose`

---

#### 2. `mcp__chrome-devtools__get_console_message`
**Purpose**: Get detailed info about a specific console message
**Use Case**: Investigate specific errors

**Parameters**:
- `msgid` (required): Message ID from list_console_messages

**Example**:
```javascript
mcp__chrome-devtools__get_console_message({ msgid: 5 })
```

---

### 🔍 Debugging Tools

#### 1. `mcp__chrome-devtools__take_snapshot`
**Purpose**: Capture accessibility tree text snapshot
**Use Case**: Get element UIDs for interaction, verify page structure

**Parameters**:
- `filePath` (optional): Save to file instead of returning
- `verbose` (optional): Include full a11y tree details

**Example**:
```javascript
// Get page snapshot
mcp__chrome-devtools__take_snapshot({})

// Verbose snapshot with full details
mcp__chrome-devtools__take_snapshot({ verbose: true })

// Save to file
mcp__chrome-devtools__take_snapshot({
  filePath: "tests/results/snapshot.txt"
})
```

**Best Practices**:
- **Always take snapshot before interactions** to get element UIDs
- Use verbose mode for debugging complex UI issues
- Save snapshots for test documentation

---

#### 2. `mcp__chrome-devtools__take_screenshot`
**Purpose**: Capture visual screenshot
**Use Case**: Visual validation, bug documentation

**Parameters**:
- `filePath` (optional): Save path
- `format` (optional): `"png"`, `"jpeg"`, `"webp"` (default: png)
- `quality` (optional): 0-100 for JPEG/WebP compression
- `fullPage` (optional): Capture entire scrollable page
- `uid` (optional): Capture specific element only

**Examples**:
```javascript
// Screenshot entire viewport
mcp__chrome-devtools__take_screenshot({})

// Full page screenshot
mcp__chrome-devtools__take_screenshot({ fullPage: true })

// Screenshot specific element
mcp__chrome-devtools__take_screenshot({
  uid: "game-container",
  filePath: "tests/results/game-screen.png"
})

// High quality JPEG
mcp__chrome-devtools__take_screenshot({
  format: "jpeg",
  quality: 95
})
```

---

#### 3. `mcp__chrome-devtools__evaluate_script`
**Purpose**: Execute JavaScript in page context
**Use Case**: Get game state, validate internal variables

**Parameters**:
- `function` (required): JavaScript function as string
- `args` (optional): Array of element UIDs to pass as arguments

**Examples**:
```javascript
// Get game state
mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState; }"
})

// Get timer value
mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.timer; }"
})

// Get current score
mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.score; }"
})

// Check if game is playing
mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.currentScreen === 'PLAYING'; }"
})

// Get element text content
mcp__chrome-devtools__evaluate_script({
  function: "(el) => { return el.innerText; }",
  args: [{ uid: "score-display" }]
})
```

**Best Practices**:
- Always return JSON-serializable values
- Use for internal state validation
- Combine with snapshots for comprehensive validation

---

#### 4. `mcp__chrome-devtools__wait_for`
**Purpose**: Wait for text to appear on page
**Use Case**: Wait for screen transitions, messages, dynamic content

**Parameters**:
- `text` (required): Text to wait for
- `timeout` (optional): Max wait time in ms (default: varies)

**Examples**:
```javascript
// Wait for "START" button
mcp__chrome-devtools__wait_for({ text: "START" })

// Wait for victory message with timeout
mcp__chrome-devtools__wait_for({
  text: "Victory!",
  timeout: 5000
})

// Wait for difficulty selection screen
mcp__chrome-devtools__wait_for({ text: "Select Difficulty" })
```

**Best Practices**:
- Use after navigation or screen transitions
- Set appropriate timeouts for slow operations
- Combine with snapshots to verify complete state

---

#### 5. `mcp__chrome-devtools__emulate`
**Purpose**: Emulate network/CPU conditions
**Use Case**: Test performance under constraints

**Parameters**:
- `networkConditions` (optional): Network throttling preset
- `cpuThrottlingRate` (optional): CPU slowdown factor (1-20)

**Network Presets**:
- `"No emulation"`: Default, no throttling
- `"Offline"`: Simulate offline
- `"Slow 3G"`: 400 Kbps, 400ms RTT
- `"Fast 3G"`: 1.6 Mbps, 150ms RTT
- `"Slow 4G"`: 4 Mbps, 20ms RTT
- `"Fast 4G"`: 10 Mbps, 5ms RTT

**Examples**:
```javascript
// Simulate slow 3G network
mcp__chrome-devtools__emulate({
  networkConditions: "Slow 3G"
})

// Simulate 4x CPU slowdown
mcp__chrome-devtools__emulate({
  cpuThrottlingRate: 4
})

// Combine network and CPU throttling
mcp__chrome-devtools__emulate({
  networkConditions: "Fast 3G",
  cpuThrottlingRate: 4
})

// Reset to normal
mcp__chrome-devtools__emulate({
  networkConditions: "No emulation",
  cpuThrottlingRate: 1
})
```

---

#### 6. `mcp__chrome-devtools__resize_page`
**Purpose**: Resize browser viewport
**Use Case**: Test responsive design, different screen sizes

**Parameters**:
- `width` (required): Width in pixels
- `height` (required): Height in pixels

**Examples**:
```javascript
// Desktop (1920x1080)
mcp__chrome-devtools__resize_page({ width: 1920, height: 1080 })

// Laptop (1366x768)
mcp__chrome-devtools__resize_page({ width: 1366, height: 768 })

// Tablet (768x1024)
mcp__chrome-devtools__resize_page({ width: 768, height: 1024 })

// Mobile (375x667)
mcp__chrome-devtools__resize_page({ width: 375, height: 667 })
```

---

#### 7. `mcp__chrome-devtools__upload_file`
**Purpose**: Upload files via file input
**Use Case**: Not applicable to card game

---

## 🎯 Common Testing Workflows

### Workflow 1: Basic Page Navigation Test
```javascript
// 1. Navigate to game
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

// 2. Wait for page load
mcp__chrome-devtools__wait_for({ text: "START" })

// 3. Take snapshot to verify structure
mcp__chrome-devtools__take_snapshot({})

// 4. Check for console errors
mcp__chrome-devtools__list_console_messages({ types: ["error"] })
```

---

### Workflow 2: Complete Game Flow Test
```javascript
// 1. Load game
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

// 2. Click START button
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "start-button" })

// 3. Wait for difficulty screen
mcp__chrome-devtools__wait_for({ text: "Select Difficulty" })

// 4. Select Easy difficulty
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "easy-button" })

// 5. Wait for game to start
mcp__chrome-devtools__wait_for({ text: "Timer:" })

// 6. Take screenshot of game board
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/game-board.png"
})

// 7. Click cards to match pairs
mcp__chrome-devtools__take_snapshot({})
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-6" }) // Matching card

// 8. Verify score updated
mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.score; }"
})

// 9. Continue until game ends
// ... (repeat card matching)

// 10. Wait for result screen
mcp__chrome-devtools__wait_for({ text: "Victory!" })

// 11. Take final screenshot
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/victory-screen.png"
})
```

---

### Workflow 3: Performance Testing
```javascript
// 1. Start performance trace
mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})

// 2. Analyze results
// (Results automatically returned when autoStop completes)

// 3. Get detailed insight
mcp__chrome-devtools__performance_analyze_insight({
  insightSetId: "returned-id",
  insightName: "LCPBreakdown"
})
```

---

### Workflow 4: Error Detection Test
```javascript
// 1. Navigate to game
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

// 2. Perform actions
// ... (game interactions)

// 3. Check for any console errors
mcp__chrome-devtools__list_console_messages({
  types: ["error", "warn"]
})

// 4. Check network failures
mcp__chrome-devtools__list_network_requests({})

// 5. Verify no failed requests
// (Check status codes in results)
```

---

### Workflow 5: Timer Accuracy Test
```javascript
// 1. Start game at Easy difficulty
// ... (navigation steps)

// 2. Get initial timer value
const startTime = mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.timer; }"
})

// 3. Wait 5 seconds
// (Use external timer or wait_for mechanism)

// 4. Get timer after 5 seconds
const afterTime = mcp__chrome-devtools__evaluate_script({
  function: "() => { return window.gameState?.timer; }"
})

// 5. Validate: startTime - afterTime ≈ 5 seconds (±100ms tolerance)
```

---

## 📋 Best Practices

### General Guidelines
1. **Always take snapshot before interactions** to get element UIDs
2. **Use wait_for after navigation** to ensure page is ready
3. **Check console errors** after each test
4. **Take screenshots** for visual validation and bug reporting
5. **Use evaluate_script** for internal state validation
6. **Set appropriate timeouts** for slow operations
7. **Reset state between tests** (reload page)

### Performance Testing
1. **Measure page load performance** with performance_start_trace
2. **Test under various network conditions** using emulate
3. **Validate Core Web Vitals** meet thresholds (LCP ≤2.5s, FID ≤100ms, CLS ≤0.1)
4. **Test timer accuracy** with ±100ms tolerance
5. **Monitor animation frame rates** (target 60fps)

### Error Handling
1. **Always check console messages** for errors
2. **Verify network requests** completed successfully
3. **Validate expected elements exist** in snapshots
4. **Use try-catch** in evaluate_script for safety
5. **Document unexpected behaviors** with screenshots

### Test Organization
1. **One test case per test function**
2. **Clear test names** describing what's being tested
3. **Document expected outcomes** before running tests
4. **Save artifacts** (screenshots, snapshots) for evidence
5. **Clean up after tests** (close pages, reset state)

---

## 🚨 Common Pitfalls

### ❌ Don't Do This
- Click without taking snapshot first (no UID)
- Forget to wait for page load
- Test without checking console errors
- Skip screenshots for visual tests
- Use hardcoded timeouts without validation
- Test flaky behaviors without stabilization
- Ignore network request failures

### ✅ Do This Instead
- Take snapshot → get UID → click
- Use wait_for after navigation
- Always check console messages
- Take screenshots before/after actions
- Use evaluate_script for state validation
- Add wait conditions for stability
- Verify all requests succeeded

---

## 📚 Quick Reference

### Must-Use Tools for Card Game Testing
1. **navigate_page**: Load game
2. **take_snapshot**: Get element UIDs
3. **click**: Interact with buttons and cards
4. **wait_for**: Wait for screen transitions
5. **take_screenshot**: Visual validation
6. **evaluate_script**: Check game state
7. **list_console_messages**: Error detection
8. **performance_start_trace**: Performance measurement

### Tool Categories by Use Case

**Navigation & Setup**:
- navigate_page, wait_for, resize_page

**User Interaction**:
- click, hover, press_key

**Validation & Verification**:
- take_snapshot, take_screenshot, evaluate_script

**Performance**:
- performance_start_trace, performance_stop_trace, emulate

**Error Detection**:
- list_console_messages, get_console_message, list_network_requests

---

## 🎓 Learning Path

### Beginner Level
1. Start with navigate_page and wait_for
2. Learn take_snapshot to understand page structure
3. Practice click and basic interactions
4. Use list_console_messages for error checking

### Intermediate Level
1. Master evaluate_script for state validation
2. Use take_screenshot for visual testing
3. Implement complete game flow tests
4. Add performance measurements

### Advanced Level
1. Test edge cases with rapid interactions
2. Simulate various network conditions
3. Measure and optimize performance
4. Create comprehensive test suites

---

## 📞 Support

**Questions about MCP tools**: Refer to Claude Code MCP documentation
**Test scenario examples**: See `tests/scenarios/` directory
**Test results**: Store in `tests/results/` directory
**Bug reports**: Use templates in `tests/bugs/` directory

---

**Ready to start testing? Begin with smoke tests in `01-smoke-tests.md`!**
