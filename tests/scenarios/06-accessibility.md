# Accessibility Tests - A11y Compliance & Usability

## 📋 Overview

**Category**: Accessibility Tests
**Priority**: P2 (Medium - Should Pass ≥80%)
**Purpose**: Verify basic accessibility compliance and inclusive design
**Execution**: Major releases
**Total Tests**: 8 accessibility scenarios

---

## 🎯 Test Strategy

Accessibility tests verify:
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Management**: Clear visual focus indicators
- **Screen Reader Compatibility**: Basic semantic HTML and ARIA labels
- **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- **Visual Accessibility**: No reliance on color alone
- **Usability**: Clear UI, readable text, accessible controls

**Pass Criteria**: ≥80% pass rate (≤1 failure acceptable)

**Scope**: Basic accessibility (WCAG 2.1 Level A/AA fundamentals)

---

## 🔍 WCAG 2.1 Guidelines Reference

### WCAG Levels
- **Level A**: Minimum accessibility (legal requirement in many regions)
- **Level AA**: Standard for most websites (target for this project)
- **Level AAA**: Enhanced accessibility (aspirational)

### Key Principles (POUR)
1. **Perceivable**: Information presented in ways all users can perceive
2. **Operable**: UI components and navigation operable by all users
3. **Understandable**: Information and UI operation understandable
4. **Robust**: Content interpretable by assistive technologies

---

## ✅ Test Cases

### Category A: Keyboard Navigation (3 tests)

---

#### [A11Y-001] Keyboard-Only Navigation (Full Game)
**Priority**: P1 | **Time**: 5min | **Difficulty**: Easy
**WCAG**: 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap)

**Description**: Complete full game using only keyboard (no mouse).

**Test Steps**:
1. Load game
2. Navigate using Tab, Shift+Tab, Enter, Space, Arrow keys
3. Complete game without mouse
4. Verify all interactive elements accessible

**Keyboard Commands**:
- **Tab**: Move focus forward
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate buttons/cards
- **ESC**: Reset game (existing shortcut)
- **G**: Debug mode (existing)
- **D**: Hitbox display (existing)

**Test Flow**:
```
1. Tab to START button → Press Enter
2. Tab through difficulty buttons → Select with Enter
3. Tab through cards → Flip cards with Enter/Space
4. Complete game via keyboard
5. Tab to Retry button → Press Enter
```

**MCP Commands**:
```javascript
// Navigate to START button (Tab key press)
mcp__chrome-devtools__press_key({ key: "Tab" })
mcp__chrome-devtools__take_snapshot({}) // Verify focus on START

// Activate START button
mcp__chrome-devtools__press_key({ key: "Enter" })

// Navigate to difficulty button
mcp__chrome-devtools__press_key({ key: "Tab" })
mcp__chrome-devtools__press_key({ key: "Enter" }) // Select EASY

// Navigate through cards
for (let i = 0; i < 12; i++) {
  mcp__chrome-devtools__press_key({ key: "Tab" })
  if (i === 0 || i === 6) {
    mcp__chrome-devtools__press_key({ key: "Enter" }) // Flip matching cards
  }
}
// ... (continue gameplay)
```

**Pass Criteria**:
- [ ] All buttons accessible via keyboard
- [ ] Tab order logical (left-to-right, top-to-bottom)
- [ ] No keyboard traps (can exit all areas)
- [ ] Enter/Space activate focused elements
- [ ] Focus visible at all times
- [ ] Game completable without mouse

---

#### [A11Y-002] Focus Indicators Visibility
**Priority**: P1 | **Time**: 3min | **Difficulty**: Easy
**WCAG**: 2.4.7 (Focus Visible)

**Description**: Verify all interactive elements have visible focus indicators.

**Test Steps**:
1. Tab through all interactive elements
2. Take screenshots of focus states
3. Verify clear visual indicators (outline, border, glow, etc.)

**Elements to Test**:
- START button
- Difficulty buttons (Easy, Medium, Hard, Hell)
- Card elements (all 12/16/20/30)
- Retry button
- Any other interactive elements

