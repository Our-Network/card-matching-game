/**
 * @fileoverview 결과 화면 렌더링
 * @module rendering/screens/ResultScreen
 * @description 게임 종료 후 결과 화면 및 통계 표시
 */

class ResultScreen {
    constructor(uiRenderer) {
        // UIRenderer의 공통 유틸리티 참조
        this.ui = uiRenderer;
    }

    /**
     * 결과 화면 그리기
     * @param {Object} stats - 게임 통계 정보
     */
    drawResultScreen(stats) {
        // 배경
        this.ui._drawGradientBackground();
        this.ui._drawWaves(height - 150);

        // 승리 여부 및 원인 판단
        const isWin = stats.isWin;
        const reason = stats.gameOverReason;

        // 캐릭터 (크게) - 표정은 승리 여부에 따라
        this.ui._drawBearCharacter(width / 2, height / 2 + 50, 1.3, isWin);

        // 아이콘 표시 (승리/실패에 따라)
        let icon = '🎉';
        if (!isWin) {
            if (reason === 'hearts') {
                icon = '💔';
            } else if (reason === 'time') {
                icon = '⏰';
            }
        }

        // 아이콘 그리기
        push();
        textAlign(CENTER, CENTER);
        textSize(60);
        noStroke();
        const iconBounce = sin(millis() * 0.005) * 5;
        text(icon, width / 2, 150 + iconBounce);
        pop();

        // 결과 타이틀
        push();
        textAlign(CENTER, CENTER);
        textSize(this.ui.fonts.title);
        textStyle(BOLD);

        let titleText;
        if (isWin) {
            titleText = '성공!';
        } else if (reason === 'hearts') {
            titleText = '실패!';
        } else {
            titleText = '시간 초과!';
        }

        fill(this.ui.colors.text.white);
        stroke(this.ui.colors.text.primary);
        strokeWeight(8);
        text(titleText, width / 2, 100);
        pop();

        // 통계 박스
        this._drawStatsBox(width / 2, 250, stats);

        // 버튼들
        // 재시도 버튼 (같은 난이도)
        this.ui._drawPillButton(
            width / 2 - 120,
            height - 120,
            200,
            70,
            '재시도',
            this.ui.colors.button.normal,
            'retry'
        );

        // 난이도 선택 버튼
        this.ui._drawPillButton(
            width / 2 + 120,
            height - 120,
            200,
            70,
            '난이도 선택',
            this.ui.colors.button.hard,
            'difficulty'
        );
    }

    /**
     * 통계 박스 그리기
     * @private
     * @param {number} x - x 좌표
     * @param {number} y - y 좌표
     * @param {Object} stats - 게임 통계
     */
    _drawStatsBox(x, y, stats) {
        const isWin = stats.isWin;
        const boxWidth = 400;
        const boxHeight = isWin ? 320 : 300;

        push();
        // 박스 배경
        fill(255, 255, 255, 250);
        stroke(this.ui.colors.text.primary);
        strokeWeight(4);
        rect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight, 30);

        // 통계 텍스트
        textAlign(CENTER, CENTER);
        noStroke();
        fill(this.ui.colors.text.primary);

        const statY = y - 90;
        const lineHeight = 40;

        // 난이도
        textSize(this.ui.fonts.ui - 2);
        textStyle(NORMAL);
        text(`난이도: ${stats.difficulty}`, x, statY + lineHeight * 0);

        // 점수
        textSize(this.ui.fonts.ui);
        textStyle(BOLD);
        text(`점수: ${stats.score}점`, x, statY + lineHeight * 1);

        // 하트 정보
        textSize(this.ui.fonts.ui - 2);
        textStyle(NORMAL);
        const heartText = isWin
            ? `남은 하트: ${stats.heartsRemaining}/${stats.maxHearts}`
            : `하트: 0/${stats.maxHearts}`;
        text(heartText, x, statY + lineHeight * 2);

        // 시간
        const minutes = floor(stats.elapsedTime / 60);
        const seconds = stats.elapsedTime % 60;
        text(`플레이 시간: ${minutes}분 ${seconds}초`, x, statY + lineHeight * 3);

        // 맞춘 카드 쌍
        text(`맞춘 짝: ${stats.matchedPairs}/${stats.totalPairs}`, x, statY + lineHeight * 4);

        // 시도 횟수
        text(`시도: ${stats.attempts}회`, x, statY + lineHeight * 5);

        // 정확도
        text(`정확도: ${stats.accuracy}%`, x, statY + lineHeight * 6);

        // 최대 콤보 (승리 시에만)
        if (isWin && stats.maxCombo > 0) {
            text(`최대 콤보: ${stats.maxCombo}`, x, statY + lineHeight * 7);
        }

        pop();
    }

    /**
     * 결과 화면 클릭 처리
     * @param {number} mx - 마우스 x 좌표
     * @param {number} my - 마우스 y 좌표
     * @returns {string|null} 클릭된 버튼 ID
     */
    handleResultClick(mx, my) {
        const btnY = height - 120;
        const btnWidth = 200;
        const btnHeight = 70;

        // 재시도 버튼 (왼쪽)
        if (mx > width / 2 - 120 - btnWidth / 2 &&
            mx < width / 2 - 120 + btnWidth / 2 &&
            my > btnY - btnHeight / 2 &&
            my < btnY + btnHeight / 2) {
            return 'retry';
        }

        // 난이도 선택 버튼 (오른쪽)
        if (mx > width / 2 + 120 - btnWidth / 2 &&
            mx < width / 2 + 120 + btnWidth / 2 &&
            my > btnY - btnHeight / 2 &&
            my < btnY + btnHeight / 2) {
            return 'difficulty';
        }

        return null;
    }
}

// ES6 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultScreen;
}
