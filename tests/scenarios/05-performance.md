# Performance Tests - Benchmarks & Core Web Vitals

## 📋 Overview

**Category**: Performance Tests
**Priority**: P1 (High - Must Pass 100%)
**Purpose**: Validate performance standards and Core Web Vitals compliance
**Execution**: Every release candidate
**Total Tests**: 12 performance benchmarks

---

## 🎯 Test Strategy

Performance tests verify:
- **Core Web Vitals**: INP ≤200ms, LCP ≤2.5s, CLS ≤0.1
- **Page Load Time**: <3 seconds on 3G, <1 second on WiFi
- **Animation Performance**: 60 FPS target, minimum 30 FPS
- **Timer Accuracy**: ±100ms tolerance over 60 seconds
- **Memory Usage**: <100MB for easy game, <200MB for hell difficulty
- **Resource Loading**: All resources <5MB total

**Pass Criteria**: 100% pass rate (all metrics within acceptable ranges)

---

## 🔍 Core Web Vitals (Google Standards)

### Web Vitals Thresholds
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5-4.0s | >4.0s |
| **INP** (Interaction to Next Paint) | ≤200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

**Target**: All metrics in "Good" range

---

## ✅ Test Cases

### Category A: Page Load Performance (3 tests)

---

#### [PF-001] Initial Page Load Time (WiFi)
**Priority**: P1 | **Time**: 3min | **Network**: No throttling

**Description**: Measure page load time under optimal network conditions.

**Test Steps**:
1. Clear browser cache
2. Start performance trace with page reload
3. Measure time to interactive
4. Analyze Core Web Vitals

**MCP Commands**:
```javascript
// Clear cache and reload
mcp__chrome-devtools__navigate_page({
  type: "reload",
  ignoreCache: true
})

// Start performance trace
mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})

// Trace results include:
// - LCP (Largest Contentful Paint)
// - FCP (First Contentful Paint)
// - INP (Interaction to Next Paint)
// - CLS (Cumulative Layout Shift)
// - Total Load Time
```

**Performance Targets**:
- **LCP**: ≤1.0 second (Good: ≤2.5s)
- **FCP**: ≤0.5 seconds
- **TTI** (Time to Interactive): ≤1.5 seconds
- **Total Load**: <1 second

**Pass Criteria**:
- [ ] LCP ≤2.5s (target: ≤1.0s)
- [ ] FCP ≤1.8s (target: ≤0.5s)
- [ ] TTI ≤3.8s (target: ≤1.5s)
- [ ] CLS ≤0.1
- [ ] No layout shifts during load

---

#### [PF-002] Page Load Time on 3G Network
**Priority**: P1 | **Time**: 5min | **Network**: Fast 3G

**Description**: Measure page load performance on mobile 3G network.

**Test Steps**:
1. Enable Fast 3G throttling
2. Clear cache
3. Measure page load time
4. Verify acceptable performance

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ networkConditions: "Fast 3G" })
mcp__chrome-devtools__performance_start_trace({
  reload: true,
  autoStop: true
})
// Reset network
mcp__chrome-devtools__emulate({ networkConditions: "No emulation" })
```

**Performance Targets**:
- **LCP**: ≤2.5 seconds
- **Total Load**: <3 seconds
- **Resources Loaded**: All critical resources

**Pass Criteria**:
- [ ] LCP ≤2.5s
- [ ] Total load ≤3s
- [ ] All critical resources loaded
- [ ] Game playable after load

---

#### [PF-003] Resource Loading Optimization
**Priority**: P1 | **Time**: 3min

**Description**: Analyze resource sizes and loading order.

**Test Steps**:
1. Load page with fresh cache
2. Capture all network requests
3. Analyze resource sizes and timing
4. Verify optimization

**MCP Commands**:
```javascript
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})

mcp__chrome-devtools__wait_for({ text: "START" })

// Get all network requests
const resources = mcp__chrome-devtools__list_network_requests({})

