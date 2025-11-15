# Memory Card Game - E2E Test Plan

## 📋 Document Information

**Project**: Memory Card Game (p5.js)
**Test Type**: End-to-End (E2E) Testing
**Test Tool**: Chrome DevTools MCP
**Version**: 1.0
**Last Updated**: 2025-11-10
**Owner**: QA Team

---

## 🎯 Testing Objectives

### Primary Goals
1. **Functional Verification**: Validate all game mechanics work correctly across 4 difficulty levels
2. **Quality Assurance**: Ensure production-ready quality with comprehensive coverage
3. **Performance Validation**: Meet Core Web Vitals standards (INP ≤200ms, LCP ≤2.5s, CLS ≤0.1)
4. **User Experience**: Verify smooth, bug-free user interactions
5. **Regression Prevention**: Establish baseline test suite for future changes

### Success Criteria
- **Critical Tests**: 100% pass rate (blocking release)
- **High Priority**: ≥95% pass rate
- **Medium Priority**: ≥90% pass rate
- **Low Priority**: ≥80% pass rate
- **Performance**: All Core Web Vitals in "Good" range
- **Zero Critical Bugs**: No P0/P1 bugs in production

---

## 🔍 Scope

### In Scope
✅ All game screens (Start, Difficulty, Playing, Result)
✅ All difficulty levels (Easy, Medium, Hard, Hell)
✅ Core game mechanics (card matching, timer, score, combos)
✅ User interactions (click, hover, keyboard shortcuts)
✅ UI components and animations
✅ Timer accuracy and countdown logic
✅ Win/lose conditions
✅ Screen transitions and state management
✅ Performance benchmarks
✅ Basic accessibility (keyboard navigation, focus management)

### Out of Scope
❌ Unit tests (separate test suite)
❌ Backend/API testing (no backend)
❌ Sound testing (subjective, manual verification)
❌ Cross-browser compatibility (Chrome only for E2E)
❌ Mobile device testing (desktop-first)
❌ Security testing (no sensitive data)
❌ Load/stress testing (single-user game)

---

## 📊 Test Coverage Strategy

### Testing Pyramid Approach
```
           /\
          /  \  E2E Tests (20%)
         /____\  - Happy paths
        /      \ - Critical flows
       /        \
      /__________\ Unit Tests (80%)
                   - Edge cases
                   - Error handling
```

### Coverage Distribution
| Category | Test Count | Coverage | Priority |
|----------|------------|----------|----------|
| Smoke Tests | 5-10 | Critical paths | P0 (Blocker) |
| Happy Path | 20-30 | Normal workflows | P1 (High) |
| Edge Cases | 30-40 | Boundary conditions | P2 (Medium) |
| Error Scenarios | 20-30 | Failure handling | P2 (Medium) |
| Performance | 10-15 | Benchmarks | P1 (High) |
| Accessibility | 5-10 | A11y compliance | P2 (Medium) |
| **Total** | **90-135** | **Comprehensive** | - |

---

## 🗂️ Test Organization

### Test Categories

#### 1. Smoke Tests (`01-smoke-tests.md`)
**Purpose**: Validate critical functionality before deeper testing
**Execution**: Every build, before any other tests
**Pass Criteria**: 100% (blocks further testing if fails)

**Key Scenarios**:
- Application launches successfully
- All screens accessible
- Basic game playthrough works
- No console errors on startup

#### 2. Happy Path Tests (`02-happy-path.md`)
**Purpose**: Verify normal user workflows
**Execution**: Every release candidate
**Pass Criteria**: ≥95%

**Key Scenarios**:
- Complete game flow for each difficulty
- Score calculation accuracy
- Timer countdown functionality
- Win/lose conditions
- Retry/reset functionality

#### 3. Edge Case Tests (`03-edge-cases.md`)
**Purpose**: Test boundary conditions and unusual scenarios
**Execution**: Release candidates and major updates
**Pass Criteria**: ≥90%

**Key Scenarios**:
- Rapid consecutive clicks
- Clicking during animations
- Timer edge cases (0s, 1s remaining)
- First/last card pairs
- Already-matched card interactions

