# Contributing Guide

Card Matching Game 프로젝트에 기여하는 방법을 안내합니다. 모든 기여를 환영합니다!

## 목차
- [행동 강령](#행동-강령)
- [시작하기](#시작하기)
- [기여 방법](#기여-방법)
- [개발 워크플로우](#개발-워크플로우)
- [코드 스타일 가이드](#코드-스타일-가이드)
- [커밋 규칙](#커밋-규칙)
- [Pull Request 가이드](#pull-request-가이드)
- [이슈 리포팅](#이슈-리포팅)

---

## 행동 강령

### 우리의 약속

모두에게 열린 환경을 만들기 위해 우리는 다음을 약속합니다:

- 나이, 신체적 특징, 장애, 민족성, 성별, 경험 수준, 교육, 사회경제적 지위, 국적, 외모, 인종, 종교, 정치적 성향에 관계없이 모든 사람을 환영합니다
- 존중하고 배려하는 언어를 사용합니다
- 다른 관점과 경험을 존중합니다
- 건설적인 비판을 받아들이고 제공합니다
- 커뮤니티 최선을 위한 행동을 합니다

### 금지 행동

다음 행동은 허용되지 않습니다:

- 성적 언어나 이미지 사용, 원치 않는 성적 관심
- 트롤링, 모욕적/비하적 코멘트, 개인 또는 정치적 공격
- 공개적 또는 사적 괴롭힘
- 명시적 허가 없이 타인의 개인정보 공개
- 전문적 환경에서 부적절한 기타 행위

---

## 시작하기

### 1. 저장소 포크

GitHub에서 저장소를 포크합니다:

```
https://github.com/your-organization/card-matching-game
→ Fork 버튼 클릭
```

### 2. 로컬에 클론

```bash
git clone https://github.com/your-username/card-matching-game.git
cd card-matching-game
```

### 3. Upstream 추가

```bash
git remote add upstream https://github.com/your-organization/card-matching-game.git
```

### 4. 개발 환경 설정

```bash
# 로컬 서버 실행
python -m http.server 8000

# 또는
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

---

## 기여 방법

### 버그 수정

1. 이슈를 검색하여 이미 보고되지 않았는지 확인
2. 새로운 이슈 생성 (버그 리포트 템플릿 사용)
3. 수정 작업 진행
4. Pull Request 생성

### 새로운 기능 추가

1. 이슈를 생성하여 기능 제안
2. 토론 및 피드백 받기
3. 승인 후 작업 시작
4. Pull Request 생성

### 문서 개선

- 오타 수정
- 설명 추가/개선
- 예제 코드 추가
- 번역 (다국어 지원)

### 디자인 개선

- UI/UX 개선 제안
- 새로운 테마 추가
- 애니메이션 개선

---

## 개발 워크플로우

### 1. 최신 코드 동기화

작업 시작 전 항상 최신 코드로 동기화:

```bash
git checkout main
git pull upstream main
git push origin main
```

### 2. Feature 브랜치 생성

```bash
# Feature 브랜치
git checkout -b feature/add-new-theme

# Bugfix 브랜치
git checkout -b bugfix/fix-timer-sync

# Documentation 브랜치
git checkout -b docs/update-api-reference
```

**브랜치 명명 규칙**:
- `feature/<feature-name>`: 새로운 기능
- `bugfix/<bug-name>`: 버그 수정
- `docs/<doc-name>`: 문서 작업
- `refactor/<refactor-name>`: 리팩토링
- `test/<test-name>`: 테스트 추가

### 3. 코드 작성

- [코드 스타일 가이드](#코드-스타일-가이드) 준수
- 주석 작성 (JSDoc 스타일)
- 테스트 작성 (가능한 경우)

### 4. 변경사항 커밋

```bash
# 변경사항 확인
git status
git diff

# 스테이징
git add <파일명>

# 커밋
git commit -m "feat: 새로운 카드 테마 추가"
```

[커밋 규칙](#커밋-규칙) 참조

### 5. 푸시 및 Pull Request

```bash
# 푸시
git push origin feature/add-new-theme

# GitHub에서 Pull Request 생성
```

[Pull Request 가이드](#pull-request-가이드) 참조

---

## 코드 스타일 가이드

### JavaScript

#### 네이밍

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
    START: 'start'
};
```

**Private**: `_` 접두사
```javascript
class Card {
    constructor() {
        this._id = 0;
    }

    _flipCard() { }
}
```

#### 들여쓰기

4 스페이스 사용 (탭 금지)

```javascript
function example() {
    if (condition) {
        // 4 스페이스
        doSomething();
    }
}
```

#### 세미콜론

항상 사용

```javascript
const value = 10;
const array = [1, 2, 3];
```

#### 따옴표

싱글 쿼트(`'`) 사용, 템플릿 리터럴은 백틱(``` ` ```)

```javascript
const message = 'Hello World';
const template = `Score: ${score}`;
```

#### 주석

**JSDoc 스타일** 사용:

```javascript
/**
 * 카드를 뒤집습니다
 * @param {Card} card - 대상 카드
 * @param {number} duration - 애니메이션 시간 (ms)
 * @returns {void}
 */
function flipCard(card, duration) {
    // 구현...
}
```

**인라인 주석**:
```javascript
// 단일 라인 주석
const value = 10;

/*
 * 여러 줄 주석
 * 설명이 길 때 사용
 */
const complex = { };
```

#### 에러 처리

```javascript
try {
    gameManager.startGame(difficulty);
} catch (error) {
    logger.error('Failed to start game:', error);
    // 사용자에게 적절한 피드백 제공
    alert('게임을 시작할 수 없습니다.');
}
```

### HTML

#### 들여쓰기

4 스페이스

```html
<div class="container">
    <button class="btn">
        시작하기
    </button>
</div>
```

#### 속성 순서

`class`, `id`, `name`, `data-*`, `src`, `for`, `type`, `href`

```html
<button class="btn btn-primary" id="start-btn" type="button">
    시작
</button>
```

### CSS

#### 들여쓰기

4 스페이스

```css
.card-container {
    width: 110px;
    height: 110px;
}
```

#### 클래스 네이밍

kebab-case 사용

```css
.card-container { }
.btn-primary { }
.game-screen { }
```

#### 속성 순서

위치 → 박스 모델 → 타이포그래피 → 시각 효과

```css
.element {
    /* 위치 */
    position: absolute;
    top: 0;
    left: 0;

    /* 박스 모델 */
    width: 100px;
    height: 100px;
    padding: 10px;
    margin: 5px;

    /* 타이포그래피 */
    font-size: 16px;
    line-height: 1.5;

    /* 시각 효과 */
    background-color: #fff;
    border-radius: 10px;
}
```

---

## 커밋 규칙

### Conventional Commits

다음 형식을 따릅니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type

| 타입 | 설명 | 예제 |
|------|------|------|
| `feat` | 새로운 기능 | `feat: 재앙 난이도 추가` |
| `fix` | 버그 수정 | `fix: 타이머 동기화 문제 해결` |
| `docs` | 문서 변경 | `docs: API 레퍼런스 업데이트` |
| `style` | 코드 포맷팅 | `style: 들여쓰기 수정` |
| `refactor` | 리팩토링 | `refactor: GameManager 개선` |
| `test` | 테스트 추가 | `test: GameState 단위 테스트` |
| `chore` | 빌드/도구 | `chore: package.json 업데이트` |
| `perf` | 성능 개선 | `perf: 렌더링 최적화` |

#### Scope (선택)

변경 범위를 나타냅니다:

- `core`: Core 레이어 (Card, GameState)
- `logic`: Logic 레이어 (GameManager, CardManager)
- `rendering`: Rendering 레이어 (UIRenderer, CardRenderer)
- `utils`: Utils 레이어
- `config`: 설정 파일

**예제**:
```
feat(core): Card 클래스에 특수 카드 타입 추가
fix(rendering): 카드 애니메이션 버그 수정
docs(api): GameManager 문서 업데이트
```

#### Subject

- 50자 이내
- 명령형 사용 ("추가한다" ❌ → "추가" ✅)
- 첫 글자 소문자
- 마침표 없음

**좋은 예제**:
```
feat: 새로운 카드 테마 추가
fix: 타이머 동기화 문제 해결
docs: README에 설치 가이드 추가
```

**나쁜 예제**:
```
feat: 새로운 카드 테마를 추가했습니다.  ❌ (명령형 아님, 마침표 있음)
Fix: Bug fix                            ❌ (Type 대문자, 모호한 설명)
feature: add new card theme             ❌ (영어, 너무 간략)
```

#### Body (선택)

- 변경 이유 설명
- 이전 동작과 새 동작 비교
- 72자마다 줄바꿈

**예제**:
```
feat: 재앙 난이도 추가

기존 3개 난이도(하, 중, 상)에서 4개로 확장.
재앙 난이도는 3장 매칭 시스템 사용.

- 12쌍 (36장)
- 제한 시간 75초
- 하트 25개
```

#### Footer (선택)

- Breaking changes: `BREAKING CHANGE:`
- 이슈 참조: `Closes #123`

**예제**:
```
feat: GameState API 변경

recordMatch 메서드 시그니처 변경

BREAKING CHANGE: recordMatch(card) → recordMatch(points)
Closes #45, #67
```

---

## Pull Request 가이드

### PR 생성 전 체크리스트

- [ ] 최신 `main` 브랜치와 동기화
- [ ] 모든 테스트 통과
- [ ] 린터 통과
- [ ] 변경사항 테스트 완료
- [ ] 문서 업데이트 (필요 시)
- [ ] 커밋 메시지 규칙 준수

### PR 제목

커밋 메시지와 동일한 규칙:

```
feat: 재앙 난이도 추가
fix: 타이머 동기화 문제 해결
docs: API 레퍼런스 업데이트
```

### PR 설명 템플릿

```markdown
## 개요
<!-- 변경사항의 목적과 맥락을 간단히 설명 -->

이 PR은 재앙 난이도를 추가합니다.

## 변경 사항
<!-- 주요 변경사항을 나열 -->

- [ ] config.js에 DISASTER 난이도 설정 추가
- [ ] UIRenderer에 난이도 버튼 추가
- [ ] 3장 매칭 시스템 구현

## 테스트 방법
<!-- 변경사항을 테스트하는 방법 -->

1. 게임 시작
2. 재앙 난이도 선택
3. 3장 매칭 시스템 동작 확인

## 스크린샷
<!-- UI 변경이 있다면 스크린샷 첨부 -->

![재앙 난이도](screenshots/disaster-mode.png)

## 체크리스트
<!-- 완료한 항목을 체크 -->

- [x] 코드 스타일 가이드 준수
- [x] 테스트 작성 및 통과
- [x] 문서 업데이트
- [x] 자체 리뷰 완료

## 관련 이슈
<!-- 관련된 이슈 번호 -->

Closes #42
Related to #38
```

### PR 리뷰 프로세스

1. **PR 생성**: 위 템플릿에 따라 작성
2. **자동 체크**: CI/CD 자동 테스트 (예정)
3. **코드 리뷰**: 메인테이너가 코드 리뷰
4. **피드백 반영**: 리뷰어 코멘트에 대응
5. **승인 및 머지**: 승인 후 `main` 브랜치로 머지

### 리뷰 중 수정

```bash
# 같은 브랜치에서 수정
git add <파일명>
git commit -m "fix: 리뷰 피드백 반영"
git push origin feature/add-new-theme

# PR이 자동으로 업데이트됩니다
```

---

## 이슈 리포팅

### 버그 리포트

GitHub Issues에서 "Bug Report" 템플릿 사용:

```markdown
## 버그 설명
타이머가 페이지 숨김 후 동기화되지 않습니다.

## 재현 단계
1. 게임 시작
2. 다른 탭으로 이동 (10초 대기)
3. 게임 탭으로 돌아옴
4. 타이머가 멈춰 있음

## 예상 동작
타이머가 계속 진행되어야 합니다.

## 실제 동작
타이머가 멈춰 있습니다.

## 환경
- OS: macOS 14.0
- Browser: Chrome 120.0
- Version: 1.0.0

## 스크린샷
![타이머 버그](screenshots/timer-bug.png)

## 추가 정보
콘솔 에러:
```
TypeError: Cannot read property 'getElapsedSeconds' of null
```
```

### 기능 제안

GitHub Issues에서 "Feature Request" 템플릿 사용:

```markdown
## 기능 설명
카드 테마를 사용자가 선택할 수 있는 기능을 추가하고 싶습니다.

## 동기
현재는 과일 테마만 사용 가능합니다. 다양한 테마를 제공하면 사용자 경험이 향상될 것입니다.

## 제안 해결책
난이도 선택 화면에서 테마 선택 버튼을 추가합니다:
- 과일 테마
- 커피 테마
- 패션 테마

## 대안
설정 화면에서 테마를 변경하는 방법도 고려할 수 있습니다.

## 추가 정보
![테마 선택 목업](mockups/theme-selector.png)
```

### 질문

GitHub Discussions 사용:

```markdown
## 질문
새로운 애니메이션을 추가하려면 어떻게 해야 하나요?

## 맥락
카드 매칭 성공 시 별 애니메이션을 추가하고 싶습니다.

## 시도한 것
CardRenderer 클래스를 살펴봤지만 어디에 추가해야 할지 모르겠습니다.
```

---

## 기여자 인정

모든 기여자는 README의 "Contributors" 섹션에 추가됩니다.

### 기여 유형

- 💻 코드
- 📖 문서
- 🎨 디자인
- 🐛 버그 리포트
- 💡 아이디어 제안
- 🤔 질문에 답변

---

## 커뮤니티

### GitHub Discussions

- 💬 일반 토론
- 💡 아이디어 제안
- 🙏 도움 요청
- 📢 공지사항

### 연락처

- **GitHub Issues**: 버그 리포트 및 기능 제안
- **GitHub Discussions**: 일반적인 질문 및 토론
- **Email**: dev@example.com (긴급한 경우)

---

## 라이선스

이 프로젝트에 기여하면 [MIT License](../LICENSE)에 동의하는 것으로 간주됩니다.

---

**감사합니다! 🎉**

여러분의 기여가 Card Matching Game을 더 나은 프로젝트로 만듭니다.