// Analyze:
// - Total size (should be <5MB)
// - Critical resources loaded first
// - No redundant requests
```

**Performance Targets**:
- **Total Bundle Size**: <5MB
- **JavaScript**: <500KB
- **Images**: <2MB total
- **p5.js CDN**: ~1MB (external)
- **Request Count**: <20 requests

**Pass Criteria**:
- [ ] Total size ≤5MB
- [ ] JS bundles ≤500KB each
- [ ] No duplicate requests
- [ ] Critical path optimized

---

### Category B: Animation Performance (3 tests)

---

#### [PF-004] Card Flip Animation Frame Rate
**Priority**: P1 | **Time**: 3min | **Difficulty**: Easy

**Description**: Measure FPS during card flip animations.

**Test Steps**:
1. Start Easy game
2. Record FPS during multiple card flips
3. Verify smooth animation (≥30 FPS, target 60 FPS)

**MCP Commands**:
```javascript
// Start recording
mcp__chrome-devtools__performance_start_trace({
  reload: false,
  autoStop: false
})

// Perform 10 card flips
mcp__chrome-devtools__take_snapshot({})
for (let i = 0; i < 10; i++) {
  mcp__chrome-devtools__click({ uid: `card-${i}` })
  mcp__chrome-devtools__wait_for({ text: "", timeout: 500 })
}

// Stop recording
mcp__chrome-devtools__performance_stop_trace({})

// Analyze frame rate metrics
```

**Performance Targets**:
- **Target FPS**: 60 FPS
- **Minimum FPS**: 30 FPS
- **Frame Drops**: <10% of frames

**Pass Criteria**:
- [ ] Average FPS ≥30
- [ ] Target FPS: 60
- [ ] No stuttering or lag
- [ ] Smooth animation visually

---

#### [PF-005] Particle System Performance
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Measure FPS with particle effects active.

**Test Steps**:
1. Start game
2. Match multiple pairs to trigger particle effects
3. Record FPS during particle animations
4. Verify performance maintained

**Performance Targets**:
- **FPS**: ≥30 with particles active
- **No significant FPS drops** (>50% drop)

**Pass Criteria**:
- [ ] FPS ≥30 with particles
- [ ] Particles don't cause lag
- [ ] Smooth visual effects

---

#### [PF-006] Full Game Animation Performance
**Priority**: P1 | **Time**: 10min | **Difficulty**: Hell

**Description**: Test worst-case animation performance (Hell difficulty, 30 cards).

**Test Steps**:
1. Start Hell difficulty (30 cards)
2. Record entire game session
3. Measure FPS throughout gameplay
4. Analyze performance consistency

**Performance Targets**:
- **Average FPS**: ≥30
- **Minimum FPS**: ≥20 (acceptable for brief moments)
- **No freezes** (0 FPS) for >100ms

**Pass Criteria**:
- [ ] Average FPS ≥30
- [ ] Minimum FPS ≥20
- [ ] No freezes or hangs
- [ ] Playable throughout

---

### Category C: Timer Accuracy (2 tests)

---

#### [PF-007] Timer Countdown Accuracy (60 seconds)
**Priority**: P1 | **Time**: 2min | **Difficulty**: Easy

**Description**: Validate timer accuracy over full 60-second Easy game.

**Test Steps**:
1. Start Easy game (60s timer)
2. Record start time (real-world clock)
3. Wait for timer to reach 0
4. Compare elapsed real time vs. game timer

**MCP Commands**:
```javascript
// Record start
const startRealTime = Date.now()
const startGameTimer = mcp__chrome-devtools__evaluate_script({
  function: `() => window.gameState?.timer`
})

// Wait for game over
mcp__chrome-devtools__wait_for({ text: "Defeat", timeout: 65000 })

// Record end
const endRealTime = Date.now()
const elapsedReal = (endRealTime - startRealTime) / 1000 // seconds

