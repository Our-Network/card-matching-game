/**
 * @fileoverview UI 화면 렌더링 클래스
 * @module rendering/UIRenderer
 * @author 윤현준 (UI 구현, 화면 전환)
 *         손아영 (메시지, 결과 화면)
 */

/**
 * 게임 UI 렌더링 담당
 * 시작 화면, 난이도 선택, 게임 UI, 결과 화면
 * @class
 */
class UIRenderer {
    constructor() {
        // 버튼 상태
        this.hoveredButton = null;

        // 향상된 메시지 시스템
        this.currentMessage = null;
        this.messageEndTime = 0;
        this.messageAlpha = 0; // 메시지 투명도 (페이드 효과)
        this.messageQueue = []; // 메시지 큐

        // 헬퍼 메시지 (게임 시작 시)
        this.helperMessage = null;
        this.helperMessageEndTime = 0;

        // 스타일
        this.style = {
            // 폰트
            titleSize: 64,
            headingSize: 48,
            bodySize: 24,
            smallSize: 18,

            // 색상
            primaryColor: '#667eea',
            accentColor: '#764ba2',
            textDark: '#212121',
            textLight: '#FFFFFF',
            bgLight: '#F5F5F5',

            // 버튼
            buttonPadding: 20,
            buttonRadius: 10
        };

        // 최고 기록 관리자
        this.highScoreManager = new HighScoreManager();
    }

    // ========== 시작 화면 ==========

    /**
     * 시작 화면 렌더링
     */
    drawStartScreen() {
        // 그라데이션 배경
        this._drawGradientBackground();

        // 제목
        fill(this.style.textLight);
        textAlign(CENTER, CENTER);
        textSize(this.style.titleSize);
        textStyle(BOLD);
        text('메모리 카드 게임', width / 2, height / 3);

        // 설명
        textSize(this.style.bodySize);
        textStyle(NORMAL);
        text('같은 그림의 카드 쌍을 찾으세요!', width / 2, height / 2);

        // 시작 버튼
        const btnX = width / 2 - 100;
        const btnY = height * 2 / 3;
        const btnW = 200;
        const btnH = 60;

        this._drawButton(btnX, btnY, btnW, btnH, '시작하기', 'start');
    }

    /**
     * 시작 화면 클릭 처리
     *
     * @param {number} mx - 마우스 x
     * @param {number} my - 마우스 y
     * @returns {string|null} 버튼 ID
     */
    handleStartClick(mx, my) {
        return this._checkButton(width / 2 - 100, height * 2 / 3, 200, 60, 'start');
    }

    // ========== 난이도 선택 화면 ==========

    /**
     * 난이도 선택 화면 렌더링
     */
    drawDifficultyScreen() {
        background(this.style.bgLight);

        // 제목
        fill(this.style.textDark);
        textAlign(CENTER, CENTER);
        textSize(this.style.headingSize);
        textStyle(BOLD);
        text('난이도 선택', width / 2, 100);

        // 난이도 버튼들
        const difficulties = [
            { key: 'EASY', y: 220 },
            { key: 'MEDIUM', y: 330 },
            { key: 'HARD', y: 440 },
            { key: 'HELL', y: 550 }
        ];

        difficulties.forEach(({ key, y }) => {
            const config = DIFFICULTY[key];
            this._drawDifficultyButton(
                width / 2 - 200,
                y,
                400,
                90,
                config,
                key
            );
        });
    }

    /**
     * 난이도 버튼 그리기
     *
     * @private
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Object} config - 난이도 설정
     * @param {string} id - 버튼 ID
     */
    _drawDifficultyButton(x, y, w, h, config, id) {
        const isHovered = this.hoveredButton === id;

        // 버튼 배경
        fill(config.color.card);
        if (isHovered) {
            stroke(config.color.text);
            strokeWeight(4);
        } else {
            strokeWeight(2);
            stroke(200);
        }

        rect(x, y, w, h, this.style.buttonRadius);

        // 난이도 이름
        noStroke();
        fill(config.color.text);
        textAlign(CENTER, CENTER);
        textSize(36);
        textStyle(BOLD);
        text(config.name, x + w / 2, y + h / 2 - 15);

        // 상세 정보
        textSize(18);
        textStyle(NORMAL);
        text(`${config.pairs}쌍 | ${config.timeLimit}초 | ${config.pointsPerMatch}점`,
             x + w / 2, y + h / 2 + 20);
    }

