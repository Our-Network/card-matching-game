/* ====================================
   UI 관리 및 화면 전환
   담당: 윤현준 (화면 전환, UI 구현)
        손아영 (UI 텍스트/메시지 출력, 결과 화면)
   ==================================== */

/**
 * 시작 화면 표시
 * TODO (윤현준):
 * - 게임 제목
 * - 설명 텍스트
 * - 시작 버튼
 */
function drawStartScreen() {
    background(220);

    // 제목
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(64);
    text('메모리 카드 게임', width / 2, height / 3);

    // 설명
    textSize(24);
    text('같은 그림의 카드 쌍을 찾으세요!', width / 2, height / 2);

    // 시작 버튼
    drawButton(width / 2 - 100, height * 2 / 3, 200, 60, '시작하기');

    // TODO (윤현준): 호버 효과, 버튼 클릭 처리
}

/**
 * 난이도 선택 화면
 * TODO (윤현준):
 * - 난이도 버튼 4개 (하/중/상/지옥)
 * - 각 난이도별 색상 테마
 * - 난이도 설명 미리보기
 */
function drawDifficultyScreen() {
    background(240);

    // 제목
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text('난이도 선택', width / 2, 100);

    // 난이도 버튼들
    const difficulties = [
        { key: 'EASY', label: '하', y: 200 },
        { key: 'MEDIUM', label: '중', y: 300 },
        { key: 'HARD', label: '상', y: 400 },
        { key: 'HELL', label: '지옥', y: 500 }
    ];

    difficulties.forEach(diff => {
        const config = DIFFICULTY[diff.key];
        drawDifficultyButton(
            width / 2 - 150,
            diff.y,
            300,
            80,
            diff.label,
            config
        );
    });

    // TODO (윤현준):
    // - 호버 시 난이도 상세 정보 표시
    // - 클릭 시 게임 시작
}

/**
 * 게임 플레이 화면
 * TODO (윤현준):
 * - 상단 UI (타이머, 점수, 남은 쌍)
 * - 카드 그리드
 * - 진행 상황 표시
 */
function drawGameScreen() {
    // 배경색 (난이도별)
    if (gameManager.selectedDifficulty) {
        background(gameManager.selectedDifficulty.color.bg);
    } else {
        background(255);
    }

    // 상단 UI 바
    drawGameUI();

    // 카드 표시
    gameManager.cards.forEach(card => {
        card.display();
    });

    // TODO (손아영): 메시지 표시
    // - "짝 성공!" / "다시 도전!"
    // - 콤보 표시
}

/**
 * 상단 게임 UI (타이머, 점수 등)
 * TODO (윤현준): 레이아웃 디자인
 */
function drawGameUI() {
    fill(0);
    textAlign(LEFT, TOP);
    textSize(24);

    // 타이머
    const minutes = floor(gameManager.timeRemaining / 60);
    const seconds = gameManager.timeRemaining % 60;
    const timeStr = `${nf(minutes, 2)}:${nf(seconds, 2)}`;
    text(`⏱️ ${timeStr}`, 20, 20);

    // 점수
    text(`🎯 점수: ${gameManager.score}`, 20, 60);

    // 남은 쌍
    text(`📦 남은 쌍: ${gameManager.getRemainingPairs()}`, 20, 100);

    // 시도 횟수
    text(`🔄 시도: ${gameManager.attempts}`, 20, 140);

    // TODO (윤현준): 더 나은 레이아웃 디자인
}

/**
 * 결과 화면
 * TODO (손아영):
 * - 점수, 시간, 시도 횟수 표시
 * - 성공/실패 메시지
 * - 다시하기 버튼
 */