**MCP Commands**:
```javascript
// Tab through elements and capture focus states
const elements = ["start-button", "easy-button", "medium-button", "hard-button", "hell-button"]
for (const elem of elements) {
  mcp__chrome-devtools__press_key({ key: "Tab" })
  mcp__chrome-devtools__take_screenshot({
    filePath: `tests/results/A11Y-002-focus-${elem}.png`
  })
}
```

**Pass Criteria**:
- [ ] All interactive elements have focus indicator
- [ ] Focus indicator clearly visible (high contrast)
- [ ] Focus indicator not obscured by other elements
- [ ] Consistent focus style across application
- [ ] WCAG 2.4.11 (Focus Appearance) - minimum 3:1 contrast

---

#### [A11Y-003] No Keyboard Trap
**Priority**: P1 | **Time**: 2min | **Difficulty**: Easy
**WCAG**: 2.1.2 (No Keyboard Trap)

**Description**: Verify users can navigate away from all areas via keyboard.

**Test Steps**:
1. Tab into each section of the app
2. Verify Tab/Shift+Tab can exit
3. Verify ESC key works from all screens
4. Ensure no focus traps

**Areas to Test**:
- Start screen
- Difficulty selection screen
- Game board (cards area)
- Result screen
- During animations

**Pass Criteria**:
- [ ] Can tab out of all areas
- [ ] ESC key works universally
- [ ] No infinite focus loops
- [ ] Modal dialogs (if any) escapable

---

### Category B: Visual Accessibility (2 tests)

---

#### [A11Y-004] Color Contrast Compliance
**Priority**: P2 | **Time**: 5min | **All Screens**
**WCAG**: 1.4.3 (Contrast Minimum)

**Description**: Verify text and UI elements meet WCAG AA contrast ratios.

**Test Steps**:
1. Take screenshots of all screens
2. Use color contrast checker tool
3. Verify minimum ratios met

**Contrast Requirements (WCAG AA)**:
- **Normal text** (≥18pt or bold ≥14pt): **4.5:1**
- **Large text** (<18pt regular or <14pt bold): **3:1**
- **UI components** (buttons, borders): **3:1**

**Elements to Check**:
- Game title text
- Button labels
- Timer display
- Score display
- Pairs remaining text
- Victory/Defeat messages
- Card borders/outlines

**MCP Commands**:
```javascript
// Capture all screens for contrast analysis
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/A11Y-004-start-screen.png"
})
// ... (repeat for each screen)

// Use external tool or manual check:
// - Chrome DevTools: Inspect → Accessibility → Contrast ratio
// - Online tool: WebAIM Contrast Checker
```

**Pass Criteria**:
- [ ] All text meets 4.5:1 ratio (normal) or 3:1 (large)
- [ ] UI components meet 3:1 ratio
- [ ] Focus indicators meet 3:1 ratio
- [ ] No contrast issues flagged by DevTools

---

#### [A11Y-005] Visual Information Not Color-Only
**Priority**: P2 | **Time**: 3min | **Difficulty**: Easy
**WCAG**: 1.4.1 (Use of Color)

**Description**: Verify information not conveyed by color alone.

**Test Steps**:
1. Review all game states
2. Identify visual cues (matched cards, hover, focus, etc.)
3. Verify cues have non-color indicators (text, icons, borders, patterns)

**Visual Cues to Test**:
- **Matched cards**: Not just color change
  - Should have: border, icon, position change, or text label
- **Hover state**: Not just color change
  - Should have: scale, shadow, border, or cursor change
- **Timer urgency**: Not just red color at low time
  - Should have: number changes, animation, or warning text

**MCP Commands**:
```javascript
// Test matched card visual distinction
mcp__chrome-devtools__click({ uid: "card-0" })
mcp__chrome-devtools__click({ uid: "card-6" }) // Match
mcp__chrome-devtools__wait_for({ text: "", timeout: 1000 })
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/A11Y-005-matched-cards.png"
})
// Verify matched cards have non-color distinctions
```

**Pass Criteria**:
- [ ] Matched cards visually distinct without color
- [ ] Interactive states have multiple cues
- [ ] Timer urgency indicated by more than color
- [ ] All critical info accessible to color-blind users

---

### Category C: Semantic HTML & Screen Readers (2 tests)

---

