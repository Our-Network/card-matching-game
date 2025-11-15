# Bug Report

**Bug ID**: BUG-XXX
**Date Reported**: YYYY-MM-DD
**Reported By**: [Your Name]
**Status**: Open / In Progress / Fixed / Closed / Won't Fix
**Priority**: P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)

---

## 📋 Bug Summary

**Title**: [Clear, concise bug title]

**Short Description**: [One-line summary of the issue]

---

## 🔍 Bug Details

### Environment
- **Test Case ID**: [Test case where bug was found]
- **Browser**: Chrome Version X.X.X
- **Operating System**: [macOS / Windows / Linux] Version X.X
- **Viewport**: 1920x1080
- **Build/Version**: [Application version number]
- **Test URL**: file:///path/to/index.html

### Category
- [ ] Functional
- [ ] UI/Visual
- [ ] Performance
- [ ] Security
- [ ] Accessibility
- [ ] Usability
- [ ] Other: [Specify]

### Affected Component
- [ ] Start Screen
- [ ] Difficulty Selection
- [ ] Game Board
- [ ] Card System
- [ ] Timer
- [ ] Score System
- [ ] Result Screen
- [ ] Navigation
- [ ] Other: [Specify]

---

## 🐛 Bug Description

### What Happened?
[Detailed description of the bug behavior]

### Expected Behavior
[What should happen instead]

### Actual Behavior
[What actually happened]

### Impact
**User Impact**: [How does this affect users?]
- [ ] Blocks core functionality
- [ ] Causes data loss
- [ ] Poor user experience
- [ ] Minor inconvenience
- [ ] Cosmetic issue

**Business Impact**: [Critical / High / Medium / Low]

---

## 📝 Steps to Reproduce

### Preconditions
- Precondition 1 (e.g., "Game must be on Easy difficulty")
- Precondition 2 (e.g., "Timer must be below 10 seconds")

### Reproduction Steps
1. Step 1 (e.g., "Navigate to game URL")
2. Step 2 (e.g., "Click START button")
3. Step 3 (e.g., "Select EASY difficulty")
4. Step 4 (e.g., "Click two cards rapidly")
5. Step 5 (e.g., "Observe incorrect behavior")

### MCP Commands (if applicable)
```javascript
// Chrome DevTools MCP commands used to reproduce
mcp__chrome-devtools__navigate_page({
  type: "url",
  url: "file:///path/to/index.html"
})
mcp__chrome-devtools__click({ uid: "start-button" })
// ... (reproduction steps)
```

### Frequency
- [ ] Always (100%)
- [ ] Often (>75%)
- [ ] Sometimes (25-75%)
- [ ] Rare (<25%)
- [ ] Once

---

## 📸 Evidence

### Screenshots
- **Before State**: `bugs/BUG-XXX-before.png`
- **Bug Occurrence**: `bugs/BUG-XXX-error.png`
- **After State**: `bugs/BUG-XXX-after.png`

### Console Errors
```
Error: [Error message from console]
  at file.js:123:45
  at function.name (file.js:67:89)

Additional error details...
```

### Console Warnings
```
Warning: [Warning message from console]
```