    /**
     * 난이도 선택 화면 클릭 처리
     *
     * @param {number} mx
     * @param {number} my
     * @returns {string|null} 선택된 난이도 키
     */
    handleDifficultyClick(mx, my) {
        const difficulties = [
            { key: 'EASY', y: 220 },
            { key: 'MEDIUM', y: 330 },
            { key: 'HARD', y: 440 },
            { key: 'HELL', y: 550 }
        ];

        for (const { key, y } of difficulties) {
            if (this._isInRect(mx, my, width / 2 - 200, y, 400, 90)) {
                return key;
            }
        }

        return null;
    }

    // ========== 게임 플레이 화면 ==========

    /**
     * 게임 UI 렌더링 (상단 바)
     *
     * @param {GameState} gameState - 게임 상태
     */
    drawGameUI(gameState) {
        if (!gameState) return;

        // 배경색 (난이도별)
        if (gameState.difficulty) {
            background(gameState.difficulty.color.bg);
        }

        // 상단 UI 바
        this._drawTopBar(gameState);

        // 헬퍼 메시지 표시 (상단 중앙)
        if (this.helperMessage && millis() < this.helperMessageEndTime) {
            this._drawHelperMessage(this.helperMessage);
        }

        // 메시지 표시 (중앙, 애니메이션 적용)
        if (this.currentMessage) {
            this._updateMessageAnimation();
            if (millis() < this.messageEndTime) {
                this._drawAnimatedMessage(this.currentMessage);
            } else if (this.messageQueue.length > 0) {
                // 큐에 다음 메시지가 있으면 표시
                const nextMsg = this.messageQueue.shift();
                this.showMessage(nextMsg.text, nextMsg.duration, nextMsg.type);
            }
        }
    }

    /**
     * 상단 UI 바
     *
     * @private
     * @param {GameState} gameState
     */
    _drawTopBar(gameState) {
        // 반투명 배경
        fill(255, 255, 255, 240);
        noStroke();
        rect(0, 0, width, 150, 0, 0, 20, 20);

        fill(this.style.textDark);
        textAlign(LEFT, TOP);
        textSize(28);
        textStyle(BOLD);

        const padding = 30;
        const lineHeight = 45;

        // 타이머
        const minutes = floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        const timeStr = `${nf(minutes, 2)}:${nf(seconds, 2)}`;

        // 시간 색상 (10초 이하면 빨강)
        if (gameState.timeRemaining <= 10) {
            fill(244, 67, 54); // Red
        }
        text(`⏱️ ${timeStr}`, padding, padding);

        // 점수
        fill(this.style.textDark);
        text(`🎯 점수: ${gameState.score}`, padding, padding + lineHeight);

        // 남은 쌍
        text(`📦 남은 쌍: ${gameState.getRemainingPairs()}`,
             width / 2 - 100, padding);

        // 시도 횟수
        text(`🔄 시도: ${gameState.attempts}`,
             width / 2 - 100, padding + lineHeight);

        // 콤보
        if (gameState.combo > 1) {
            push();
            fill(255, 152, 0); // Orange
            textSize(32);
            text(`🔥 콤보 x${gameState.combo}`,
                 width - 200, padding + lineHeight / 2);
            pop();
        }
    }

    // ========== 결과 화면 ==========

