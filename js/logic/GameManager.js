/**
 * @fileoverview 게임 로직 및 규칙 관리
 * @module logic/GameManager
 * @author 방채민
 */

/**
 * 게임의 핵심 비즈니스 로직 담당
 * 상태 관리는 GameState, 카드 관리는 CardManager에 위임
 * @class
 */
class GameManager {
    /**
     * @param {GameState} gameState - 게임 상태 객체
     * @param {CardManager} cardManager - 카드 관리자
     */
    constructor(gameState, cardManager) {
        this.state = gameState;
        this.cardManager = cardManager;

        // 콜백 함수들 (UI 업데이트용)
        this.onCardFlip = null;
        this.onMatch = null;
        this.onMismatch = null;
        this.onGameComplete = null;
        this.onGameOver = null;
        this.onScoreChange = null;
        this.onTimeUpdate = null;
        this.onBombExplode = null; // 폭탄 폭발 콜백

        // 타이머 관련
        this.timerInterval = null;
    }

    // ========== 게임 초기화 ==========

    /**
     * 게임 시작
     *
     * @param {Object} difficulty - 난이도 설정
     * @param {string} [theme='FRUIT'] - 카드 테마
     */
    startGame(difficulty, theme = 'FRUIT') {
        if (!difficulty) {
            throw new Error('Difficulty is required');
        }

        // 상태 초기화
        this.state.reset();
        this.state.setDifficulty(difficulty);

        // 카드 생성
        const cards = this.cardManager.createDeck(difficulty, theme);
        this.state.setCards(cards);

        // 게임 시작
        this.state.startGame();

        // 타이머 시작
        this._startTimer();

        console.log(`Game started: ${difficulty.name} difficulty, ${cards.length} cards`);
    }

    /**
     * 게임 리셋
     */
    resetGame() {
        this._stopTimer();
        this.cardManager.resetAllCards(this.state.cards);
        this.state.reset();
    }

    // ========== 카드 클릭 처리 ==========

    /**
     * 카드 클릭 핸들러
     *
     * @param {number} x - 마우스 x 좌표
     * @param {number} y - 마우스 y 좌표
     * @returns {boolean} 클릭이 처리되었는지 여부
     */
    handleClick(x, y) {
        if (!this.state.isPlaying()) {
            return false;
        }

        // 클릭된 카드 찾기
        const card = this.cardManager.findCardAt(this.state.cards, x, y);

        if (!card) {
            return false;
        }

        // 카드 클릭 처리
        return this._handleCardClick(card);
    }

    /**
     * 카드 클릭 처리 (내부)
     *
     * @private
     * @param {Card} card - 클릭된 카드
     * @returns {boolean}
     */
    _handleCardClick(card) {
        // 클릭 불가 조건
        if (!this.state.canFlip || !card.canFlip()) {
            return false;
        }

        // 폭탄 카드 처리
        if (card.isBomb) {
            return this._handleBombCard(card);
        }

        // 카드 뒤집기
        try {
            card.flip();
            this._notifyCardFlip(card);
        } catch (error) {
            console.error('Failed to flip card:', error);
            return false;
        }

        // 첫 번째 카드 선택
        if (!this.state.firstCard) {
            this.state.selectFirstCard(card);
            return true;
        }

        // 두 번째 카드 선택 (같은 카드는 제외)
        if (!this.state.secondCard && card !== this.state.firstCard) {
            this.state.selectSecondCard(card);

            // 3장 매칭이 필요한 경우 체크 (지옥 난이도에서 정답 짝 카드)
            const needsThreeMatch = this.state.difficulty && 
                                   this.state.difficulty.answerPairCount === 3 &&
                                   this.state.firstCard.isAnswerPair &&
                                   card.isAnswerPair;
            
            if (needsThreeMatch && !this.state.thirdCard) {
                // 3장 매칭을 위해 계속 선택 가능 (매칭 체크 안 함)
                return true;
            }

            // 일반 카드 2장 매칭 또는 정답 짝 카드 2장 매칭 체크
            // 매칭 체크 (지연)
            setTimeout(() => {
                this._checkMatch();
            }, CARD_CONFIG.matchDelay || 500);

            return true;
        }

        // 세 번째 카드 선택 (3장 매칭용)
        if (!this.state.thirdCard && 
            card !== this.state.firstCard && 
            card !== this.state.secondCard) {
            this.state.selectThirdCard(card);

            // 3장 매칭 체크 (지연)
            setTimeout(() => {
                this._checkMatch();
            }, CARD_CONFIG.matchDelay || 500);

            return true;
        }

        return false;
    }

    // ========== 매칭 로직 ==========

