/* ====================================
   게임 로직 및 상태 관리
   담당: 방채민 (상태 관리, 카드 비교 로직, 타이머 & 점수 시스템)
   ==================================== */

class GameManager {
    constructor() {
        // 게임 상태
        this.currentState = GAME_STATE.START;
        this.selectedDifficulty = null;

        // 카드 관련
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;  // 카드 뒤집기 가능 여부
        this.matchedPairs = 0;

        // 점수 & 타이머
        this.score = 0;
        this.timeRemaining = 0;
        this.timerStarted = false;
        this.startTime = 0;

        // 통계
        this.attempts = 0;  // 시도 횟수
        this.combo = 0;     // 연속 성공 콤보
    }

    /**
     * 게임 초기화
     * TODO (방채민): 난이도 선택 후 호출
     */
    initGame(difficulty) {
        this.selectedDifficulty = difficulty;
        this.currentState = GAME_STATE.PLAYING;

        // 카드 생성
        this.cards = createCardDeck(difficulty.pairs, difficulty);

        // 변수 초기화
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
        this.matchedPairs = 0;

        this.score = 0;
        this.timeRemaining = difficulty.timeLimit;
        this.timerStarted = false;
        this.startTime = millis();

        this.attempts = 0;
        this.combo = 0;
    }

    /**
     * 카드 클릭 처리
     * TODO (방채민): 윤현준의 mouseClicked()에서 호출
     */
    handleCardClick(card) {
        // 클릭 불가 조건
        if (!this.canFlip) return;
        if (card.isMatched) return;
        if (card.isFlipped) return;

        // 카드 뒤집기
        card.flip();

        // 첫 번째 카드 선택
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }

        // 두 번째 카드 선택
        if (!this.secondCard && card !== this.firstCard) {
            this.secondCard = card;
            this.canFlip = false;  // 비교 중에는 클릭 금지
            this.attempts++;

            // 비교 로직 실행
            setTimeout(() => {
                this.checkMatch();
            }, CARD_CONFIG.matchDelay);
        }
    }

    /**
     * 카드 짝 맞추기 비교
     * TODO (방채민): 핵심 로직 구현
     */
    checkMatch() {
        if (!this.firstCard || !this.secondCard) return;

        const isMatch = this.firstCard.id === this.secondCard.id;

        if (isMatch) {
            // ✅ 성공
            this.handleMatch();
        } else {
            // ❌ 실패
            this.handleMismatch();
        }

        // 카드 참조 초기화
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
    }

    /**
     * 짝 맞추기 성공
     * TODO (방채민):
     * - 점수 계산 (기본 점수 + 콤보 보너스)
     * - 효과음 재생 (손아영)
     * - 성공 애니메이션 트리거 (윤현준)
     */
    handleMatch() {
        this.firstCard.setMatched();
        this.secondCard.setMatched();

        this.matchedPairs++;
        this.combo++;

        // 점수 계산
        const basePoints = this.selectedDifficulty.pointsPerMatch;
        const comboBonus = this.combo > 1 ? (this.combo - 1) * 5 : 0;
        this.score += basePoints + comboBonus;

        // TODO (손아영): 효과음 재생
        // playSound(SOUNDS.match);

        // 게임 클리어 체크
        if (this.matchedPairs === this.selectedDifficulty.pairs) {
            this.gameComplete();
        }
    }

    /**
     * 짝 맞추기 실패
     * TODO (방채민):
     * - 시간 페널티 적용
     * - 효과음 재생
     * - 1초 후 카드 뒤집기
     */
    handleMismatch() {
        this.combo = 0;  // 콤보 초기화

        // 시간 페널티
        this.timeRemaining -= this.selectedDifficulty.timePenalty;
        if (this.timeRemaining < 0) this.timeRemaining = 0;

        // TODO (손아영): 효과음 재생
        // playSound(SOUNDS.mismatch);

        // 1초 후 카드 뒤집기
        setTimeout(() => {
            if (this.firstCard && !this.firstCard.isMatched) {
                this.firstCard.flip();
            }
            if (this.secondCard && !this.secondCard.isMatched) {
                this.secondCard.flip();
            }
        }, CARD_CONFIG.mismatchDelay);
    }

    /**
     * 타이머 업데이트
     * TODO (방채민): draw()에서 매 프레임 호출
     */
    updateTimer() {
        if (this.currentState !== GAME_STATE.PLAYING) return;
        if (!this.timerStarted) {
            this.timerStarted = true;
            this.startTime = millis();
        }

        const elapsed = floor((millis() - this.startTime) / 1000);
        this.timeRemaining = this.selectedDifficulty.timeLimit - elapsed;

        // 시간 초과
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.gameOver();
        }
    }

    /**
     * 게임 클리어
     * TODO (방채민):
     * - 최종 점수 계산 (남은 시간 보너스)
     * - 결과 화면으로 전환
     */
    gameComplete() {
        this.currentState = GAME_STATE.RESULT;

        // 남은 시간 보너스
        const timeBonus = this.timeRemaining * 2;
        this.score += timeBonus;

        // TODO (손아영): 클리어 효과음
        // playSound(SOUNDS.complete);

        // TODO (윤현준): 결과 화면 표시
    }

    /**
     * 게임 오버 (시간 초과)
     */
    gameOver() {
        this.currentState = GAME_STATE.RESULT;
        // TODO: 실패 화면 표시
    }

    /**
     * 게임 리셋 (다시하기)
     * TODO (손아영): 결과 화면에서 호출
     */
    resetGame() {
        this.currentState = GAME_STATE.START;
        this.cards = [];
        this.selectedDifficulty = null;
    }

    /**
     * 남은 카드 쌍 수 계산
     * TODO (방채민): UI 표시용
     */
    getRemainingPairs() {
        return this.selectedDifficulty.pairs - this.matchedPairs;
    }

    /**
     * 게임 통계 반환
     * TODO (손아영): 결과 화면에서 사용
     */
    getStats() {
        return {
            score: this.score,
            time: this.selectedDifficulty.timeLimit - this.timeRemaining,
            attempts: this.attempts,
            accuracy: this.attempts > 0 ? (this.matchedPairs / this.attempts * 100).toFixed(1) : 0
        };
    }
}

// 전역 게임 매니저 인스턴스
// TODO (윤현준): sketch.js에서 초기화
let gameManager;