#### 4. Error Scenario Tests (`04-error-scenarios.md`)
**Purpose**: Validate error handling and recovery
**Execution**: Major releases
**Pass Criteria**: ≥90%

**Key Scenarios**:
- Resource loading failures
- Invalid game states
- Browser compatibility issues
- Graceful degradation

#### 5. Performance Tests (`05-performance.md`)
**Purpose**: Ensure performance standards are met
**Execution**: Every release candidate
**Pass Criteria**: 100% (all metrics in "Good" range)

**Key Scenarios**:
- Page load time measurement
- Animation frame rate validation
- Timer accuracy testing
- Memory usage monitoring
- Core Web Vitals validation

#### 6. Accessibility Tests (`06-accessibility.md`)
**Purpose**: Verify basic accessibility compliance
**Execution**: Major releases
**Pass Criteria**: ≥80%

**Key Scenarios**:
- Keyboard navigation
- Focus management
- Screen reader compatibility (basic)
- Color contrast validation

---

## 🛠️ Testing Tools & Environment

### Primary Tool: Chrome DevTools MCP
**27 Professional Testing Tools** across 6 categories:

**Input Tools** (8):
- click, drag, fill, fill_form, handle_dialog, hover, press_key, upload_file

**Navigation** (5):
- close_page, list_pages, navigate_page, new_page, select_page

**Performance** (3):
- performance_start_trace, performance_stop_trace, performance_analyze_insight

**Network** (2):
- list_network_requests, get_network_request

**Console** (2):
- list_console_messages, get_console_message

**Debugging** (7):
- take_screenshot, take_snapshot, evaluate_script, emulate, resize_page, wait_for

### Test Environment
- **Browser**: Chrome (latest stable)
- **Viewport**: 1920x1080 (desktop)
- **Network**: Fast 3G / Regular 4G / WiFi
- **CPU**: No throttling / 4x slowdown (performance tests)
- **Test URL**: `file:///path/to/index.html` or local server

---

## 📅 Test Execution Schedule

### Pre-Commit
- Smoke tests (automated)
- Lint and type checks

### Pull Request
- Smoke tests
- Happy path tests (affected areas)

### Release Candidate
- Full test suite (all categories)
- Performance validation
- Regression tests

### Production Release
- Smoke tests
- Critical path validation
- Performance monitoring (post-deployment)

---

## 🎯 Test Prioritization

### Priority Levels

**P0 - Blocker** (Must Pass)
- Application launches
- Core game mechanics work
- No critical console errors
- Basic navigation functional

**P1 - High** (Should Pass)
- All difficulty levels playable
- Timer accuracy within tolerance
- Score calculation correct
- Performance metrics in "Good" range
- Win/lose conditions accurate

**P2 - Medium** (Nice to Have)
- Edge case handling
- Error recovery mechanisms
- UI polish and animations
- Accessibility features

**P3 - Low** (Optional)
- Advanced animations
- Debug features
- Minor visual inconsistencies

---

## 📝 Test Case Template

### Standard Format
```markdown
## Test Case: [TC-XXX] [Test Name]

**Category**: [Smoke/Happy Path/Edge Case/Error/Performance/Accessibility]
**Priority**: [P0/P1/P2/P3]
**Difficulty**: [Easy/Medium/Hard/Hell/All]
**Estimated Time**: [X minutes]

### Description
[Brief description of what this test validates]

### Preconditions
- Browser: Chrome (latest)
- Starting URL: [URL]
- Initial State: [Game state]
- Test Data: [Any required data]

### Test Steps
1. **Action**: [User action or MCP command]
   - **Expected**: [Expected result]
   - **Validation**: [How to verify]

2. **Action**: [Next action]
   - **Expected**: [Expected result]
   - **Validation**: [How to verify]

### Expected Results
- [Specific outcome 1]
- [Specific outcome 2]
- [Success criteria]

### MCP Commands
```javascript
// Executable Chrome DevTools MCP commands
mcp__chrome-devtools__navigate_page({ url: "..." })
mcp__chrome-devtools__click({ uid: "..." })
mcp__chrome-devtools__wait_for({ text: "..." })
```

### Pass Criteria
- [ ] All steps executed successfully
- [ ] Expected results match actual results
- [ ] No console errors
- [ ] Performance within acceptable range

### Actual Results
[To be filled during test execution]

### Notes
- [Additional observations]
- [Related test cases]
- [Known issues]
```