    /**
     * 카드 짝 맞추기 확인
     *
     * @private
     */
    _checkMatch() {
        const { firstCard, secondCard, thirdCard } = this.state;

        if (!firstCard || !secondCard) {
            console.error('Cannot check match: missing cards');
            return;
        }

        // 3장 매칭 체크 (지옥 난이도)
        if (thirdCard) {
            const isThreeMatch = firstCard.isMatchWith(secondCard) && 
                                firstCard.isMatchWith(thirdCard) &&
                                secondCard.isMatchWith(thirdCard);
            
            if (isThreeMatch) {
                this._handleMatch(firstCard, secondCard, thirdCard);
            } else {
                this._handleMismatch(firstCard, secondCard, thirdCard);
            }
            return;
        }

        // 2장 매칭 체크
        const isMatch = firstCard.isMatchWith(secondCard);

        if (isMatch) {
            this._handleMatch(firstCard, secondCard);
        } else {
            this._handleMismatch(firstCard, secondCard);
        }
    }

    /**
     * 매칭 성공 처리
     *
     * @private
     * @param {Card} card1
     * @param {Card} card2
     * @param {Card} [card3] - 3장 매칭용 (선택)
     */
    _handleMatch(card1, card2, card3 = null) {
        // 카드 상태 업데이트
        card1.setMatched();
        card2.setMatched();
        if (card3) {
            card3.setMatched();
        }

        // 점수 계산
        const basePoints = this.state.difficulty.pointsPerMatch;
        const comboBonus = this.state.combo > 0 ? this.state.combo * 5 : 0;
        
        // 정답 짝 카드 보너스
        const answerBonus = (card1.isAnswerPair || card2.isAnswerPair || (card3 && card3.isAnswerPair)) 
                           ? basePoints * 2 : 0;

        // 상태 업데이트
        this.state.recordMatch(basePoints + answerBonus);
        if (comboBonus > 0) {
            this.state.addComboBonus(comboBonus);
        }

        // 선택 초기화
        this.state.clearSelection();

        // 콜백 호출
        const totalPoints = basePoints + answerBonus + comboBonus;
        if (card3) {
            this._notifyMatch(card1, card2, totalPoints, card3);
        } else {
            this._notifyMatch(card1, card2, totalPoints);
        }
        this._notifyScoreChange();

        // 게임 클리어 체크
        if (this.state.isAllMatched()) {
            this._completeGame();
        }
    }

    /**
     * 매칭 실패 처리
     *
     * @private
     * @param {Card} card1
     * @param {Card} card2
     * @param {Card} [card3] - 3장 매칭용 (선택)
     */
    _handleMismatch(card1, card2, card3 = null) {
        // 시간 페널티
        const timePenalty = this.state.difficulty.timePenalty || 0;
        this.state.recordMismatch(timePenalty);

        // 콜백 호출
        if (card3) {
            this._notifyMismatch(card1, card2, timePenalty, card3);
        } else {
            this._notifyMismatch(card1, card2, timePenalty);
        }
        this._notifyTimeUpdate();

        // 카드 뒤집기 (지연)
        setTimeout(() => {
            // 애니메이션 상태 해제 후 뒤집기
            if (!card1.isMatched) {
                card1.setAnimating(false);
                try {
                    card1.flip();
                } catch (error) {
                    console.warn('Failed to flip card1:', error);
                }
            }
            if (!card2.isMatched) {
                card2.setAnimating(false);
                try {
                    card2.flip();
                } catch (error) {
                    console.warn('Failed to flip card2:', error);
                }
            }
            if (card3 && !card3.isMatched) {
                card3.setAnimating(false);
                try {
                    card3.flip();
                } catch (error) {
                    console.warn('Failed to flip card3:', error);
                }
            }

            // 선택 초기화
            this.state.clearSelection();
        }, CARD_CONFIG.mismatchDelay || 1000);
    }

    /**
     * 폭탄 카드 처리
     *
     * @private
     * @param {Card} bombCard - 폭탄 카드
     * @returns {boolean}
     */
    _handleBombCard(bombCard) {
        if (!bombCard.isBomb) {
            return false;
        }

        const difficulty = this.state.difficulty;
        
        // 선택된 카드가 있으면 초기화
        if (this.state.firstCard || this.state.secondCard || this.state.thirdCard) {
            // 선택된 카드들을 뒤집기
            if (this.state.firstCard && !this.state.firstCard.isMatched) {
                this.state.firstCard.flip();
            }
            if (this.state.secondCard && !this.state.secondCard.isMatched) {
                this.state.secondCard.flip();
            }
            if (this.state.thirdCard && !this.state.thirdCard.isMatched) {
                this.state.thirdCard.flip();
            }
            this.state.clearSelection();
        }
        
        // 폭탄 카드 뒤집기
        try {
            bombCard.flip();
            this._notifyCardFlip(bombCard);
        } catch (error) {
            console.error('Failed to flip bomb card:', error);
            return false;
        }

        // 즉사 확률 체크 (지옥 난이도)
        if (difficulty.bombInstantDeathChance && 
            Math.random() < difficulty.bombInstantDeathChance) {
            // 즉사 처리
            setTimeout(() => {
                this._gameOver();
                if (this.onBombExplode) {
                    this.onBombExplode(bombCard, 'instant_death');
                }
            }, 500);
            return true;
        }

        // 카드 섞임 확률 체크 (지옥 난이도)
        if (difficulty.bombShuffleChance && 
            Math.random() < difficulty.bombShuffleChance) {
            // 남은 카드 섞기
            this._shuffleRemainingCards();
            if (this.onBombExplode) {
                this.onBombExplode(bombCard, 'shuffle');
            }
        }

        // 시간 감소
        const timePenalty = difficulty.bombTimePenalty || difficulty.timePenalty || 10;
        this.state.updateTime(Math.max(0, this.state.timeRemaining - timePenalty));
        this._notifyTimeUpdate();

        // 폭탄 카드 뒤집기 (지연)
        setTimeout(() => {
            if (!bombCard.isMatched) {
                bombCard.flip();
            }
        }, CARD_CONFIG.mismatchDelay || 1000);

        return true;
    }