#### [A11Y-006] Semantic HTML Structure
**Priority**: P2 | **Time**: 3min | **All Screens**
**WCAG**: 1.3.1 (Info and Relationships), 4.1.2 (Name, Role, Value)

**Description**: Verify proper semantic HTML and ARIA attributes.

**Test Steps**:
1. Inspect HTML structure via snapshot
2. Verify semantic elements used (button, main, section, etc.)
3. Check ARIA attributes where needed

**Semantic Elements Expected**:
- `<button>` for clickable buttons (not `<div>`)
- `<main>` for main content area
- Heading hierarchy (`<h1>`, `<h2>`, etc.)
- `<section>` or `<article>` for logical sections
- ARIA labels for interactive elements without visible text

**MCP Commands**:
```javascript
mcp__chrome-devtools__take_snapshot({ verbose: true })
// Review snapshot for:
// - Proper button elements
// - Semantic structure
// - ARIA attributes (aria-label, role, etc.)

// Evaluate structure
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      buttons: document.querySelectorAll('button').length,
      divButtons: document.querySelectorAll('div[onclick], div[role="button"]').length,
      headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
      ariaLabels: document.querySelectorAll('[aria-label]').length
    };
  }`
})
```

**Pass Criteria**:
- [ ] Buttons use `<button>` element
- [ ] Proper heading hierarchy exists
- [ ] Interactive elements have accessible names
- [ ] ARIA attributes used appropriately (not overused)
- [ ] No empty buttons or links

---

#### [A11Y-007] Screen Reader Compatibility (Basic)
**Priority**: P2 | **Time**: 5min | **Difficulty**: Easy
**WCAG**: 4.1.2 (Name, Role, Value), 4.1.3 (Status Messages)

**Description**: Test basic screen reader navigation (manual test).

**Test Steps** (Manual with Screen Reader):
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through game using screen reader
3. Verify all elements announced correctly

**Screen Reader Test Flow**:
- START button announced as "START button"
- Difficulty buttons announced with labels
- Cards announced (e.g., "Card 1 button, face down")
- Timer and score announced
- Victory/Defeat message announced

**Automated Checks (via MCP)**:
```javascript
// Check for ARIA live regions (for dynamic updates)
mcp__chrome-devtools__evaluate_script({
  function: `() => {
    return {
      liveRegions: document.querySelectorAll('[aria-live]').length,
      statusMessages: document.querySelectorAll('[role="status"], [role="alert"]').length
    };
  }`
})
```

**Pass Criteria**:
- [ ] All buttons have accessible names
- [ ] Dynamic content changes announced (via aria-live)
- [ ] Focus order matches visual order
- [ ] Screen reader can complete full game flow
- [ ] No confusing or redundant announcements

---

### Category D: Usability & Clarity (1 test)

---

#### [A11Y-008] Text Readability & UI Clarity
**Priority**: P2 | **Time**: 3min | **All Screens**
**WCAG**: 1.4.4 (Resize Text), 1.4.10 (Reflow)

**Description**: Verify text is readable and UI remains usable when zoomed.

**Test Steps**:
1. Test browser zoom at 200%
2. Verify text remains readable
3. Verify UI doesn't break or overlap
4. Test on different font sizes

**Zoom Levels to Test**:
- 100% (baseline)
- 150% (common user zoom)
- 200% (WCAG requirement)

**MCP Commands**:
```javascript
// Simulate zoom via viewport resize (approximation)
mcp__chrome-devtools__resize_page({ width: 960, height: 540 }) // 50% viewport
mcp__chrome-devtools__take_screenshot({
  filePath: "tests/results/A11Y-008-zoom-200.png"
})

