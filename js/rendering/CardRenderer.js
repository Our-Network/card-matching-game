/**
 * @fileoverview 카드 렌더링 전용 클래스
 * @module rendering/CardRenderer
 */

class CardRenderer {
    constructor(config = CARD_CONFIG) {
        this.config = config;
        this.animations = new Map();
        this.hoverAnimations = new Map();

        // 기본 스타일
        this.style = {
            borderRadius: 12,
            cardBackColor: '#4A90E2',
            hoverScale: 1.05,
            hoverElevation: 8,
            hoverSpeed: 0.15
        };

        // 임시 이모지
        this.cardEmojis = ['🍎', '🍌', '🍇', '🍊', '🍋', '🍉', '🍓', '🍒',
                           '🍑', '🥝', '🥥', '🥭', '🍍', '🍈', '🥑'];
    }

    // ========== 메인 렌더링 ==========

    drawCard(card, isHovered = false) {
        if (!card) return;

        let hoverProgress = this.hoverAnimations.get(card) || 0;
        if (isHovered && !card.isMatched) {
            hoverProgress = Math.min(hoverProgress + this.style.hoverSpeed, 1.0);
        } else {
            hoverProgress = Math.max(hoverProgress - this.style.hoverSpeed, 0);
        }
        this.hoverAnimations.set(card, hoverProgress);

        push();
        translate(
            card.x + this.config.width / 2,
            card.y + this.config.height / 2
        );

        // 호버 효과
        const scaleAmount = 1 + (this.style.hoverScale - 1) * hoverProgress;
        scale(scaleAmount);
        translate(0, -hoverProgress * this.style.hoverElevation);

        // 애니메이션 적용
        const animState = this._getAnimationState(card);
        if (animState) {
            this._applyAnimation(animState, card);
        }

        // 카드 그리기
        if (card.isFlipped) {
            this._drawFrontFace(card);
        } else {
            this._drawBackFace(card);
        }

        pop();
    }

    drawAllCards(cards, hoveredCard = null) {
        if (!cards || cards.length === 0) return;
        cards.forEach(card => {
            const isHovered = card === hoveredCard;
            this.drawCard(card, isHovered);
        });
    }

    // ========== 기본 렌더링 ==========

    _drawFrontFace(card) {
        rectMode(CENTER);

        // 단순한 흰색 카드
        fill(255);
        stroke(200);
        strokeWeight(2);
        rect(0, 0, this.config.width, this.config.height, this.style.borderRadius);

        // 이모지
        const emoji = this.cardEmojis[card.id % this.cardEmojis.length];
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(this.config.width * 0.5);
        text(emoji, 0, 0);

        // 매칭 완료 시 반투명
        if (card.isMatched) {
            fill(100, 200, 100, 100);
            noStroke();
            rect(0, 0, this.config.width, this.config.height, this.style.borderRadius);
        }
    }

    _drawBackFace(card) {
        rectMode(CENTER);

        // 파란색 뒷면
        fill(this.style.cardBackColor);
        stroke(200);
        strokeWeight(2);
        rect(0, 0, this.config.width, this.config.height, this.style.borderRadius);

        // 물음표
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(this.config.width * 0.4);
        text('?', 0, 0);
    }

    // ========== 애니메이션 ==========

    animateFlip(card, duration = 300) {
        if (!card) return;
        const animState = {
            type: 'flip',
            startTime: millis(),
            duration: duration,
            progress: 0
        };
        this.animations.set(card, animState);
        card.setAnimating(true);
        setTimeout(() => {
            this.animations.delete(card);
            card.setAnimating(false);
        }, duration);
    }

    animateMatch(card1, card2) {
        if (!card1 || !card2) return;
        const animState = {
            type: 'pulse',
            startTime: millis(),
            duration: 600,
            progress: 0
        };
        this.animations.set(card1, animState);
        this.animations.set(card2, { ...animState });
        setTimeout(() => {
            this.animations.delete(card1);
            this.animations.delete(card2);
        }, 600);
    }

    animateMismatch(card1, card2) {
        if (!card1 || !card2) return;
        const animState = {
            type: 'shake',
            startTime: millis(),
            duration: 400,
            progress: 0
        };
        this.animations.set(card1, animState);
        this.animations.set(card2, { ...animState });
        setTimeout(() => {
            this.animations.delete(card1);
            this.animations.delete(card2);
        }, 400);
    }

    _getAnimationState(card) {
        const state = this.animations.get(card);
        if (!state) return null;
        const elapsed = millis() - state.startTime;
        state.progress = Math.min(elapsed / state.duration, 1.0);
        return state;
    }

    _applyAnimation(animState, card) {
        switch (animState.type) {
            case 'flip':
                const angle = animState.progress * Math.PI;
                const scaleX = Math.abs(Math.cos(angle));
                scale(scaleX, 1);
                break;
            case 'pulse':
                const pulseScale = 1 + Math.sin(animState.progress * Math.PI * 3) * 0.1;
                scale(pulseScale);
                break;
            case 'shake':
                const shakeAmount = 8 * Math.sin(animState.progress * Math.PI * 4);
                translate(shakeAmount, 0);
                break;
        }
    }

    // ========== 디버그 ==========

    drawDebugBox(card) {
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        rectMode(CORNER);
        rect(card.x, card.y, this.config.width, this.config.height);
        pop();
    }

    drawAllDebugBoxes(cards) {
        cards.forEach(card => this.drawDebugBox(card));
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardRenderer;
}