function drawResultScreen() {
    background(240);

    const stats = gameManager.getStats();
    const isWin = gameManager.matchedPairs === gameManager.selectedDifficulty.pairs;

    // 결과 메시지
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(isWin ? '🎉 게임 클리어!' : '⏰ 시간 초과', width / 2, 100);

    // 통계 표시
    textSize(32);
    text(`최종 점수: ${stats.score}`, width / 2, 200);
    text(`소요 시간: ${formatTime(stats.time)}`, width / 2, 250);
    text(`시도 횟수: ${stats.attempts}`, width / 2, 300);
    text(`정확도: ${stats.accuracy}%`, width / 2, 350);

    // 다시하기 버튼
    drawButton(width / 2 - 100, 450, 200, 60, '다시하기');

    // TODO (손아영):
    // - 축하 애니메이션 (별 튀기기, 폭죽)
    // - 효과음 재생
}

/**
 * 버튼 그리기 헬퍼 함수
 * TODO (윤현준): 호버 효과, 클릭 감지
 */
function drawButton(x, y, w, h, label) {
    // 호버 체크
    const isHover = mouseX > x && mouseX < x + w &&
                    mouseY > y && mouseY < y + h;

    // 버튼 배경
    fill(isHover ? 100 : 150);
    rect(x, y, w, h, 10);

    // 텍스트
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(label, x + w / 2, y + h / 2);
}

/**
 * 난이도 버튼 그리기
 * TODO (윤현준): 난이도별 색상 테마 적용
 */
function drawDifficultyButton(x, y, w, h, label, config) {
    const isHover = mouseX > x && mouseX < x + w &&
                    mouseY > y && mouseY < y + h;

    // 버튼 배경 (난이도별 색상)
    fill(config.color.card);
    if (isHover) {
        stroke(config.color.text);
        strokeWeight(3);
    } else {
        noStroke();
    }
    rect(x, y, w, h, 10);

    // 텍스트
    fill(config.color.text);
    textAlign(CENTER, CENTER);
    textSize(32);
    text(label, x + w / 2, y + h / 2 - 10);

    // 상세 정보
    textSize(16);
    text(`${config.pairs}쌍 | ${config.timeLimit}초`, x + w / 2, y + h / 2 + 20);
}

/**
 * 시간 포맷 헬퍼
 */
function formatTime(seconds) {
    const m = floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s}초`;
}

/**
 * 메시지 표시 (짝 성공! / 실패! 등)
 * TODO (손아영):
 * - 페이드 인/아웃 애니메이션
 * - 위치 조정
 */
function showMessage(message, duration = 1000) {
    // TODO: 임시 메시지 표시 시스템
    // - 화면 중앙에 큰 텍스트
    // - duration 후 자동 사라짐
}

/**
 * 마우스 클릭 처리 (버튼 클릭)
 * TODO (윤현준): sketch.js의 mouseClicked()에서 호출
 */
function handleUIClick() {
    const state = gameManager.currentState;

    if (state === GAME_STATE.START) {
        // 시작 버튼 클릭 체크
        if (isButtonClicked(width / 2 - 100, height * 2 / 3, 200, 60)) {
            gameManager.currentState = GAME_STATE.DIFFICULTY;
        }
    } else if (state === GAME_STATE.DIFFICULTY) {
        // 난이도 버튼 클릭 체크
        const difficulties = [
            { key: 'EASY', y: 200 },
            { key: 'MEDIUM', y: 300 },
            { key: 'HARD', y: 400 },
            { key: 'HELL', y: 500 }
        ];

        difficulties.forEach(diff => {
            if (isButtonClicked(width / 2 - 150, diff.y, 300, 80)) {
                gameManager.initGame(DIFFICULTY[diff.key]);
            }
        });
    } else if (state === GAME_STATE.RESULT) {
        // 다시하기 버튼
        if (isButtonClicked(width / 2 - 100, 450, 200, 60)) {
            gameManager.resetGame();
        }
    }
}

/**
 * 버튼 클릭 체크 헬퍼
 */
function isButtonClicked(x, y, w, h) {
    return mouseX > x && mouseX < x + w &&
           mouseY > y && mouseY < y + h;
}