// Expected: elapsedReal ≈ 60 seconds ± 0.1s (±100ms)
```

**Performance Targets**:
- **Accuracy**: ±100ms over 60 seconds (±0.17%)
- **Drift**: <2ms per second

**Pass Criteria**:
- [ ] Timer accuracy ±100ms
- [ ] Linear countdown (no jumps)
- [ ] Reaches exactly 0 (not negative)

---

#### [PF-008] Timer Precision Under Load
**Priority**: P1 | **Time**: 3min | **Difficulty**: Easy

**Description**: Test timer accuracy with heavy CPU load.

**Test Steps**:
1. Enable 4x CPU throttling
2. Start Easy game
3. Perform rapid card clicks (add CPU load)
4. Measure timer accuracy

**MCP Commands**:
```javascript
mcp__chrome-devtools__emulate({ cpuThrottlingRate: 4 })
// Measure timer over 10 seconds with activity
// ... (timing test)
mcp__chrome-devtools__emulate({ cpuThrottlingRate: 1 }) // Reset
```

**Performance Targets**:
- **Accuracy**: ±200ms over 10 seconds (more tolerance under throttling)

**Pass Criteria**:
- [ ] Timer accuracy ±200ms under load
- [ ] Game remains playable
- [ ] No timer freezes

---

### Category D: Memory Usage (2 tests)

---

#### [PF-009] Memory Usage - Easy Difficulty
**Priority**: P1 | **Time**: 5min | **Difficulty**: Easy

**Description**: Measure memory usage during Easy game.

**Test Steps**:
1. Take initial heap snapshot
2. Start Easy game
3. Play for 5 minutes (multiple games)
4. Take final heap snapshot
5. Analyze memory growth

**MCP Commands**:
```javascript
// Initial memory
const memInitial = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    used: performance.memory?.usedJSHeapSize,
    total: performance.memory?.totalJSHeapSize,
    limit: performance.memory?.jsHeapSizeLimit
  })`
})

// Play games
// ... (5 minutes gameplay)

// Final memory
const memFinal = mcp__chrome-devtools__evaluate_script({
  function: `() => ({
    used: performance.memory?.usedJSHeapSize,
    total: performance.memory?.totalJSHeapSize
  })`
})

// Calculate growth: (memFinal.used - memInitial.used) / 1024 / 1024 MB
```

**Performance Targets**:
- **Initial Memory**: <50MB
- **Peak Memory**: <100MB
- **Memory Growth**: <50MB over 5 minutes

**Pass Criteria**:
- [ ] Peak memory ≤100MB
- [ ] Memory growth ≤50MB
- [ ] No memory leaks detected

---

#### [PF-010] Memory Usage - Hell Difficulty
**Priority**: P2 | **Time**: 5min | **Difficulty**: Hell

**Description**: Measure memory usage for worst-case (30 cards).

**Test Steps**:
1. Measure memory before Hell game
2. Play Hell difficulty
3. Measure peak memory during gameplay
4. Verify acceptable usage

**Performance Targets**:
- **Peak Memory**: <200MB
- **Acceptable**: Game runs smoothly without browser warnings

**Pass Criteria**:
- [ ] Peak memory ≤200MB
- [ ] No "Out of Memory" warnings
- [ ] Game remains responsive

---

### Category E: Interaction Performance (2 tests)

---

#### [PF-011] Click Response Time (INP)
**Priority**: P1 | **Time**: 5min | **Difficulty**: Easy

**Description**: Measure Interaction to Next Paint for card clicks.

**Test Steps**:
1. Start game
2. Record INP for 20 card clicks
3. Calculate average and maximum INP
4. Verify within Core Web Vitals threshold

**MCP Commands**:
```javascript
// Use performance trace to capture INP
mcp__chrome-devtools__performance_start_trace({
  reload: false,
  autoStop: false
})

// Perform 20 clicks
for (let i = 0; i < 20; i++) {
  mcp__chrome-devtools__take_snapshot({})
  mcp__chrome-devtools__click({ uid: `card-${i % 12}` })
  mcp__chrome-devtools__wait_for({ text: "", timeout: 500 })
}

mcp__chrome-devtools__performance_stop_trace({})

// Analyze INP metrics from trace results
// Target: INP ≤200ms (Good), ≤500ms (Acceptable)
```

**Performance Targets**:
- **Average INP**: ≤100ms
- **Maximum INP**: ≤200ms (Core Web Vitals "Good")
- **P95 INP**: ≤200ms

**Pass Criteria**:
- [ ] Average INP ≤100ms
- [ ] Max INP ≤200ms
- [ ] P95 INP ≤200ms
- [ ] Instant visual feedback

---

#### [PF-012] Hover Response Time
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy

**Description**: Measure hover effect latency.

