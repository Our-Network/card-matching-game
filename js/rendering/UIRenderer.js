/**
 * @fileoverview UI 화면 렌더링 클래스 (완전 비어있음)
 * @module rendering/UIRenderer
 */

class UIRenderer {
    constructor() {
        this.hoveredButton = null;
        this.currentMessage = null;
        this.messageEndTime = 0;
        this.messageAlpha = 0;
        this.messageQueue = [];
        this.helperMessage = null;
        this.helperMessageEndTime = 0;
        this.highScoreManager = new HighScoreManager();
    }

    // 시작 화면
    drawStartScreen() {
        background(255);
    }

    handleStartClick(mx, my) {
        return 'start';
    }

    // 난이도 선택 화면
    drawDifficultyScreen() {
        background(255);
    }

    handleDifficultyClick(mx, my) {
        return 'EASY';
    }

    // 게임 플레이 화면
    drawGameUI(score, timeLeft, difficulty) {
        // 아무것도 그리지 않음
    }

    // 결과 화면
    drawResultScreen(score, time, difficulty) {
        background(255);
    }

    handleResultClick(mx, my) {
        return 'restart';
    }

    // 메시지 시스템
    showMessage(text, duration = 2000, type = 'info') {
        this.currentMessage = { text, type };
        this.messageEndTime = millis() + duration;
    }

    showHelperMessage(message, duration = 3000) {
        this.helperMessage = message;
        this.helperMessageEndTime = millis() + duration;
    }

    // 유틸리티
    updateHover(mx, my) {
        this.hoveredButton = null;
    }

    _formatTime(seconds) {
        const m = floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIRenderer;
}
