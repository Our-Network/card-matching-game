# Developer Guide

Card Matching Game 개발자 가이드입니다. 프로젝트 설정, 개발 워크플로우, 코딩 규칙, 테스팅을 안내합니다.

## 목차
- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 규칙](#코딩-규칙)
- [테스팅](#테스팅)
- [디버깅](#디버깅)
- [성능 최적화](#성능-최적화)
- [배포](#배포)

---

## 개발 환경 설정

### 필요 조건

- **웹 브라우저**: Chrome, Firefox, Safari, Edge (최신 버전)
- **코드 에디터**: VS Code 권장
- **로컬 서버**: Python 또는 Node.js
- **Git**: 버전 관리
- **Node.js**: (선택) 개발 도구 설치

### 프로젝트 클론

```bash
git clone https://github.com/your-username/card-matching-game.git
cd card-matching-game
```

### 로컬 서버 실행

#### Option 1: Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Node.js

```bash
# npx 사용
npx http-server -p 8000

# 또는 http-server 전역 설치
npm install -g http-server
http-server -p 8000
```

#### Option 3: VS Code Live Server

1. VS Code에서 프로젝트 열기
2. Live Server 확장 설치
3. `index.html` 우클릭 → "Open with Live Server"

### 브라우저 접속

```
http://localhost:8000
```

---

## 프로젝트 구조

```
card-matching-game/
├── index.html              # 메인 HTML 파일
├── README.md               # 프로젝트 설명
├── DESIGN_GUIDE.md         # 디자인 가이드
├── PROJECT_OVERVIEW.md     # 프로젝트 개요
│
├── docs/                   # 문서 폴더
│   ├── API_REFERENCE.md    # API 레퍼런스
│   ├── ARCHITECTURE.md     # 아키텍처 문서
│   ├── USER_GUIDE.md       # 사용자 가이드
│   ├── DEVELOPER_GUIDE.md  # 개발자 가이드 (이 파일)
│   └── CONTRIBUTING.md     # 기여 가이드
│
├── css/
│   └── style.css           # 전역 스타일
│
├── js/
│   ├── config.js           # 게임 설정
│   ├── main.js             # p5.js 진입점
│   │
│   ├── core/               # 데이터 모델
│   │   ├── Card.js         # 카드 클래스
│   │   └── GameState.js    # 게임 상태
│   │
│   ├── logic/              # 비즈니스 로직
│   │   ├── CardManager.js  # 카드 관리
│   │   └── GameManager.js  # 게임 로직
│   │
│   ├── rendering/          # UI 렌더링
│   │   ├── CardRenderer.js # 카드 렌더링
│   │   ├── UIRenderer.js   # UI 렌더링
│   │   ├── ParticleSystem.js # 파티클 효과
│   │   └── screens/        # 화면 컴포넌트
│   │       ├── StartScreen.js
│   │       ├── GameScreen.js
│   │       └── ResultScreen.js
│   │
│   └── utils/              # 유틸리티
│       ├── EventEmitter.js # 이벤트 시스템
│       ├── Logger.js       # 로깅
│       ├── ArrayUtils.js   # 배열 처리
│       ├── GridCalculator.js # 그리드 계산
│       ├── SoundManager.js # 효과음
│       └── HighScoreManager.js # 점수 기록
│
└── assets/
    ├── images/             # 이미지 에셋
    │   └── cards/          # 카드 레퍼런스
    └── sounds/             # 효과음 (예정)
```

### 파일 로딩 순서

`index.html`에서 JavaScript 파일은 다음 순서로 로드됩니다:

1. **Config & Utils**: `config.js`, `Logger.js`, `EventEmitter.js`
2. **Utils Layer**: `ArrayUtils.js`, `GridCalculator.js`, etc.
3. **Core Layer**: `Card.js`, `GameState.js`
4. **Logic Layer**: `CardManager.js`, `GameManager.js`
5. **Rendering Layer**: `CardRenderer.js`, `UIRenderer.js`, etc.
6. **Main**: `main.js`

⚠️ **중요**: 파일 로딩 순서를 변경하지 마세요. 의존성 문제가 발생할 수 있습니다.

---

## 개발 워크플로우

### 1. 이슈 생성

작업 시작 전 GitHub Issues에 이슈를 생성합니다:

```markdown
### Feature: 새로운 난이도 추가

#### 설명
재앙 및 지옥 난이도를 추가합니다.

#### 작업 내용
- [ ] config.js에 난이도 설정 추가
- [ ] UIRenderer에 버튼 추가
- [ ] 테스트 및 검증

#### 예상 소요 시간
2시간
```

### 2. 브랜치 생성

```bash
# feature 브랜치 생성
git checkout -b feature/add-hell-difficulty

# bugfix 브랜치 생성
git checkout -b bugfix/fix-timer-issue
```

### 3. 개발

1. 코드 작성
2. 브라우저에서 테스트
3. 디버그 도구 사용
4. 코드 리뷰 (자체 검토)

### 4. 커밋

```bash
# 변경사항 확인
git status
git diff

# 스테이징
git add <파일명>

# 커밋 (Conventional Commits 형식)
git commit -m "feat: 재앙 및 지옥 난이도 추가"
```

**커밋 메시지 형식**:
```
<type>: <subject>

<body> (optional)

<footer> (optional)
```

**타입**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/도구 변경

### 5. 푸시 및 PR

```bash
# 푸시
git push origin feature/add-hell-difficulty

# GitHub에서 Pull Request 생성
# PR 템플릿에 따라 작성
```

### 6. 코드 리뷰 및 머지

- PR 리뷰 요청
- 피드백 반영
- main 브랜치로 머지

---

## 코딩 규칙

### JavaScript 스타일 가이드

#### 1. 네이밍 규칙

**변수/함수**: camelCase
```javascript
const cardWidth = 110;
function calculateScore() { }
```

**클래스**: PascalCase
```javascript
class GameManager { }
class CardRenderer { }
```

**상수**: UPPER_SNAKE_CASE
```javascript
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing'
};
```

**Private 속성/메서드**: `_` 접두사
```javascript
class Card {
    constructor() {
        this._id = 0;  // private
    }

    _flipCard() {  // private method
        // ...
    }
}
```

#### 2. 코드 구조

**클래스 구조**:
```javascript
class MyClass extends ParentClass {
    // 1. 생성자
    constructor(params) {
        super();
        this.publicProperty = value;
        this._privateProperty = value;
    }

    // 2. 공개 메서드
    publicMethod() {
        // ...
    }

    // 3. Private 메서드
    _privateMethod() {
        // ...
    }

    // 4. Getters/Setters
    get property() {
        return this._property;
    }

    set property(value) {
        this._property = value;
    }
}
```

#### 3. 주석

**JSDoc 스타일** 사용:
```javascript
/**
 * 카드를 뒤집습니다
 * @param {Card} card - 대상 카드
 * @param {number} duration - 애니메이션 시간 (ms)
 * @param {boolean} toFront - 앞면으로 뒤집을지 여부
 * @returns {Promise<void>}
 * @throws {Error} 카드가 유효하지 않을 경우
 */
function flipCard(card, duration, toFront) {
    // ...
}
```

**파일 헤더**:
```javascript
/**
 * @fileoverview 카드 렌더링 및 애니메이션 관리
 * @module rendering/CardRenderer
 * @author 윤현준
 * @requires p5.js
 */
```

#### 4. 에러 처리

**Try-Catch 사용**:
```javascript
try {
    gameManager.startGame(difficulty);
} catch (error) {
    logger.error('Failed to start game:', error);
    alert('게임을 시작할 수 없습니다.');
}
```

**명시적 예외 발생**:
```javascript
if (!card) {
    throw new TypeError('Card is required');
}

if (card.isMatched) {
    throw new Error('Card is already matched');
}
```

#### 5. 비동기 처리

**Promise 사용**:
```javascript
function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load: ${path}`));
        img.src = path;
    });
}
```

**Async/Await 사용**:
```javascript
async function initialize() {
    try {
        const images = await Promise.all([
            loadImage('card1.png'),
            loadImage('card2.png')
        ]);
        logger.info('Images loaded');
    } catch (error) {
        logger.error('Failed to load images:', error);
    }
}
```

### HTML/CSS 규칙

#### HTML

- 시맨틱 태그 사용
- 들여쓰기: 4 스페이스
- 속성 순서: `class`, `id`, `name`, `data-*`, `src`, `for`, `type`, `href`

```html
<div class="container" id="app" data-version="1.0">
    <button class="btn btn-primary" type="button">
        시작하기
    </button>
