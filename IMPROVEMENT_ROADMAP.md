# 개선 로드맵

## 🎯 즉시 실행 가능한 개선 사항

### 1️⃣ ConfigManager 중복 해결 (우선순위: HIGH)

**현재 문제**:
- `config.js`: 전역 상수로 프로젝트 전반에서 사용
- `ConfigManager.js`: 326라인이지만 GameManager에서만 debug 플래그로 사용

**권장 해결책: ConfigManager.js 제거**

#### 단계별 가이드

1. **GameManager.js 수정**
```javascript
// Before (js/logic/GameManager.js:45)
this._debug = typeof config !== 'undefined' && config.get('debug.enabled', false);

// After
this._debug = window.location.hostname === 'localhost' ||
              window.location.protocol === 'file:';
```

2. **ConfigManager.js 파일 제거**
```bash
git rm js/core/ConfigManager.js
```

3. **index.html에서 스크립트 태그 제거**
```html
<!-- 이 줄 제거 -->
<script src="js/core/ConfigManager.js"></script>
```

4. **테스트**
- 게임이 정상 작동하는지 확인
- 개발/프로덕션 환경에서 debug 로그 확인

**예상 효과**:
- -326 라인 코드 감소
- 설정 관리 단순화
- 유지보수 포인트 1개 제거

---

### 2️⃣ UIRenderer 분리 (우선순위: MEDIUM)

**현재 문제**:
- UIRenderer.js: 861 라인 (권장: < 500)
- 여러 책임 혼재 (시작 화면, 게임 UI, 결과 화면, 메시지)

**권장 해결책: 3개 파일로 분리**

#### 제안 구조

```
js/rendering/
├── screens/
│   ├── StartScreen.js       (시작 & 난이도 선택)
│   ├── GameScreen.js        (게임 플레이 UI)
│   └── ResultScreen.js      (결과 화면)
└── UIRenderer.js            (오케스트레이터, 200라인)
```

#### 분리 기준

**StartScreen.js** (~250 라인):
- `drawStartScreen()`
- `drawDifficultyScreen()`
- `handleStartClick()`
- `handleDifficultyClick()`

**GameScreen.js** (~300 라인):
- `drawGameUI()`
- `drawStatusBar()`
- `drawTimer()`
- `drawHearts()`
- `drawScore()`

**ResultScreen.js** (~200 라인):
- `drawResultScreen()`
- `handleResultClick()`

**UIRenderer.js** (오케스트레이터, ~200 라인):
- 메시지 시스템
- 헬퍼 메시지
- 스크린 인스턴스 관리

#### 구현 예시

```javascript
// js/rendering/UIRenderer.js
class UIRenderer {
    constructor() {
        this.startScreen = new StartScreen();
        this.gameScreen = new GameScreen();
        this.resultScreen = new ResultScreen();
        this.messages = [];
    }

    drawStartScreen() {
        return this.startScreen.draw();
    }

    drawGameUI(gameState) {
        return this.gameScreen.draw(gameState);
    }

    // 메시지 시스템은 UIRenderer가 계속 관리
    showMessage(text, duration, type) {
        // ...
    }
}

// js/rendering/screens/StartScreen.js
class StartScreen {
    draw() {
        background(255);
        // 시작 화면 렌더링
    }

    handleClick(x, y) {
        // 클릭 처리
    }
}
```

**예상 효과**:
- 단일 책임 원칙 준수
- 파일당 평균 250 라인
- 유지보수성 향상

---

## 🧪 테스트 전략 수립 (우선순위: MEDIUM)

### Phase 1: Core 레이어 테스트

**js/core/Card.js 테스트**:
```javascript
// tests/core/Card.test.js
describe('Card', () => {
    test('카드 생성', () => {
        const card = new Card(1, 'apple', 100, 200);
        expect(card.id).toBe(1);
        expect(card.type).toBe('apple');
    });

    test('카드 뒤집기', () => {
        const card = new Card(1, 'apple', 100, 200);
        expect(card.isFlipped).toBe(false);
        card.flip();
        expect(card.isFlipped).toBe(true);
    });

    test('카드 매칭 확인', () => {
        const card1 = new Card(1, 'apple', 100, 200);
        const card2 = new Card(2, 'apple', 150, 200);
        expect(card1.isMatchWith(card2)).toBe(true);
    });
});
```