**Test Steps**:
1. Start game
2. Hover over 10 different cards
3. Measure time to visual feedback
4. Verify immediate response (<50ms)

**Performance Targets**:
- **Hover Latency**: <50ms
- **Visual Feedback**: Instant (1-2 frames @ 60fps)

**Pass Criteria**:
- [ ] Hover latency <50ms
- [ ] Visual feedback immediate
- [ ] Smooth hover animations

---

## 📊 Test Summary

### Total Test Cases: 12

| Category | Test Count | Metrics Tested |
|----------|------------|----------------|
| Page Load | 3 | LCP, FCP, TTI, CLS |
| Animation | 3 | FPS, Frame Drops |
| Timer | 2 | Accuracy, Precision |
| Memory | 2 | Heap Usage, Leaks |
| Interaction | 2 | INP, Response Time |

### Performance Budgets Summary

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| **LCP** | ≤1.0s | ≤2.5s | ≤4.0s |
| **INP** | ≤100ms | ≤200ms | ≤500ms |
| **CLS** | ≤0.05 | ≤0.1 | ≤0.25 |
| **FPS** | 60 | ≥30 | ≥20 |
| **Memory** | <100MB | <200MB | <500MB |
| **Timer Accuracy** | ±50ms | ±100ms | ±200ms |

---

## 📈 Performance Monitoring

### Continuous Monitoring
- **Track metrics over time** (trend analysis)
- **Compare across releases** (regression detection)
- **Monitor in production** (real user data)

### Performance Regression Alerts
- **LCP increases** by >10%
- **INP increases** by >20%
- **FPS drops** below 30 consistently
- **Memory usage** increases by >50MB
- **Timer drift** exceeds ±200ms

### Optimization Priorities
1. **Core Web Vitals** (SEO and user experience impact)
2. **Animation smoothness** (perceived performance)
3. **Timer accuracy** (game fairness)
4. **Memory efficiency** (browser stability)
5. **Resource loading** (initial load time)

---

## 🔧 Performance Optimization Tips

### LCP Optimization
- Preload critical resources (p5.js CDN)
- Optimize image loading (use WebP, lazy load)
- Minimize render-blocking resources

### INP Optimization
- Debounce click handlers
- Use requestAnimationFrame for animations
- Minimize JavaScript execution time

### CLS Prevention
- Set explicit dimensions for all elements
- Avoid dynamic content insertion above fold
- Use CSS transforms for animations

### FPS Optimization
- Limit particle count
- Use hardware-accelerated CSS properties
- Optimize draw() loop in p5.js
- Avoid synchronous operations

### Memory Optimization
- Clean up event listeners on reset
- Clear intervals and timeouts
- Avoid global variable accumulation
- Use efficient data structures

---

## 📝 Execution Notes

### Testing Environment
- **Browser**: Chrome (latest stable)
- **Hardware**: Mid-range laptop (Intel i5 or equivalent)
- **Network**: WiFi and 3G simulations
- **Viewport**: 1920x1080

### Best Practices
1. **Clear cache** before each test
2. **Close other tabs** to avoid interference
3. **Disable extensions** during testing
4. **Run multiple iterations** (3-5 times)
5. **Calculate averages** for accuracy

### Tools Used
- **Chrome DevTools Performance Panel**
- **Chrome DevTools Memory Profiler**
- **Lighthouse** (for Core Web Vitals)
- **WebPageTest** (optional external validation)

---

## 🚨 Performance Failure Response

### If Any Metric Fails:
1. **Identify bottleneck** (CPU, network, memory, rendering)
2. **Profile specific area** (DevTools Profiler)
3. **Optimize critical path**
4. **Re-test after optimization**
5. **Document improvements**

### Common Performance Issues:
- **High LCP**: Large images, slow CDN, render blocking
- **High INP**: Heavy click handlers, long JavaScript tasks
- **High CLS**: Dynamic content, missing dimensions
- **Low FPS**: Expensive draw operations, too many particles
- **Memory leaks**: Event listeners not removed, global variables
- **Timer drift**: Blocking operations, slow event loop

---

## 🔗 Related Documents

- **Previous**: `04-error-scenarios.md`
- **Next**: `06-accessibility.md`
- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`

---

**Remember**: Performance is a feature! Users notice lag and slow loads.