    /**
     * 결과 화면 렌더링
     *
     * @param {Object} stats - 게임 결과 통계
     */
    drawResultScreen(stats) {
        if (!stats) return;

        background(this.style.bgLight);

        const centerX = width / 2;
        const isWin = stats.isWin;

        // 결과 메시지
        fill(isWin ? '#4CAF50' : '#F44336');
        textAlign(CENTER, CENTER);
        textSize(this.style.titleSize);
        textStyle(BOLD);
        text(isWin ? '🎉 게임 클리어!' : '⏰ 시간 초과', centerX, 80);

        // 신기록 표시
        if (isWin && stats.difficulty) {
            const isNewRecord = this.highScoreManager.isNewRecord(
                stats.difficulty.name,
                stats.score
            );

            if (isNewRecord) {
                fill('#FFD700'); // 금색
                textSize(36);
                textStyle(BOLD);
                text('✨ 신기록! ✨', centerX, 145);

                // 신기록 저장
                this.highScoreManager.saveScore(
                    stats.difficulty.name,
                    stats.score,
                    stats.elapsedTime,
                    stats.accuracy
                );
            }
        }

        // 통계 표시 (좌측)
        fill(this.style.textDark);
        textSize(28);
        textStyle(NORMAL);
        textAlign(RIGHT, CENTER);

        const leftX = centerX - 50;
        const statsY = 220;
        const lineSpacing = 50;

        text('최종 점수:', leftX, statsY);
        text('소요 시간:', leftX, statsY + lineSpacing);
        text('시도 횟수:', leftX, statsY + lineSpacing * 2);
        text('정확도:', leftX, statsY + lineSpacing * 3);
        text('최고 콤보:', leftX, statsY + lineSpacing * 4);

        // 통계 값 (우측)
        textAlign(LEFT, CENTER);
        textStyle(BOLD);
        const rightX = centerX - 40;

        fill('#1976D2');
        text(`${stats.score}`, rightX, statsY);
        text(this._formatTime(stats.elapsedTime), rightX, statsY + lineSpacing);
        text(`${stats.attempts}`, rightX, statsY + lineSpacing * 2);
        text(`${stats.accuracy}%`, rightX, statsY + lineSpacing * 3);
        text(`${stats.maxCombo}`, rightX, statsY + lineSpacing * 4);

        // 최고 기록 표시
        if (isWin && stats.difficulty) {
            this._drawHighScore(stats.difficulty.name, statsY + lineSpacing * 5 + 30);
        }

        // 다시하기 버튼
        this._drawButton(centerX - 100, 680, 200, 60, '다시하기', 'retry');
    }

    /**
     * 최고 기록 표시
     *
     * @private
     * @param {string} difficultyName - 난이도 이름
     * @param {number} y - Y 좌표
     */
    _drawHighScore(difficultyName, y) {
        const highScore = this.highScoreManager.getHighScore(difficultyName);
        if (!highScore) return;

        const centerX = width / 2;

        push();

        // 구분선
        stroke(200);
        strokeWeight(2);
        line(centerX - 200, y - 10, centerX + 200, y + 10);

        // 제목
        noStroke();
        fill(this.style.textDark);
        textAlign(CENTER, TOP);
        textSize(22);
        textStyle(BOLD);
        text('🏆 최고 기록', centerX, y + 20);

        // 최고 기록 정보
        textSize(18);
        textStyle(NORMAL);
        textAlign(LEFT, TOP);

        fill(100);
        const infoY = y + 55;
        const infoSpacing = 25;

        text(`최고 점수: ${highScore.score}점`, centerX - 150, infoY);
        text(`최단 시간: ${this._formatTime(highScore.time)}`,
             centerX - 150, infoY + infoSpacing);
        text(`최고 정확도: ${highScore.accuracy}%`,
             centerX - 150, infoY + infoSpacing * 2);

        pop();
    }

    /**
     * 결과 화면 클릭 처리
     *
     * @param {number} mx
     * @param {number} my
     * @returns {string|null}
     */
    handleResultClick(mx, my) {
        return this._checkButton(width / 2 - 100, 600, 200, 60, 'retry');
    }

    // ========== 메시지 시스템 ==========

    /**
     * 화면에 메시지 표시 (중앙, 애니메이션)
     *
     * @param {string} message - 메시지 텍스트
     * @param {number} [duration=1500] - 표시 시간(ms)
     * @param {string} [type='info'] - 메시지 타입 ('success', 'error', 'info')
     * @param {boolean} [queue=false] - 큐에 추가할지 여부
     */
    showMessage(message, duration = 1500, type = 'info', queue = false) {
        // 현재 메시지가 있고 큐 옵션이 활성화되어 있으면 큐에 추가
        if (queue && this.currentMessage) {
            this.messageQueue.push({ text: message, duration, type });
            return;
        }

        this.currentMessage = { text: message, type: type };
        this.messageEndTime = millis() + duration;
        this.messageAlpha = 0; // 페이드인 시작
    }

    /**
     * 헬퍼 메시지 표시 (상단 중앙, 힌트 메시지용)
     *
     * @param {string} message - 메시지 텍스트
     * @param {number} [duration=3000] - 표시 시간(ms)
     */
    showHelperMessage(message, duration = 3000) {
        this.helperMessage = message;
        this.helperMessageEndTime = millis() + duration;
    }

    /**
     * 메시지 애니메이션 업데이트
     *
     * @private
     */
    _updateMessageAnimation() {
        if (!this.currentMessage) return;

        const now = millis();
        const timeLeft = this.messageEndTime - now;
        const fadeDuration = 200; // 페이드 효과 시간

        if (timeLeft > fadeDuration) {
            // 페이드 인
            this.messageAlpha = min(this.messageAlpha + 0.15, 1.0);
        } else {
            // 페이드 아웃
            this.messageAlpha = max(timeLeft / fadeDuration, 0);
        }
    }