**js/core/GameState.js 테스트**:
```javascript
// tests/core/GameState.test.js
describe('GameState', () => {
    test('게임 상태 초기화', () => {
        const state = new GameState();
        expect(state.score).toBe(0);
        expect(state.phase).toBe('start');
    });

    test('매칭 기록', () => {
        const state = new GameState();
        state.recordMatch(10);
        expect(state.score).toBe(10);
        expect(state.matchedPairs).toBe(1);
    });
});
```

### Phase 2: Logic 레이어 테스트

**GameManager 통합 테스트**:
```javascript
// tests/logic/GameManager.integration.test.js
describe('GameManager Integration', () => {
    let gameState, cardManager, gameManager;

    beforeEach(() => {
        gameState = new GameState();
        cardManager = new CardManager(CARD_CONFIG);
        gameManager = new GameManager(gameState, cardManager);
    });

    test('게임 시작', () => {
        gameManager.startGame(DIFFICULTY.EASY);
        expect(gameState.cards.length).toBe(8);
        expect(gameState.phase).toBe('preview');
    });
});
```

### 테스트 도구 설정

**package.json 추가**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@jest/globals": "^29.0.0"
  }
}
```

**jest.config.js**:
```javascript
module.exports = {
    testEnvironment: 'jsdom',
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    }
};
```

---

## 📊 점진적 TypeScript 도입 (우선순위: LOW)

### Phase 1: JSDoc으로 타입 힌트

**현재 코드에 JSDoc 추가**:
```javascript
/**
 * 카드 클릭 핸들러
 * @param {number} x - 마우스 x 좌표
 * @param {number} y - 마우스 y 좌표
 * @returns {boolean} 클릭이 처리되었는지 여부
 */
handleClick(x, y) {
    // ...
}
```

### Phase 2: TypeScript 설정

**tsconfig.json**:
```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ES2020",
        "allowJs": true,
        "checkJs": true,
        "outDir": "./dist",
        "strict": true
    },
    "include": ["js/**/*"]
}
```

### Phase 3: 파일별 마이그레이션

**우선순위**:
1. Core 레이어 (Card.js, GameState.js)
2. Logic 레이어 (CardManager.js, GameManager.js)
3. Rendering 레이어

---

## ⚡ 성능 최적화 기회

### 1. 파티클 시스템 최적화

**현재**: 모든 파티클을 매 프레임 업데이트
**개선**: Object Pooling 패턴

```javascript
class ParticlePool {
    constructor(maxSize = 100) {
        this.pool = [];
        this.active = [];
        this.maxSize = maxSize;
    }

    acquire() {
        return this.pool.pop() || new Particle();
    }

    release(particle) {
        particle.reset();
        if (this.pool.length < this.maxSize) {
            this.pool.push(particle);
        }
    }
}
```

### 2. 카드 렌더링 최적화

**현재**: 모든 카드를 매 프레임 그림
**개선**: Dirty Flag 패턴

```javascript
class Card {
    constructor(...) {
        this.isDirty = true; // 변경 플래그
    }

    flip() {
        this.isFlipped = !this.isFlipped;
        this.isDirty = true; // 재렌더링 필요
    }
}

