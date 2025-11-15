/* ====================================
   p5.js 메인 파일
   담당: 윤현준 (렌더링, 클릭 처리, 애니메이션)
   ==================================== */

/**
 * p5.js setup() - 초기 설정
 * 캔버스 생성, 게임 매니저 초기화
 */
function setup() {
    // 캔버스 생성
    createCanvas(CANVAS_CONFIG.width, CANVAS_CONFIG.height);

    // 게임 매니저 초기화
    gameManager = new GameManager();

    // 텍스트 설정
    textFont('Noto Sans KR, sans-serif');

    // TODO (윤현준):
    // - 반응형 캔버스 크기 조정
    // - 이미지/사운드 preload 처리
}

/**
 * p5.js draw() - 매 프레임 실행
 * 게임 상태에 따라 적절한 화면 렌더링
 */
function draw() {
    // 현재 게임 상태에 따라 화면 전환
    switch (gameManager.currentState) {
        case GAME_STATE.START:
            drawStartScreen();
            break;

        case GAME_STATE.DIFFICULTY:
            drawDifficultyScreen();
            break;

        case GAME_STATE.PLAYING:
            drawGameScreen();
            gameManager.updateTimer();
            // TODO (윤현준): 카드 뒤집기 애니메이션 업데이트
            break;

        case GAME_STATE.RESULT:
            drawResultScreen();
            break;
    }
}

/**
 * 마우스 클릭 이벤트
 * TODO (윤현준):
 * - UI 버튼 클릭 처리
 * - 게임 중 카드 클릭 처리
 */
function mouseClicked() {
    // UI 버튼 클릭 처리
    handleUIClick();

    // 게임 중 카드 클릭
    if (gameManager.currentState === GAME_STATE.PLAYING) {
        gameManager.cards.forEach(card => {
            if (card.contains(mouseX, mouseY)) {
                gameManager.handleCardClick(card);
            }
        });
    }
}

/**
 * 마우스 이동 이벤트
 * TODO (윤현준): 호버 효과
 */
function mouseMoved() {
    // TODO: 카드 호버 시 scale 변경
    // if (gameManager.currentState === GAME_STATE.PLAYING) {
    //     gameManager.cards.forEach(card => {
    //         if (card.contains(mouseX, mouseY)) {
    //             card.scale = 1.05;
    //         } else {
    //             card.scale = 1.0;
    //         }
    //     });
    // }
}

/**
 * 창 크기 변경 이벤트
 * TODO (윤현준): 반응형 레이아웃
 */
function windowResized() {
    // TODO: 반응형 캔버스 크기 조정
    // resizeCanvas(windowWidth, windowHeight);
}

/* ====================================
   TODO LIST
   ==================================== */

// 윤현준 (개발):
// ✅ setup() - 캔버스 생성
// ✅ draw() - 화면 전환 로직
// ✅ mouseClicked() - 클릭 처리
// ⬜ 카드 뒤집기 애니메이션 (scale/rotate)
// ⬜ 호버 효과 구현
// ⬜ 짝 성공/실패 시 이펙트
// ⬜ 반응형 레이아웃 조정
// ⬜ 방채민의 게임 로직과 연동 테스트

// 방채민 (개발):
// ✅ Card 클래스 기본 구조
// ✅ GameManager 기본 구조
// ⬜ createCardDeck() - 카드 생성 & 섞기
// ⬜ 그리드 레이아웃 계산
// ⬜ 카드 비교 로직 완성
// ⬜ 타이머 & 점수 시스템 완성
// ⬜ 난이도별 동적 생성 로직

// 손아영 (개발):
// ⬜ 카드 이미지 파일 준비
// ⬜ CARD_THEMES 이미지 경로 연결
// ⬜ 효과음 파일 준비 및 연결
// ⬜ 결과 화면 통계 표시
// ⬜ 다시하기 버튼 기능 구현
// ⬜ 메시지 표시 시스템 (짝 성공/실패)

// 윤현준 (디자인):
// ⬜ 전체 화면 UI 스타일 정의
// ⬜ 난이도별 컬러 테마 적용
// ⬜ 버튼 스타일 개선
// ⬜ 폰트 선택 및 적용

// 방채민 (디자인):
// ⬜ 상단 UI 레이아웃 스케치
// ⬜ 카드 간격/가독성 조정
// ⬜ 와이어프레임 제작

// 손아영 (디자인):
// ⬜ 카드 일러스트/아이콘 제작
// ⬜ 시작/결과 화면 시각 요소
// ⬜ 배경 패턴 디자인
// ⬜ 축하 애니메이션 아이디어
// ⬜ 효과음/배경음악 선택