    /**
     * 애니메이션이 적용된 메시지 그리기
     *
     * @private
     * @param {Object} msg
     */
    _drawAnimatedMessage(msg) {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3'
        };

        push();

        // 애니메이션: 약간 위로 떠오르는 효과
        const yOffset = (1 - this.messageAlpha) * -20;
        translate(0, yOffset);

        textAlign(CENTER, CENTER);
        textSize(48);
        textStyle(BOLD);

        // 반투명 배경
        const textW = textWidth(msg.text);
        const bgAlpha = 180 * this.messageAlpha;
        fill(0, 0, 0, bgAlpha);
        rect(width / 2 - textW / 2 - 30, height / 2 - 50,
             textW + 60, 100, 15);

        // 테두리 (타입별 색상)
        const borderColor = color(colors[msg.type] || colors.info);
        stroke(red(borderColor), green(borderColor), blue(borderColor),
               255 * this.messageAlpha);
        strokeWeight(3);
        noFill();
        rect(width / 2 - textW / 2 - 30, height / 2 - 50,
             textW + 60, 100, 15);

        // 텍스트
        noStroke();
        fill(255, 255, 255, 255 * this.messageAlpha);
        text(msg.text, width / 2, height / 2);

        pop();
    }

    /**
     * 헬퍼 메시지 그리기 (상단 중앙)
     *
     * @private
     * @param {string} message
     */
    _drawHelperMessage(message) {
        push();

        // 페이드 효과 계산
        const now = millis();
        const timeLeft = this.helperMessageEndTime - now;
        const alpha = min(timeLeft / 500, 1.0); // 마지막 500ms 동안 페이드아웃

        textAlign(CENTER, TOP);
        textSize(20);
        textStyle(NORMAL);

        // 반투명 배경
        const textW = textWidth(message);
        fill(100, 100, 255, 80 * alpha);
        rect(width / 2 - textW / 2 - 15, 170, textW + 30, 35, 8);

        // 텍스트
        fill(50, 50, 150, 255 * alpha);
        text(message, width / 2, 180);

        pop();
    }

    // ========== 공통 UI 요소 ==========

    /**
     * 버튼 그리기
     *
     * @private
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} label
     * @param {string} id
     */
    _drawButton(x, y, w, h, label, id) {
        const isHovered = this.hoveredButton === id;

        // 그림자
        if (isHovered) {
            fill(0, 0, 0, 50);
            noStroke();
            rect(x + 2, y + 4, w, h, this.style.buttonRadius);
        }

        // 버튼 배경
        fill(isHovered ? this.style.accentColor : this.style.primaryColor);
        noStroke();
        rect(x, y, w, h, this.style.buttonRadius);

        // 텍스트
        fill(this.style.textLight);
        textAlign(CENTER, CENTER);
        textSize(this.style.bodySize);
        textStyle(BOLD);
        text(label, x + w / 2, y + h / 2);
    }

    /**
     * 그라데이션 배경
     *
     * @private
     */
    _drawGradientBackground() {
        // 간단한 그라데이션 효과
        for (let y = 0; y < height; y++) {
            const inter = map(y, 0, height, 0, 1);
            const c = lerpColor(
                color(this.style.primaryColor),
                color(this.style.accentColor),
                inter
            );
            stroke(c);
            line(0, y, width, y);
        }
    }

    // ========== 유틸리티 ==========

    /**
     * 버튼 호버 업데이트
     *
     * @param {number} mx
     * @param {number} my
     */
    updateHover(mx, my) {
        // 구현 필요: 현재 화면에 따라 버튼 체크
        this.hoveredButton = null;
    }

    /**
     * 버튼 클릭 체크
     *
     * @private
     */
    _checkButton(x, y, w, h, id) {
        if (this._isInRect(mouseX, mouseY, x, y, w, h)) {
            return id;
        }
        return null;
    }

    /**
     * 사각형 내부 판정
     *
     * @private
     */
    _isInRect(mx, my, x, y, w, h) {
        return mx >= x && mx <= x + w &&
               my >= y && my <= y + h;
    }

    /**
     * 시간 포맷
     *
     * @private
     * @param {number} seconds
     * @returns {string}
     */
    _formatTime(seconds) {
        const m = floor(seconds / 60);
        const s = seconds % 60;
        return `${m}분 ${s}초`;
    }
}

// ES6 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIRenderer;
}