// CardRenderer
drawAllCards(cards) {
    cards.forEach(card => {
        if (card.isDirty) {
            this.drawCard(card);
            card.isDirty = false;
        }
    });
}
```

---

## 🎨 향후 기능 구현 가이드

### 특수 카드: BONUS

**설계**:
1. BONUS 카드는 자동으로 짝이 맞춰짐
2. 일정 시간(2초) 후 자동 공개
3. +50 보너스 점수

**구현 체크리스트**:
- [ ] `Card.js`에 `isBonusCard` 속성 추가
- [ ] `CardManager.js`에서 BONUS 카드 생성 로직
- [ ] `GameManager.js`에서 자동 매칭 타이머
- [ ] `CardRenderer.js`에서 금색 카드 렌더링
- [ ] 보너스 점수 계산 로직

### 특수 카드: BOMB

**설계**:
1. BOMB 카드 클릭 시 -30초 페널티
2. 카드 섞기 효과 트리거
3. 빨간색 폭발 애니메이션

**구현 체크리스트**:
- [ ] `Card.js`에 `isBombCard` 속성 추가
- [ ] `CardManager.js`에서 카드 섞기 메서드
- [ ] `GameManager.js`에서 BOMB 페널티 처리
- [ ] `ParticleSystem.js`에서 폭발 효과
- [ ] `SoundManager.js`에서 폭탄 효과음

### 난이도: DISASTER (3장 매칭)

**설계**:
1. 3장이 모두 같아야 매칭 성공
2. 3장 선택 후 매칭 체크
3. 실패 시 모두 뒤집기

**구현 체크리스트**:
- [ ] `GameState.js`에 `thirdCard` 속성 추가
- [ ] `GameManager.js`에서 3장 매칭 로직
- [ ] `CardManager.js`에서 3벌 카드 생성
- [ ] UI에서 3장 선택 표시

---

## 📈 성과 측정 지표

### 코드 품질 KPI

| 지표 | 현재 | 목표 (1개월) | 목표 (3개월) |
|------|------|--------------|--------------|
| 평균 파일 크기 | 317 라인 | < 300 라인 | < 250 라인 |
| 테스트 커버리지 | 0% | 50% | 80% |
| JSDoc 완성도 | 60% | 80% | 95% |
| 기술 부채 | Medium | Low | Very Low |

### 성능 KPI

| 지표 | 현재 | 목표 |
|------|------|------|
| 초기 로딩 시간 | ? | < 1초 |
| 카드 뒤집기 응답 | ~50ms | < 30ms |
| 파티클 FPS | ~40fps | 60fps |

---

## ✅ 실행 체크리스트

### Week 1-2
- [ ] ConfigManager 제거
- [ ] GameManager debug 플래그 수정
- [ ] 테스트 환경 설정 (Jest)
- [ ] Core 레이어 유닛 테스트 작성

### Week 3-4
- [ ] UIRenderer 분리 계획 수립
- [ ] StartScreen 분리 구현
- [ ] GameScreen 분리 구현
- [ ] ResultScreen 분리 구현

### Month 2-3
- [ ] Logic 레이어 테스트 작성
- [ ] E2E 테스트 설정
- [ ] 파티클 시스템 최적화
- [ ] JSDoc 완성도 95% 달성

### Future (3개월+)
- [ ] BONUS 카드 구현
- [ ] BOMB 카드 구현
- [ ] DISASTER 난이도 구현
- [ ] HELL 난이도 구현
- [ ] TypeScript 마이그레이션 검토

---

## 📚 참고 자료

### 리팩토링 패턴
- [Refactoring Guru](https://refactoring.guru/)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### 디자인 패턴
- Object Pool Pattern: 파티클 시스템
- Observer Pattern: EventEmitter (이미 구현됨 ✅)
- Strategy Pattern: 난이도별 로직
- Factory Pattern: 카드/스크린 생성

### 테스트 전략
- [Jest 공식 문서](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- Test Pyramid: Unit → Integration → E2E

---

## 🎓 학습 목표

### 팀 역량 강화
1. **단일 책임 원칙 (SRP)** 실천
2. **테스트 주도 개발 (TDD)** 경험
3. **리팩토링 기법** 습득
4. **성능 최적화** 실전

### 코드 리뷰 포인트
- 파일 크기: < 500 라인
- 메서드 크기: < 50 라인
- 순환 복잡도: < 10
- 테스트 커버리지: > 80%

---

**작성일**: 2025-11-18
**다음 리뷰**: 2주 후
