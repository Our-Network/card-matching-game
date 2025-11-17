# API Reference

Card Matching Game의 전체 클래스 및 함수 API 레퍼런스입니다.

## 목차
- [Core Layer](#core-layer)
  - [Card](#card)
  - [GameState](#gamestate)
- [Logic Layer](#logic-layer)
  - [CardManager](#cardmanager)
  - [GameManager](#gamemanager)
- [Rendering Layer](#rendering-layer)
  - [CardRenderer](#cardrenderer)
  - [UIRenderer](#uirenderer)
  - [ParticleSystem](#particlesystem)
- [Utils Layer](#utils-layer)
  - [EventEmitter](#eventemitter)
  - [Logger](#logger)
  - [ArrayUtils](#arrayutils)
  - [GridCalculator](#gridcalculator)

---

## Core Layer

### Card

카드의 데이터 모델 및 상태를 관리하는 클래스입니다.

**파일 위치**: `js/core/Card.js`

#### 생성자

```javascript
new Card(id, x, y, imagePath)
```

**매개변수**:
- `id` (number): 카드 식별자 (같은 ID = 짝)
- `x` (number): 화면 x 좌표
- `y` (number): 화면 y 좌표
- `imagePath` (string): 카드 이미지 경로

**예제**:
```javascript
const card = new Card(1, 100, 200, 'assets/images/cards/1.webp');
```

#### 속성 (Getters)

##### `card.id`
- **타입**: `number`
- **설명**: 카드의 고유 식별자
- **읽기 전용**

##### `card.x`, `card.y`
- **타입**: `number`
- **설명**: 카드의 화면 좌표

##### `card.isFlipped`
- **타입**: `boolean`
- **설명**: 카드가 뒤집힌 상태인지 여부

##### `card.isMatched`
- **타입**: `boolean`
- **설명**: 카드가 매칭된 상태인지 여부

##### `card.isAnimating`
- **타입**: `boolean`
- **설명**: 카드가 애니메이션 중인지 여부

##### `card.flipCount`
- **타입**: `number`
- **설명**: 카드가 뒤집힌 총 횟수

#### 메서드

##### `card.setPosition(x, y)`

카드의 위치를 설정합니다.

**매개변수**:
- `x` (number): x 좌표
- `y` (number): y 좌표

**예제**:
```javascript
card.setPosition(150, 250);
```

##### `card.canFlip()`

카드가 뒤집기 가능한 상태인지 확인합니다.

**반환값**: `boolean` - 뒤집기 가능 여부

**예제**:
```javascript
if (card.canFlip()) {
    card.flip();
}
```

##### `card.flip()`

카드를 뒤집습니다.

**예외**:
- 이미 매칭된 카드를 뒤집으려 하면 `Error` 발생
- 애니메이션 중인 카드를 뒤집으려 하면 `Error` 발생

**예제**:
```javascript
try {
    card.flip();
} catch (error) {
    console.error('Cannot flip card:', error);
}
```

##### `card.setFlipped(flipped)`

카드의 뒤집힌 상태를 강제로 설정합니다.

**매개변수**:
- `flipped` (boolean): 뒤집힌 상태

##### `card.setMatched()`

카드를 매칭 완료 상태로 설정합니다.

##### `card.contains(mx, my)`

주어진 마우스 좌표가 카드 영역 내에 있는지 확인합니다.

**매개변수**:
- `mx` (number): 마우스 x 좌표
- `my` (number): 마우스 y 좌표

**반환값**: `boolean`

**예제**:
```javascript
if (card.contains(mouseX, mouseY)) {
    console.log('Card clicked!');
}
```

##### `card.isMatchWith(other)`

다른 카드와 짝인지 확인합니다.

**매개변수**:
- `other` (Card): 비교할 카드

**반환값**: `boolean`

**예제**:
```javascript
if (card1.isMatchWith(card2)) {
    console.log('Match!');
}
```

##### `card.reset()`

카드 상태를 초기화합니다.

##### `card.toJSON()`

카드 상태를 직렬화합니다.

**반환값**: `Object`

---

### GameState

게임의 전체 상태를 관리하는 클래스입니다.

**파일 위치**: `js/core/GameState.js`

#### 생성자

```javascript
new GameState(config)
```

**매개변수**:
- `config` (Object, optional): 초기 설정 객체

#### 주요 속성

##### Phase Management

- `state.phase`: 현재 게임 페이즈 (`'start'`, `'difficulty'`, `'preview'`, `'playing'`, `'result'`)
- `state.isPlaying()`: 게임 진행 중 여부
- `state.isPreview()`: 미리보기 상태 여부
- `state.isGameOver()`: 게임 종료 여부

##### Difficulty

- `state.difficulty`: 현재 난이도 객체
- `state.totalPairs`: 전체 카드 쌍 개수

##### Hearts

- `state.hearts`: 현재 하트 개수
- `state.maxHearts`: 최대 하트 개수
- `state.isHeartsEmpty()`: 하트가 0개인지 확인

##### Score

- `state.score`: 최종 점수
- `state.baseScore`: 기본 점수
- `state.comboBonus`: 콤보 보너스 점수
- `state.timeBonus`: 시간 보너스 점수

##### Time

- `state.timeRemaining`: 남은 시간(초)
- `state.timeLimitSeconds`: 제한 시간(초)
- `state.getElapsedSeconds()`: 경과 시간(초)
- `state.isTimeUp()`: 시간 종료 여부

##### Statistics

- `state.attempts`: 시도 횟수
- `state.successCount`: 성공 횟수
- `state.failCount`: 실패 횟수
- `state.combo`: 현재 콤보
- `state.maxCombo`: 최대 콤보
- `state.getAccuracy()`: 정확도 (0-100)

#### 주요 메서드

##### `state.setDifficulty(difficulty)`

난이도를 설정합니다.

**매개변수**:
- `difficulty` (Object): 난이도 설정 객체

**예제**:
```javascript
state.setDifficulty(DIFFICULTY.EASY);
```

##### `state.startGame()`

게임을 시작합니다.

##### `state.recordMatch(points)`

매칭 성공을 기록합니다.

**매개변수**:
- `points` (number): 획득 점수

##### `state.recordMismatch(timePenalty)`

매칭 실패를 기록합니다.

**매개변수**:
- `timePenalty` (number): 시간 페널티(초)

##### `state.getResultStats()`

게임 결과 통계를 반환합니다.

**반환값**: `Object`

**예제**:
```javascript
const stats = state.getResultStats();
console.log('Score:', stats.score);
console.log('Accuracy:', stats.accuracy);
console.log('Max Combo:', stats.maxCombo);
```

---

## Logic Layer

### CardManager

카드 생성 및 관리를 담당하는 클래스입니다.

**파일 위치**: `js/logic/CardManager.js`

#### 생성자

```javascript
new CardManager(options)
```

**매개변수**:
- `options` (Object, optional): 추가 옵션

#### 주요 메서드

##### `cardManager.createDeck(difficulty, theme)`

카드 덱을 생성합니다.

**매개변수**:
- `difficulty` (Object): 난이도 설정
- `theme` (string): 카드 테마 ('FRUIT', 'COFFEE', etc.)

**반환값**: `Card[]` - 카드 배열

**예제**:
```javascript
const cards = cardManager.createDeck(DIFFICULTY.EASY, 'FRUIT');
```

##### `cardManager.findCardAt(cards, x, y)`

특정 좌표에 있는 카드를 찾습니다.

**매개변수**:
- `cards` (Card[]): 카드 배열
- `x` (number): x 좌표
- `y` (number): y 좌표

**반환값**: `Card | null`

**예제**:
```javascript
const clickedCard = cardManager.findCardAt(cards, mouseX, mouseY);
if (clickedCard) {
    console.log('Found card:', clickedCard.id);
}
```

##### `cardManager.resetAllCards(cards)`

모든 카드를 초기화합니다.

**매개변수**:
- `cards` (Card[]): 카드 배열

---

### GameManager

게임의 핵심 비즈니스 로직을 담당하는 클래스입니다.

**파일 위치**: `js/logic/GameManager.js`

**상속**: `EventEmitter`

#### 생성자

```javascript
new GameManager(gameState, cardManager, options)
```

**매개변수**:
- `gameState` (GameState): 게임 상태 객체
- `cardManager` (CardManager): 카드 관리자
- `options` (Object, optional): 추가 옵션

**예제**:
```javascript
const gameManager = new GameManager(gameState, cardManager, {
    autoCleanup: true,
    errorRecovery: true
});
```

#### 이벤트

GameManager는 다음 이벤트를 발생시킵니다:

##### Game Events

- `game:init`: 게임 초기화 시
- `game:preview:start`: 미리보기 시작
- `game:preview:end`: 미리보기 종료
- `game:playing:start`: 게임 시작
- `game:complete`: 게임 클리어
- `game:over`: 게임 오버
- `game:reset`: 게임 리셋

##### Card Events

- `card:flip`: 카드 뒤집기
- `match:success`: 매칭 성공
- `match:fail`: 매칭 실패

##### Timer Events

- `timer:update`: 타이머 업데이트

##### Heart Events

- `heart:lost`: 하트 소진

**이벤트 리스너 예제**:
```javascript
gameManager.on('game:init', ({ difficulty, cardCount }) => {
    console.log(`Game started: ${difficulty.name}, ${cardCount} cards`);
});

gameManager.on('match:success', ({ points, combo }) => {
    console.log(`Match! +${points} points (Combo x${combo})`);
});

gameManager.on('game:complete', (stats) => {
    console.log('Game completed!', stats);
});
```

#### 주요 메서드

##### `gameManager.startGame(difficulty, theme)`

게임을 시작합니다.

**매개변수**:
- `difficulty` (Object): 난이도 설정
- `theme` (string, optional): 카드 테마 (기본값: 'FRUIT')

**예외**:
- 유효하지 않은 난이도인 경우 `Error` 발생

**예제**:
```javascript
gameManager.startGame(DIFFICULTY.MEDIUM, 'FRUIT');
```

##### `gameManager.handleClick(x, y)`

카드 클릭을 처리합니다.

**매개변수**:
- `x` (number): 마우스 x 좌표
- `y` (number): 마우스 y 좌표

**반환값**: `boolean` - 클릭이 처리되었는지 여부

**예제**:
```javascript
function mousePressed() {
    const handled = gameManager.handleClick(mouseX, mouseY);
    if (!handled) {
        console.log('Click not handled');
    }
}
```

##### `gameManager.resetGame()`

게임을 리셋합니다.

##### `gameManager.getGameInfo()`

현재 게임 정보를 반환합니다.

**반환값**: `Object`

**예제**:
```javascript
const info = gameManager.getGameInfo();
console.log('Score:', info.score);
console.log('Hearts:', info.hearts);
console.log('Remaining Pairs:', info.remainingPairs);
```

##### `gameManager.destroy()`

GameManager 인스턴스를 소멸시키고 리소스를 정리합니다.

---

## Rendering Layer

### CardRenderer

카드 렌더링을 담당하는 클래스입니다.

**파일 위치**: `js/rendering/CardRenderer.js`

#### 주요 메서드

##### `cardRenderer.render(cards)`

모든 카드를 렌더링합니다.

**매개변수**:
- `cards` (Card[]): 카드 배열

##### `cardRenderer.animateFlip(card, duration, toFront)`

카드 뒤집기 애니메이션을 실행합니다.

**매개변수**:
- `card` (Card): 대상 카드
- `duration` (number): 애니메이션 시간 (ms)
- `toFront` (boolean): 앞면으로 뒤집을지 여부

**예제**:
```javascript
// 카드를 앞면으로 뒤집기 (300ms)
cardRenderer.animateFlip(card, 300, true);

// 카드를 뒷면으로 뒤집기 (300ms)
cardRenderer.animateFlip(card, 300, false);
```

##### `cardRenderer.animateMatch(card, duration)`

매칭 성공 애니메이션을 실행합니다.

**매개변수**:
- `card` (Card): 대상 카드
- `duration` (number): 애니메이션 시간 (ms)

##### `cardRenderer.animateMismatch(card, duration)`

매칭 실패 애니메이션을 실행합니다.

**매개변수**:
- `card` (Card): 대상 카드
- `duration` (number): 애니메이션 시간 (ms)

---

### UIRenderer

UI 화면 렌더링을 담당하는 클래스입니다.

**파일 위치**: `js/rendering/UIRenderer.js`

#### 주요 메서드

##### `uiRenderer.renderStartScreen()`

시작 화면을 렌더링합니다.

##### `uiRenderer.renderDifficultyScreen()`

난이도 선택 화면을 렌더링합니다.

##### `uiRenderer.renderGameScreen(state)`

게임 화면을 렌더링합니다.

**매개변수**:
- `state` (GameState): 게임 상태 객체

##### `uiRenderer.renderResultScreen(state)`

결과 화면을 렌더링합니다.

**매개변수**:
- `state` (GameState): 게임 상태 객체

---

### ParticleSystem

파티클 효과를 담당하는 클래스입니다.

**파일 위치**: `js/rendering/ParticleSystem.js`

#### 주요 메서드

##### `particleSystem.createMatchParticles(x, y)`

매칭 성공 시 파티클 효과를 생성합니다.

**매개변수**:
- `x` (number): 파티클 발생 x 좌표
- `y` (number): 파티클 발생 y 좌표

##### `particleSystem.createGameClearParticles()`

게임 클리어 시 파티클 효과를 생성합니다.

##### `particleSystem.update()`

모든 파티클을 업데이트합니다.

##### `particleSystem.render()`

모든 파티클을 렌더링합니다.

---

## Utils Layer

### EventEmitter

이벤트 기반 통신을 위한 클래스입니다.

**파일 위치**: `js/utils/EventEmitter.js`

#### 주요 메서드

##### `emitter.on(event, listener)`

이벤트 리스너를 등록합니다.

**매개변수**:
- `event` (string): 이벤트 이름
- `listener` (Function): 리스너 함수

**예제**:
```javascript
emitter.on('score:update', (score) => {
    console.log('Score:', score);
});
```

##### `emitter.emit(event, ...args)`

이벤트를 발생시킵니다.

**매개변수**:
- `event` (string): 이벤트 이름
- `...args`: 리스너에게 전달할 인수

**예제**:
```javascript
emitter.emit('score:update', 100);
```

##### `emitter.off(event, listener)`

이벤트 리스너를 제거합니다.

##### `emitter.removeAllListeners()`

모든 이벤트 리스너를 제거합니다.

---

### Logger

로깅 유틸리티 클래스입니다.

**파일 위치**: `js/utils/Logger.js`

#### 주요 메서드

##### `logger.info(message, ...args)`
##### `logger.warn(message, ...args)`
##### `logger.error(message, ...args)`
##### `logger.debug(message, ...args)`

**예제**:
```javascript
logger.info('Game started', { difficulty: 'EASY' });
logger.error('Error occurred:', error);
logger.debug('Card state:', card.toJSON());
```

---

### ArrayUtils

배열 처리 유틸리티 함수 모음입니다.

**파일 위치**: `js/utils/ArrayUtils.js`

#### 주요 함수

##### `ArrayUtils.shuffle(array)`

배열을 무작위로 섞습니다 (Fisher-Yates 알고리즘).

**매개변수**:
- `array` (Array): 섞을 배열

**반환값**: `Array` - 섞인 배열

**예제**:
```javascript
const shuffled = ArrayUtils.shuffle([1, 2, 3, 4, 5]);
```

---

### GridCalculator

그리드 레이아웃 계산 유틸리티입니다.

**파일 위치**: `js/utils/GridCalculator.js`

#### 주요 함수

##### `GridCalculator.calculateGrid(cardCount, cols, rows, cardWidth, cardHeight, margin)`

카드 그리드 위치를 계산합니다.

**매개변수**:
- `cardCount` (number): 카드 개수
- `cols` (number): 열 개수
- `rows` (number): 행 개수
- `cardWidth` (number): 카드 너비
- `cardHeight` (number): 카드 높이
- `margin` (number): 카드 간격

**반환값**: `Object[]` - `{x, y}` 좌표 배열

**예제**:
```javascript
const positions = GridCalculator.calculateGrid(
    16,  // 16장
    4,   // 4열
    4,   // 4행
    110, // 너비
    110, // 높이
    18   // 간격
);
```

---

## 전역 설정 객체

### DIFFICULTY

난이도 설정을 정의한 객체입니다.

**파일 위치**: `js/config.js`

**속성**:
- `DIFFICULTY.EASY`: 하 난이도
- `DIFFICULTY.MEDIUM`: 중 난이도
- `DIFFICULTY.HARD`: 상 난이도

**난이도 객체 구조**:
```javascript
{
    name: '하',           // 난이도 이름
    pairs: 4,            // 카드 쌍 개수
    timeLimit: 180,      // 제한 시간 (초)
    gridCols: 4,         // 그리드 열
    gridRows: 2,         // 그리드 행
    pointsPerMatch: 10,  // 매칭 성공 점수
    timePenalty: 5,      // 실패 시 시간 페널티 (초)
    previewTime: 5000,   // 미리보기 시간 (ms)
    hearts: 5,           // 하트 개수
    specialCards: {}     // 특수 카드 설정
}
```

### CARD_CONFIG

카드 설정을 정의한 객체입니다.

**파일 위치**: `js/config.js`

```javascript
{
    width: 110,             // 카드 너비
    height: 110,            // 카드 높이
    cornerRadius: 20,       // 둥근 모서리
    margin: 18,             // 카드 간격
    backColor: '#FFB4D1',   // 뒷면 색상
    flipDuration: 300,      // 뒤집기 시간 (ms)
    matchDelay: 500,        // 매칭 체크 지연 (ms)
    mismatchDelay: 1000     // 실패 시 지연 (ms)
}
```

### GAME_STATE

게임 페이즈 상수입니다.

**파일 위치**: `js/config.js`

```javascript
{
    START: 'start',         // 시작 화면
    DIFFICULTY: 'difficulty', // 난이도 선택
    PREVIEW: 'preview',     // 미리보기
    PLAYING: 'playing',     // 게임 중
    RESULT: 'result'        // 결과 화면
}
```

---

## 디버그 함수

개발 및 디버깅을 위한 전역 함수들입니다.

### `debugState()`

현재 게임 상태를 콘솔에 출력합니다.

### `debugCards()`

모든 카드 정보를 콘솔에 출력합니다.

### `debugWin()`

강제로 게임을 클리어합니다 (테스트용).

### `debugSetTime(seconds)`

남은 시간을 설정합니다 (테스트용).

**예제**:
```javascript
// 브라우저 콘솔에서 사용
debugState();        // 게임 상태 확인
debugCards();        // 카드 정보 확인
debugWin();          // 강제 게임 클리어
debugSetTime(30);    // 남은 시간 30초로 설정
```

---

## 라이브러리 의존성

### p5.js

**버전**: 1.7.0
**CDN**: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js`

**주요 사용 함수**:
- `setup()`: 초기화
- `draw()`: 렌더링 루프
- `mousePressed()`: 마우스 클릭 이벤트
- `createCanvas()`: 캔버스 생성
- `fill()`, `stroke()`, `rect()`, `ellipse()` 등: 그래픽 함수

---

## 타입 정의 (TypeScript 스타일)

```typescript
// Card 타입
interface Card {
    id: number;
    x: number;
    y: number;
    imagePath: string;
    isFlipped: boolean;
    isMatched: boolean;
    isAnimating: boolean;
    flipCount: number;
}

// Difficulty 타입
interface Difficulty {
    name: string;
    pairs: number;
    timeLimit: number;
    gridCols: number;
    gridRows: number;
    pointsPerMatch: number;
    timePenalty: number;
    previewTime: number;
    hearts: number;
    specialCards: {
        bonusPairs?: number;
        bombs?: number;
    };
}

// GameState 결과 통계 타입
interface ResultStats {
    isWin: boolean;
    gameOverReason: 'complete' | 'hearts' | 'time';
    score: number;
    baseScore: number;
    comboBonus: number;
    timeBonus: number;
    heartsRemaining: number;
    maxHearts: number;
    elapsedTime: number;
    timeRemaining: number;
    attempts: number;
    successCount: number;
    failCount: number;
    accuracy: number;
    maxCombo: number;
    matchedPairs: number;
    totalPairs: number;
    difficulty: string;
}
```

---

## 추가 참고 자료

- [프로젝트 개요](../PROJECT_OVERVIEW.md)
- [디자인 가이드](../DESIGN_GUIDE.md)
- [사용자 가이드](USER_GUIDE.md)
- [개발자 가이드](DEVELOPER_GUIDE.md)