---

## 🐛 Bug Reporting

### Bug Priority Levels

**P0 - Critical** (Production Down)
- Game completely broken
- Unable to start game
- Data loss or corruption

**P1 - High** (Major Functionality)
- Core mechanics broken
- Timer not working
- Score calculation wrong
- Difficulty level unplayable

**P2 - Medium** (Minor Functionality)
- UI glitches
- Animation issues
- Edge case bugs
- Performance degradation

**P3 - Low** (Nice to Fix)
- Visual inconsistencies
- Minor animation glitches
- Debug feature issues

### Bug Report Template
See: `tests/bugs/bug-report-template.md`

---

## 📊 Test Metrics & Reporting

### Key Metrics to Track
- **Test Execution Rate**: Tests run / Total tests
- **Pass Rate**: Passed tests / Executed tests
- **Defect Density**: Bugs found / Test cases
- **Test Coverage**: Features tested / Total features
- **Performance Scores**: Core Web Vitals trends
- **Execution Time**: Total test suite duration

### Reporting Format
- **Daily**: Smoke test results
- **Weekly**: Full test suite results
- **Release**: Comprehensive test report with metrics

### Test Result Template
See: `tests/results/test-result-template.md`

---

## 🔄 Test Maintenance

### Update Triggers
- New feature added → Create new test cases
- Bug fixed → Add regression test
- Performance degradation → Add performance test
- User feedback → Add relevant test scenarios

### Review Cycle
- **Monthly**: Review test effectiveness
- **Quarterly**: Update test priorities
- **Bi-annually**: Comprehensive test suite audit

---

## 🎓 Best Practices

### Test Design Principles
1. **Independent**: Each test can run in isolation
2. **Repeatable**: Same inputs → same results
3. **Fast**: E2E tests complete in <5 minutes
4. **Clear**: Test intent obvious from name/description
5. **Maintainable**: Easy to update when app changes

### Execution Guidelines
1. **Run smoke tests first** (fail fast)
2. **Prioritize critical paths** (80/20 rule)
3. **Test in clean state** (reset between tests)
4. **Document failures** (screenshots, logs, steps)
5. **Validate performance** (track trends over time)

### Common Pitfalls to Avoid
❌ Testing too many edge cases in E2E (use unit tests)
❌ Flaky tests (timing issues, race conditions)
❌ Tests dependent on external factors
❌ Overly complex test scenarios
❌ Poor test data management

---

## 📚 Related Documents

- **MCP Testing Guide**: `tests/mcp-testing-guide.md`
- **Smoke Tests**: `tests/scenarios/01-smoke-tests.md`
- **Happy Path Tests**: `tests/scenarios/02-happy-path.md`
- **Edge Cases**: `tests/scenarios/03-edge-cases.md`
- **Error Scenarios**: `tests/scenarios/04-error-scenarios.md`
- **Performance Tests**: `tests/scenarios/05-performance.md`
- **Accessibility Tests**: `tests/scenarios/06-accessibility.md`

---

## 🚀 Getting Started

### For First-Time Testers
1. Read this test plan thoroughly
2. Review `mcp-testing-guide.md` for MCP tool usage
3. Start with `01-smoke-tests.md` (simplest scenarios)
4. Execute tests using Chrome DevTools MCP
5. Document results in `tests/results/`

### Quick Start Commands
```bash
# Navigate to project directory
cd /Users/musinsa/study/media-tech-team-prj

# Open test documentation
open tests/test-plan.md
open tests/mcp-testing-guide.md

# Start testing with smoke tests
open tests/scenarios/01-smoke-tests.md
```

---

## 📞 Contact & Support

**Questions about test plan**: Refer to CLAUDE.md system documentation
**Bug reports**: Use template in `tests/bugs/`
**Test results**: Store in `tests/results/`

---

**Remember**: Quality is everyone's responsibility. Test early, test often, test thoroughly!