// Check for text overflow or layout breaks
mcp__chrome-devtools__take_snapshot({})
```

**Pass Criteria**:
- [ ] Text readable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom (or minimal)
- [ ] UI elements not overlapping
- [ ] All interactive elements remain clickable
- [ ] Content reflows appropriately

---

## 📊 Test Summary

### Total Test Cases: 8

| Category | Test Count | WCAG Level | Priority |
|----------|------------|------------|----------|
| Keyboard Navigation | 3 | A, AA | P1 |
| Visual Accessibility | 2 | AA | P2 |
| Semantic HTML | 2 | A, AA | P2 |
| Usability | 1 | AA | P2 |

### WCAG Guidelines Covered
- **2.1.1** Keyboard
- **2.1.2** No Keyboard Trap
- **2.4.7** Focus Visible
- **1.4.3** Contrast Minimum (AA)
- **1.4.1** Use of Color
- **1.3.1** Info and Relationships
- **4.1.2** Name, Role, Value
- **1.4.4** Resize Text
- **1.4.10** Reflow

---

## 🔧 Accessibility Testing Tools

### Browser Tools
- **Chrome DevTools Accessibility Panel**
  - Inspect element accessibility properties
  - Check contrast ratios
  - View accessibility tree

### Automated Testing Tools
- **axe DevTools** (Chrome extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools, includes A11y audit)

### Manual Testing Tools
- **Keyboard only** (most important manual test)
- **Screen readers**:
  - **NVDA** (Windows, free)
  - **JAWS** (Windows, paid)
  - **VoiceOver** (macOS, built-in)
  - **TalkBack** (Android)
- **Color contrast checkers**:
  - WebAIM Contrast Checker
  - Chrome DevTools contrast ratio

---

## 🚨 Common Accessibility Issues

### Critical Issues (Must Fix)
1. **No keyboard access** to core functionality
2. **Keyboard traps** preventing navigation
3. **No focus indicators** on interactive elements
4. **Insufficient color contrast** for text
5. **Non-semantic buttons** (divs with onclick)

### Important Issues (Should Fix)
1. **Poor focus order** (illogical tab sequence)
2. **No ARIA labels** for icon-only buttons
3. **Color-only information** without alternatives
4. **No screen reader announcements** for dynamic content
5. **Layout breaks** at high zoom levels

### Nice-to-Have Improvements
1. **Skip navigation** links
2. **Keyboard shortcuts** documentation
3. **High contrast mode** support
4. **Reduced motion** option (prefers-reduced-motion)
5. **ARIA landmarks** for page structure

---

## 📝 Execution Notes

### Testing Environment
- **Browser**: Chrome with accessibility features
- **Screen Reader**: NVDA or VoiceOver (for A11Y-007)
- **Tools**: Chrome DevTools Accessibility Panel
- **Extensions**: axe DevTools, WAVE (optional)

### Manual Testing Required
- **A11Y-001**: Full keyboard navigation (manual)
- **A11Y-007**: Screen reader compatibility (manual)
- Other tests can be semi-automated via MCP + manual verification

### Best Practices
1. **Test with real screen readers** (not just automated tools)
2. **Use keyboard-only** for full test session
3. **Check contrast ratios** for all text
4. **Verify semantic HTML** via browser inspector
5. **Test at 200% zoom** (WCAG requirement)

---

## 🌟 Accessibility Improvements Roadmap

### Phase 1 (Must Have - WCAG A)
- [ ] Full keyboard navigation
- [ ] No keyboard traps
- [ ] Semantic HTML (buttons, headings)
- [ ] Basic focus indicators
- [ ] Alternative text for images

### Phase 2 (Should Have - WCAG AA)
- [ ] Enhanced focus indicators (visible, high contrast)
- [ ] Color contrast 4.5:1 for all text
- [ ] ARIA labels for dynamic content
- [ ] Screen reader compatibility
- [ ] Zoom support (200%)

### Phase 3 (Nice to Have - WCAG AAA)
- [ ] Color contrast 7:1 (enhanced)
- [ ] Reduced motion support
- [ ] High contrast mode
- [ ] Keyboard shortcut help
- [ ] Skip navigation links

---

## 🔗 Related Documents

- **Previous**: `05-performance.md`
- **Test Plan**: `../test-plan.md`
- **MCP Guide**: `../mcp-testing-guide.md`
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## 📚 Additional Resources

### WCAG Resources
- **W3C WCAG 2.1**: https://www.w3.org/TR/WCAG21/
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/

### Testing Guides
- **Keyboard Testing**: https://webaim.org/articles/keyboard/
- **Screen Reader Testing**: https://webaim.org/articles/screenreader_testing/
- **Color Contrast**: https://webaim.org/articles/contrast/

---

**Remember**: Accessibility is about inclusive design. Everyone should be able to play!
