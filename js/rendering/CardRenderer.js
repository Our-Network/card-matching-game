/**
 * @fileoverview 카드 렌더링 전용 클래스
 * @module rendering/CardRenderer
 * @author 윤현준 (렌더링, 애니메이션)
 */

/**
 * 카드 렌더링 담당
 * p5.js를 사용하여 카드를 화면에 그림
 * @class
 */
class CardRenderer {
    /**
     * @param {Object} config - CARD_CONFIG 설정
     */
    constructor(config = CARD_CONFIG) {
        this.config = config;

        // 애니메이션 상태
        this.animations = new Map(); // card -> animation state

        // 호버 애니메이션 상태
        this.hoverAnimations = new Map(); // card -> hover progress

        // 스타일 설정
        this.style = {
            // 카드 뒷면
            backColor: config.backColor || '#424242',
            backPattern: 'grid', // 'solid', 'grid', 'diagonal'

            // 카드 앞면
            frontColor: '#FFFFFF',
            borderColor: '#E0E0E0',
            borderWidth: 2,

            // 텍스트
            textColor: '#212121',
            textSize: 32,

            // 매칭 완료
            matchedOpacity: 0.6,
            matchedBorderColor: '#4CAF50',

            // 호버 효과
            hoverScale: 1.08,
            hoverElevation: 8,
            hoverSpeed: 0.15
        };

        // 카드 이모지 (임시 이미지)
        this.cardEmojis = ['🍎', '🍌', '🍇', '🍊', '🍋', '🍉', '🍓', '🍒',
                           '🍑', '🥝', '🥥', '🥭', '🍍', '🍈', '🥑'];

        // 카드 색상 팔레트
        this.cardColors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
            '#EC7063', '#AF7AC5', '#5DADE2', '#58D68D', '#F4D03F'
        ];
    }

    // ========== 메인 렌더링 ==========

    /**
     * 카드 한 장 렌더링
     *
     * @param {Card} card - 렌더링할 카드
     * @param {boolean} [isHovered=false] - 호버 상태
     */
    drawCard(card, isHovered = false) {
        if (!card) return;

        // 호버 애니메이션 진행도 업데이트
        let hoverProgress = this.hoverAnimations.get(card) || 0;
        if (isHovered && !card.isMatched) {
            hoverProgress = Math.min(hoverProgress + this.style.hoverSpeed, 1.0);
        } else {
            hoverProgress = Math.max(hoverProgress - this.style.hoverSpeed, 0);
        }
        this.hoverAnimations.set(card, hoverProgress);

        push();

        // 카드 중심으로 이동
        translate(
            card.x + this.config.width / 2,
            card.y + this.config.height / 2
        );

        // 호버 그림자 효과
        if (hoverProgress > 0 && !card.isMatched) {
            const elevation = hoverProgress * this.style.hoverElevation;
            push();
            translate(0, elevation / 2);
            fill(0, 0, 0, 30 * hoverProgress);
            noStroke();
            ellipse(0, 0, this.config.width * 0.9, this.config.height * 0.3);
            pop();
        }

        // 호버 스케일 효과 (부드럽게)
        const scaleAmount = 1 + (this.style.hoverScale - 1) * hoverProgress;
        scale(scaleAmount);

        // 호버 Y축 이동 (위로)
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

    /**
     * 모든 카드 렌더링
     *
     * @param {Card[]} cards - 카드 배열
     * @param {Card|null} [hoveredCard=null] - 호버 중인 카드
     */
    drawAllCards(cards, hoveredCard = null) {
        if (!cards || cards.length === 0) return;

        cards.forEach(card => {
            const isHovered = card === hoveredCard;
            this.drawCard(card, isHovered);
        });
    }

    // ========== 카드 앞면/뒷면 ==========

    /**
     * 카드 앞면 그리기
     *
     * @private
     * @param {Card} card
     */
    _drawFrontFace(card) {
        rectMode(CENTER);

        // 카드 배경색 (ID별로 다른 색상)
        const cardColor = this.cardColors[card.id % this.cardColors.length];

        if (card.isMatched) {
            // 매칭 완료 시 투명도
            const c = color(cardColor);
            fill(red(c), green(c), blue(c), 255 * this.style.matchedOpacity);
        } else {
            fill(cardColor);
        }

        // 테두리
        strokeWeight(this.style.borderWidth);
        stroke(card.isMatched ?
               this.style.matchedBorderColor :
               this.style.borderColor);

        // 카드 사각형
        rect(0, 0,
             this.config.width,
             this.config.height,
             this.config.cornerRadius);

        // 카드 이모지 표시
        const emoji = this.cardEmojis[card.id % this.cardEmojis.length];
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(this.config.width * 0.5); // 카드 크기의 50%
        text(emoji, 0, 0);

        // 작은 ID 표시 (하단)
        fill(255, 255, 255, 180);
        textSize(12);
        text(`#${card.id}`, 0, this.config.height / 2 - 15);
    }

    /**
     * 카드 뒷면 그리기
     *
     * @private
     * @param {Card} card
     */
    _drawBackFace(card) {
        rectMode(CENTER);

        // 배경
        fill(this.style.backColor);
        strokeWeight(this.style.borderWidth);
        stroke(this.style.borderColor);

        rect(0, 0,
             this.config.width,
             this.config.height,
             this.config.cornerRadius);

        // 패턴 그리기
        this._drawBackPattern();
    }

    /**
     * 뒷면 패턴 그리기
     *
     * @private
     */
    _drawBackPattern() {
        const pattern = this.style.backPattern;

        noFill();
        stroke(255, 255, 255, 100);
        strokeWeight(1);

        const w = this.config.width;
        const h = this.config.height;
        const margin = 10;

        switch (pattern) {
            case 'grid':
                // 그리드 패턴
                for (let x = -w/2 + margin; x < w/2 - margin; x += 20) {
                    line(x, -h/2 + margin, x, h/2 - margin);
                }
                for (let y = -h/2 + margin; y < h/2 - margin; y += 20) {
                    line(-w/2 + margin, y, w/2 - margin, y);
                }
                break;

            case 'diagonal':
                // 대각선 패턴
                for (let i = -w; i < w + h; i += 20) {
                    line(i, -h/2, i - h, h/2);
                }
                break;

            case 'solid':
            default:
                // 단색
                break;
        }
    }

    // ========== 애니메이션 ==========

    /**
     * 카드 뒤집기 애니메이션 시작
     *
     * @param {Card} card - 애니메이션 대상 카드
     * @param {number} [duration=300] - 애니메이션 지속 시간(ms)
     */
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

        // 애니메이션 완료 후 정리
        setTimeout(() => {
            this.animations.delete(card);
            card.setAnimating(false);
        }, duration);
    }

    /**
     * 매칭 성공 애니메이션
     *
     * @param {Card} card1
     * @param {Card} card2
     */
    animateMatch(card1, card2) {
        if (!card1 || !card2) return;

        // 반짝임 효과
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

    /**
     * 매칭 실패 애니메이션
     *
     * @param {Card} card1
     * @param {Card} card2
     */
    animateMismatch(card1, card2) {
        if (!card1 || !card2) return;

        // 흔들림 효과
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

    /**
     * 애니메이션 상태 가져오기
     *
     * @private
     * @param {Card} card
     * @returns {Object|null}
     */
    _getAnimationState(card) {
        const state = this.animations.get(card);
        if (!state) return null;

        // 진행도 계산
        const elapsed = millis() - state.startTime;
        state.progress = Math.min(elapsed / state.duration, 1.0);

        return state;
    }

    /**
     * 애니메이션 변환 적용
     *
     * @private
     * @param {Object} animState
     * @param {Card} card
     */
    _applyAnimation(animState, card) {
        switch (animState.type) {
            case 'flip':
                // 2D 뒤집기 효과 (scale 사용)
                const angle = animState.progress * Math.PI;
                const scaleX = Math.abs(Math.cos(angle)); // 0 ~ 1 ~ 0으로 변화

                // 가로 축소/확대로 flip 효과
                scale(scaleX, 1);

                // 중간 지점에서 앞면/뒷면 전환
                if (animState.progress > 0.5 && card) {
                    // 카드 상태와 실제 보여지는 면 동기화
                    // (애니메이션만 담당하므로 여기서는 렌더링만)
                }
                break;

            case 'pulse':
                // 반짝임 효과 (성공 시)
                const pulseScale = 1 + Math.sin(animState.progress * Math.PI * 2) * 0.15;
                scale(pulseScale);

                // 밝기 변화
                const brightness = 1 + Math.sin(animState.progress * Math.PI * 2) * 0.3;
                tint(255, 255 * brightness);
                break;

            case 'shake':
                // 흔들림 효과 (실패 시)
                const shakeAmount = 10 * Math.sin(animState.progress * Math.PI * 4);
                translate(shakeAmount, 0);

                // 붉은 색조
                tint(255, 180, 180);
                break;
        }
    }

    // ========== 디버그 ==========

    /**
     * 카드 히트박스 표시 (디버그용)
     *
     * @param {Card} card
     */
    drawDebugBox(card) {
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        rectMode(CORNER);
        rect(card.x, card.y, this.config.width, this.config.height);
        pop();
    }

    /**
     * 모든 카드의 히트박스 표시
     *
     * @param {Card[]} cards
     */
    drawAllDebugBoxes(cards) {
        cards.forEach(card => this.drawDebugBox(card));
    }
}

// ES6 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardRenderer;
}