    /**
     * 남은 카드 섞기 (폭탄 효과)
     *
     * @private
     */
    _shuffleRemainingCards() {
        const cards = this.state.cards.filter(card => !card.isMatched && !card.isFlipped);
        
        if (cards.length === 0) {
            return;
        }

        // 위치만 섞기 (ID는 유지)
        const positions = cards.map(card => ({ x: card.x, y: card.y }));
        ArrayUtils.shuffle(positions);

        cards.forEach((card, index) => {
            const { x, y } = positions[index];
            card.setPosition(x, y);
        });

        console.log(`Shuffled ${cards.length} remaining cards`);
    }

    // ========== 타이머 관리 ==========

    /**
     * 타이머 시작
     *
     * @private
     */
    _startTimer() {
        this._stopTimer(); // 기존 타이머 정리

        this.timerInterval = setInterval(() => {
            const elapsed = this.state.getElapsedSeconds();
            const remaining = this.state.timeLimitSeconds - elapsed;

            this.state.updateTime(remaining);
            this._notifyTimeUpdate();

            // 시간 초과
            if (remaining <= 0) {
                this._gameOver();
            }
        }, 1000);
    }

    /**
     * 타이머 정지
     *
     * @private
     */
    _stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ========== 게임 종료 ==========

    /**
     * 게임 클리어
     *
     * @private
     */
    _completeGame() {
        this._stopTimer();
        this.state.endGameWin();
        this._notifyGameComplete();

        console.log('Game Complete!', this.state.getResultStats());
    }

    /**
     * 게임 오버
     *
     * @private
     */
    _gameOver() {
        this._stopTimer();
        this.state.endGameLose();
        this._notifyGameOver();

        console.log('Game Over!', this.state.getResultStats());
    }

    // ========== 콜백 통지 ==========

    _notifyCardFlip(card) {
        if (this.onCardFlip) {
            this.onCardFlip(card);
        }
    }

    _notifyMatch(card1, card2, points, card3 = null) {
        if (this.onMatch) {
            if (card3) {
                this.onMatch(card1, card2, points, card3);
            } else {
                this.onMatch(card1, card2, points);
            }
        }
    }

    _notifyMismatch(card1, card2, penalty, card3 = null) {
        if (this.onMismatch) {
            if (card3) {
                this.onMismatch(card1, card2, penalty, card3);
            } else {
                this.onMismatch(card1, card2, penalty);
            }
        }
    }

    _notifyScoreChange() {
        if (this.onScoreChange) {
            this.onScoreChange(this.state.score, this.state.combo);
        }
    }

    _notifyTimeUpdate() {
        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.state.timeRemaining);
        }
    }

    _notifyGameComplete() {
        if (this.onGameComplete) {
            this.onGameComplete(this.state.getResultStats());
        }
    }

    _notifyGameOver() {
        if (this.onGameOver) {
            this.onGameOver(this.state.getResultStats());
        }
    }

    // ========== 유틸리티 ==========

    /**
     * 현재 게임 상태 반환
     *
     * @returns {Object}
     */
    getGameInfo() {
        return {
            phase: this.state.phase,
            difficulty: this.state.difficulty ? this.state.difficulty.name : null,
            score: this.state.score,
            timeRemaining: this.state.timeRemaining,
            matchedPairs: this.state.matchedPairs,
            totalPairs: this.state.totalPairs,
            remainingPairs: this.state.getRemainingPairs(),
            attempts: this.state.attempts,
            accuracy: this.state.getAccuracy(),
            combo: this.state.combo
        };
    }

    /**
     * 디버그 정보 출력
     */
    debug() {
        console.group('Game Manager Debug');
        console.log('State:', this.state.toJSON());
        console.log('Info:', this.getGameInfo());
        this.cardManager.debugPrint(this.state.cards);
        console.groupEnd();
    }
}

// ES6 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}