### Network Errors (if applicable)
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
URL: file:///path/to/resource.jpg
```

### Performance Impact (if applicable)
- **Before Bug**: FPS 60, Memory 80MB
- **During Bug**: FPS 15, Memory 150MB

### Video Recording (if available)
- `bugs/BUG-XXX-recording.mp4`

---

## 🔬 Technical Analysis

### Root Cause (if known)
[Technical explanation of why the bug occurs]

### Affected Code (if identified)
**File**: `js/path/to/file.js`
**Function**: `functionName()`
**Line**: 123-145

```javascript
// Relevant code snippet
function buggyFunction() {
  // Code that causes the bug
  let value = someValue; // Bug: value can be undefined
  return value.property; // TypeError if value is undefined
}
```

### Related Issues
- Related to: BUG-XXX
- Duplicate of: BUG-XXX
- Blocks: BUG-XXX
- Blocked by: BUG-XXX

---

## 💡 Suggested Fix

### Proposed Solution
[Describe how to fix the bug]

### Code Changes Needed
```javascript
// Suggested fix
function buggyFunction() {
  let value = someValue;
  // Add null check
  if (!value) {
    console.error("Value is undefined");
    return null;
  }
  return value.property;
}
```

### Alternative Solutions
1. **Alternative 1**: [Description]
   - Pros: [List pros]
   - Cons: [List cons]

2. **Alternative 2**: [Description]
   - Pros: [List pros]
   - Cons: [List cons]

---

## ✅ Verification Steps

### How to Verify Fix
1. Apply fix to codebase
2. Reproduce original steps
3. Verify expected behavior occurs
4. Run related test cases
5. Check for regressions

### Test Cases to Re-run
- [ ] Test case ID: XX-001
- [ ] Test case ID: XX-002
- [ ] Regression test: XX-010

---

## 🚨 Priority Justification

### Why this priority?
**P0 (Critical)**: [Explain if P0]
- Blocks core functionality
- Causes data loss or corruption
- Security vulnerability
- Production is down

**P1 (High)**: [Explain if P1]
- Major feature broken
- Poor user experience
- Affects many users
- Workaround is complex

**P2 (Medium)**: [Explain if P2]
- Minor feature issue
- Edge case bug
- Simple workaround available
- Cosmetic with functional impact

**P3 (Low)**: [Explain if P3]
- Cosmetic issue only
- Very rare occurrence
- No user impact
- Nice-to-fix

---

## 📅 Bug Lifecycle

### History
| Date | Status | Action | By |
|------|--------|--------|-----|
| YYYY-MM-DD | Open | Bug reported | [Name] |
| YYYY-MM-DD | In Progress | Assigned to developer | [Name] |
| YYYY-MM-DD | Fixed | Fix committed | [Name] |
| YYYY-MM-DD | Verified | Fix verified | [Name] |
| YYYY-MM-DD | Closed | Issue closed | [Name] |

### Assigned To
**Developer**: [Name]
**Reviewer**: [Name]
**Verifier**: [Name]

### Target Fix Date
**Planned**: YYYY-MM-DD
**Actual**: YYYY-MM-DD

---

## 🔗 Related Links

- **Test Case**: `../scenarios/XX-category.md#test-case-id`
- **Test Result**: `../results/YYYY-MM-DD-test-run.md`
- **Code Repository**: [Link to repo]
- **Pull Request**: [Link to PR fixing the bug]
- **Related Bug Reports**: `BUG-XXX.md`, `BUG-YYY.md`

---

## 💬 Comments & Discussion

### Comment 1 (YYYY-MM-DD by [Name])
[Comment text]

### Comment 2 (YYYY-MM-DD by [Name])
[Comment text]

---

## 📊 Resolution Summary

### Fix Applied
**Date Fixed**: YYYY-MM-DD
**Fixed By**: [Developer Name]
**Commit/PR**: [Link or commit hash]

**Changes Made**:
- File: `js/file.js` - Added null check
- File: `js/other.js` - Updated error handling

### Verification Results
**Verified By**: [Tester Name]
**Verification Date**: YYYY-MM-DD
**Status**: ✅ Verified Fixed / ❌ Not Fixed / ⚠️ Partially Fixed

**Test Results**:
- Original reproduction steps: ✅ No longer reproduces
- Related test cases: ✅ All passed
- Regression testing: ✅ No new issues

---

## 🏁 Closure

**Closed By**: [Name]
**Close Date**: YYYY-MM-DD
**Resolution**:
- [ ] Fixed
- [ ] Won't Fix (Reason: [Explain])
- [ ] Duplicate of BUG-XXX
- [ ] Cannot Reproduce
- [ ] By Design
- [ ] Deferred (Reason: [Explain])

**Final Notes**:
[Any final observations or lessons learned]

---

**Report Created**: YYYY-MM-DD HH:MM
**Last Updated**: YYYY-MM-DD HH:MM
**Version**: 1.0