</div>
```

#### CSS

- 들여쓰기: 4 스페이스
- 클래스 네이밍: kebab-case
- 순서: 위치 → 박스 모델 → 타이포그래피 → 시각 효과

```css
.card-container {
    /* 위치 */
    position: absolute;
    top: 0;
    left: 0;

    /* 박스 모델 */
    width: 110px;
    height: 110px;
    padding: 10px;
    margin: 5px;

    /* 타이포그래피 */
    font-size: 16px;
    line-height: 1.5;

    /* 시각 효과 */
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

## 테스팅

### 수동 테스트

#### 1. 기능 테스트

각 기능을 브라우저에서 수동으로 테스트합니다:

**체크리스트**:
- [ ] 게임 시작 버튼 동작
- [ ] 난이도 선택 동작
- [ ] 카드 뒤집기 동작
- [ ] 매칭 성공/실패 처리
- [ ] 점수 계산 정확성
- [ ] 타이머 동작
- [ ] 하트 시스템 동작
- [ ] 게임 클리어/오버 처리
- [ ] 게임 리셋 동작

#### 2. 크로스 브라우저 테스트

다음 브라우저에서 테스트:
- [ ] Chrome (최신)
- [ ] Firefox (최신)
- [ ] Safari (최신)
- [ ] Edge (최신)

#### 3. 성능 테스트

- 60 FPS 유지 여부 확인
- 메모리 누수 확인 (Chrome DevTools)
- 애니메이션 부드러움 확인

### 자동 테스트 (예정)

**단위 테스트 프레임워크**: Jest

```javascript
// tests/GameState.test.js
describe('GameState', () => {
    let gameState;

    beforeEach(() => {
        gameState = new GameState();
        gameState.setDifficulty(DIFFICULTY.EASY);
    });

    describe('recordMatch', () => {
        it('should increase matched pairs', () => {
            gameState.recordMatch(10);
            expect(gameState.matchedPairs).toBe(1);
        });

        it('should add base score', () => {
            gameState.recordMatch(10);
            expect(gameState.baseScore).toBe(10);
        });

        it('should increase combo', () => {
            gameState.recordMatch(10);
            gameState.recordMatch(10);
            expect(gameState.combo).toBe(2);
        });
    });

    describe('recordMismatch', () => {
        it('should decrease hearts', () => {
            const initialHearts = gameState.hearts;
            gameState.recordMismatch(5);
            expect(gameState.hearts).toBe(initialHearts - 1);
        });

        it('should reset combo', () => {
            gameState.recordMatch(10);
            gameState.recordMismatch(5);
            expect(gameState.combo).toBe(0);
        });
    });
});
```

---

## 디버깅

### 브라우저 개발자 도구

#### Chrome DevTools

**단축키**:
- `F12` 또는 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- Console: `Cmd+Option+J` / `Ctrl+Shift+J`

**주요 기능**:
- **Elements**: DOM 구조 확인
- **Console**: 로그 확인, 명령어 실행
- **Sources**: 브레이크포인트 설정, 디버깅
- **Network**: 리소스 로딩 확인
- **Performance**: 성능 프로파일링
- **Memory**: 메모리 사용량 확인

#### 디버그 명령어

브라우저 콘솔에서 사용:

```javascript
// 게임 상태 확인
debugState();

// 출력 예시:
// {
//   phase: 'playing',
//   difficulty: '중',
//   score: 150,
//   hearts: 8,
//   timeRemaining: 75,
//   matchedPairs: 5,
//   totalPairs: 8,
//   attempts: 10,
//   combo: 2
// }

// 모든 카드 정보 확인
debugCards();

// 강제 게임 클리어 (테스트용)
debugWin();

// 남은 시간 설정 (테스트용)
debugSetTime(30);  // 30초로 설정
```

### 로깅

#### Logger 사용

```javascript
import { logger } from './utils/Logger.js';

// 정보 로그
logger.info('Game started', { difficulty: 'EASY' });

// 경고 로그
logger.warn('Time running out', { remaining: 10 });

// 에러 로그
logger.error('Failed to load card', error);

// 디버그 로그 (개발 환경에서만)
logger.debug('Card state', card.toJSON());

// 그룹 로그
logger.group('Match Check');
logger.info('First card:', card1.id);
logger.info('Second card:', card2.id);
logger.info('Is match:', card1.isMatchWith(card2));
logger.groupEnd();
```

### 브레이크포인트

**코드에 브레이크포인트 설정**:
```javascript
function checkMatch() {
    debugger;  // 여기서 실행 중단
    const isMatch = card1.isMatchWith(card2);
    return isMatch;
}
```

**조건부 브레이크포인트**:
```javascript
function flipCard(card) {
    // Chrome DevTools에서 조건 설정:
    // card.id === 5
    card.flip();
}
```

---

## 성능 최적화

### 렌더링 최적화

#### 1. 조건부 렌더링

필요한 요소만 렌더링:
```javascript
draw() {
    // 게임 중일 때만 카드 렌더링
    if (gameState.isPlaying()) {
        cardRenderer.render(gameState.cards);
    }

    // 애니메이션 진행 중일 때만 파티클 렌더링
    if (particleSystem.hasParticles()) {
        particleSystem.render();
    }
}
```

#### 2. 캐싱

정적 요소 캐싱:
```javascript
class BackgroundRenderer {
    constructor() {
        this._cloudPositions = null;  // 캐시
    }

    getCloudPositions() {
        if (!this._cloudPositions) {
            this._cloudPositions = this._calculateCloudPositions();
        }
        return this._cloudPositions;
    }
}
```

#### 3. 애니메이션 최적화

`Map`을 사용한 애니메이션 상태 관리:
```javascript
class CardRenderer {
    constructor() {
        this.animations = new Map();  // card.id → animation state
    }

    animateFlip(card, duration, toFront) {
        this.animations.set(card.id, {
            start: Date.now(),
            duration,
            toFront,
            progress: 0
        });
    }

    update() {
        const now = Date.now();

        for (const [cardId, anim] of this.animations) {
            const elapsed = now - anim.start;
            anim.progress = Math.min(elapsed / anim.duration, 1);

            if (anim.progress >= 1) {
                this.animations.delete(cardId);  // 완료된 애니메이션 제거
            }
        }
    }
}
```

### 메모리 관리

#### 1. 리소스 정리

```javascript
class GameManager {
    destroy() {
        // 타이머 정리
        this._stopTimer();
        this._clearPreviewTimeout();

        // 이벤트 리스너 제거
        this.removeAllListeners();

        // 참조 해제
        this.state = null;
        this.cardManager = null;
    }
}
```

#### 2. 이벤트 리스너 관리

```javascript
// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    gameManager.destroy();
});

// 페이지 숨김 시 타이머 정지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gameManager._stopTimer();
    } else if (gameState.isPlaying()) {
        gameManager._startTimer();
    }
});
```

### 성능 측정

#### Chrome DevTools Performance

1. Performance 탭 열기
2. 녹화 시작 (⚫️ 버튼)
3. 게임 플레이
4. 녹화 중지
5. 결과 분석:
   - FPS 그래프 확인
   - Main 스레드 활동 확인
   - 병목 지점 찾기

#### FPS 모니터링

```javascript
let lastTime = 0;
let fps = 0;

function draw() {
    // FPS 계산
    const now = Date.now();
    const delta = now - lastTime;
    fps = Math.round(1000 / delta);
    lastTime = now;

    // FPS 표시 (디버그 모드)
    if (DEBUG_MODE) {
        fill(0);
        text(`FPS: ${fps}`, 10, 20);
    }

    // ...게임 렌더링
}
```

---

## 배포

### 프로덕션 빌드 체크리스트

- [ ] 모든 기능 테스트 완료
- [ ] 크로스 브라우저 테스트 완료
- [ ] 디버그 코드 제거
- [ ] 콘솔 로그 최소화
- [ ] 성능 최적화 확인
- [ ] 문서 업데이트
- [ ] 버전 업데이트

### GitHub Pages 배포

#### 1. 저장소 설정

1. GitHub 저장소로 푸시
2. Settings → Pages
3. Source: `main` 브랜치 선택
4. 저장

#### 2. 배포 URL

```
https://your-username.github.io/card-matching-game/
```

### 버전 관리

**Semantic Versioning** 사용:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환 기능 추가
- **PATCH**: 하위 호환 버그 수정

**예제**:
- `1.0.0`: 첫 번째 정식 릴리즈
- `1.1.0`: 새로운 난이도 추가
- `1.1.1`: 타이머 버그 수정
- `2.0.0`: 게임 구조 대규모 변경

### 릴리즈 노트

```markdown
## [1.1.0] - 2024-01-15

### Added
- 재앙 및 지옥 난이도 추가
- 파티클 효과 개선

### Fixed
- 타이머 동기화 문제 수정
- 하트 시스템 버그 수정

### Changed
- 점수 계산 방식 개선
- UI 레이아웃 조정
```

---

## 확장 개발 가이드

### 새로운 난이도 추가

1. **config.js 수정**:
```javascript
const DIFFICULTY = {
    // ...기존 난이도
    HELL: {
        name: '지옥',
        pairs: 22,
        timeLimit: 60,
        gridCols: 8,
        gridRows: 6,
        pointsPerMatch: 30,
        timePenalty: 20,
        previewTime: 0,
        hearts: 25,
        specialCards: {
            bombs: 4
        }
    }
};
```

2. **UIRenderer 수정**:
```javascript
renderDifficultyScreen() {
    // ...기존 버튼
    this._renderDifficultyButton(DIFFICULTY.HELL, y, '지옥');
}
```

3. **특수 카드 구현** (필요 시):
```javascript
// CardManager.js
_createSpecialCards(difficulty) {
    if (difficulty.specialCards.bombs) {
        // 폭탄 카드 생성 로직
    }
}
```

### 새로운 카드 테마 추가

1. **테마 정의**:
```javascript
// CardManager.js
const CARD_THEMES = {
    FRUIT: ['🍎', '🍄', '🚀', '💎', '🔑', '✉️'],
    COFFEE: ['☕', '🥐', '🍰', '🥧', '🧁', '🍪'],
    FASHION: ['👗', '👠', '💄', '💍', '👜', '👒']
};
```

2. **테마 선택 UI 추가**:
```javascript
renderThemeSelector() {
    const themes = ['FRUIT', 'COFFEE', 'FASHION'];
    themes.forEach(theme => {
        this._renderThemeButton(theme);
    });
}
```

### 새로운 효과음 추가

1. **SoundManager 수정**:
```javascript
class SoundManager {
    constructor() {
        this.sounds = {
            flip: new Audio('assets/sounds/flip.mp3'),
            match: new Audio('assets/sounds/match.mp3'),
            fail: new Audio('assets/sounds/fail.mp3'),
            complete: new Audio('assets/sounds/complete.mp3')
        };
    }

    playFlip() {
        this.sounds.flip.play();
    }
}
```

2. **이벤트 리스너 등록**:
```javascript
gameManager.on('card:flip', () => {
    soundManager.playFlip();
});
```

---

## 추가 자료

- [API Reference](API_REFERENCE.md)
- [Architecture](ARCHITECTURE.md)
- [User Guide](USER_GUIDE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Design Guide](../DESIGN_GUIDE.md)

---

**Happy Coding! 🎉**
