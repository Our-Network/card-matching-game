/**
 * @fileoverview 카드 생성 및 관리 로직
 * @module logic/CardManager
 * @author 방채민
 */

/**
 * 카드 덱 생성 및 관리 담당
 * @class
 */
class CardManager {
    /**
     * @param {Object} config - CARD_CONFIG 설정 객체
     */
    constructor(config = CARD_CONFIG) {
        this.config = config;
        this.imageCache = new Map(); // 이미지 캐싱
    }

    /**
     * 난이도에 맞는 카드 덱 생성
     *
     * @param {Object} difficulty - 난이도 설정 객체
     * @param {string} [theme='FRUIT'] - 카드 테마
     * @returns {Card[]} 생성된 카드 배열
     *
     * @example
     * const manager = new CardManager();
     * const cards = manager.createDeck(DIFFICULTY.EASY);
     */
    createDeck(difficulty, theme = 'FRUIT') {
        if (!difficulty || !difficulty.pairs) {
            throw new Error('Invalid difficulty configuration');
        }

        const pairs = difficulty.pairs;
        const answerPairs = difficulty.answerPairs || 0;
        const answerPairCount = difficulty.answerPairCount || 2;
        const bombCount = difficulty.bombCount || 0;

        // 1. 일반 카드 쌍 생성
        const cards = this._generateCardPairs(pairs, theme);

        // 2. 정답 짝 카드 생성
        if (answerPairs > 0) {
            const answerCards = this._generateAnswerPairCards(answerPairs, answerPairCount, theme);
            cards.push(...answerCards);
        }

        // 3. 폭탄 카드 생성
        if (bombCount > 0) {
            const bombCards = this._generateBombCards(bombCount);
            cards.push(...bombCards);
        }

        // 4. 카드 섞기
        const shuffled = ArrayUtils.shuffle(cards);

        // 5. 그리드 좌표 계산 및 할당
        this._assignPositions(shuffled, difficulty);

        return shuffled;
    }

    /**
     * 카드 쌍 생성 (내부 메서드)
     *
     * @private
     * @param {number} pairs - 생성할 쌍의 개수
     * @param {string} theme - 카드 테마
     * @returns {Card[]} 카드 배열 (섞이지 않음)
     */
    _generateCardPairs(pairs, theme) {
        const cards = [];
        const imagePaths = this._getImagePaths(theme, pairs);

        // 고유 ID를 위해 큰 숫자로 시작 (정답 짝, 폭탄과 구분)
        const baseId = 1000;

        for (let id = 0; id < pairs; id++) {
            const imagePath = imagePaths[id] || `assets/images/cards/placeholder_${id}.png`;

            // 같은 ID를 가진 카드 2개 생성 (짝)
            for (let j = 0; j < 2; j++) {
                const card = new Card(baseId + id, 0, 0, imagePath, CARD_TYPE.NORMAL);
                cards.push(card);
            }
        }

        return cards;
    }

    /**
     * 정답 짝 카드 생성 (내부 메서드)
     *
     * @private
     * @param {number} answerPairs - 정답 짝 세트 개수 (보통 1개)
     * @param {number} answerPairCount - 정답 짝 카드 매칭 개수 (2장 또는 3장)
     * @param {string} theme - 카드 테마
     * @returns {Card[]} 정답 짝 카드 배열
     */
    _generateAnswerPairCards(answerPairs, answerPairCount, theme) {
        const cards = [];
        const imagePaths = this._getImagePaths(theme, answerPairs);

        // 정답 짝 카드는 고유 ID 사용 (2000번대)
        const baseId = 2000;

        for (let i = 0; i < answerPairs; i++) {
            const imagePath = imagePaths[i] || `assets/images/cards/answer_${i}.png`;

            // 정답 짝 카드는 모두 같은 ID를 가짐 (매칭용)
            // answerPairCount 개수만큼 생성 (2장 또는 3장)
            for (let j = 0; j < answerPairCount; j++) {
                const card = new Card(baseId + i, 0, 0, imagePath, CARD_TYPE.ANSWER_PAIR);
                cards.push(card);
            }
        }

        return cards;
    }

    /**
     * 폭탄 카드 생성 (내부 메서드)
     *
     * @private
     * @param {number} bombCount - 폭탄 카드 개수
     * @returns {Card[]} 폭탄 카드 배열
     */
    _generateBombCards(bombCount) {
        const cards = [];

        // 폭탄 카드는 고유 ID 사용 (3000번대)
        const baseId = 3000;
        const bombImagePath = 'assets/images/cards/bomb.png'; // 폭탄 이미지 경로

        for (let i = 0; i < bombCount; i++) {
            // 각 폭탄 카드는 고유 ID를 가짐 (개별 처리용)
            const card = new Card(baseId + i, 0, 0, bombImagePath, CARD_TYPE.BOMB);
            cards.push(card);
        }

        return cards;
    }

    /**
     * 테마에 따른 이미지 경로 반환
     *
     * @private
     * @param {string} theme - 테마 이름
     * @param {number} count - 필요한 이미지 개수
     * @returns {string[]} 이미지 경로 배열
     */
    _getImagePaths(theme, count) {
        const themes = CARD_THEMES || {};
        const paths = themes[theme] || [];

        // 이미지가 부족하면 플레이스홀더 사용
        if (paths.length < count) {
            console.warn(`Theme '${theme}' has insufficient images. Using placeholders.`);
            return ArrayUtils.range(0, count).map(i =>
                paths[i] || `assets/images/cards/placeholder_${i}.png`
            );
        }

        return paths.slice(0, count);
    }

    /**
     * 카드에 그리드 위치 할당
     *
     * @private
     * @param {Card[]} cards - 카드 배열
     * @param {Object} difficulty - 난이도 설정
     */
    _assignPositions(cards, difficulty) {
        const gridConfig = {
            canvasWidth: CANVAS_CONFIG.width,
            canvasHeight: CANVAS_CONFIG.height,
            cols: difficulty.gridCols,
            rows: difficulty.gridRows,
            cardWidth: this.config.width,
            cardHeight: this.config.height,
            margin: this.config.margin,
            topOffset: 180 // 상단 UI 공간
        };

        const positions = GridCalculator.calculateAllPositions(cards.length, gridConfig);

        cards.forEach((card, index) => {
            const { x, y } = positions[index];
            card.setPosition(x, y);
        });
    }

    /**
     * 특정 좌표의 카드 찾기
     *
     * @param {Card[]} cards - 카드 배열
     * @param {number} x - x 좌표
     * @param {number} y - y 좌표
     * @returns {Card|null} 찾은 카드 또는 null
     */
    findCardAt(cards, x, y) {
        return cards.find(card => card.contains(x, y)) || null;
    }

    /**
     * 뒤집힌 카드 목록 반환
     *
     * @param {Card[]} cards - 카드 배열
     * @returns {Card[]} 뒤집힌 카드들
     */
    getFlippedCards(cards) {
        return cards.filter(card => card.isFlipped && !card.isMatched);
    }

    /**
     * 매칭된 카드 목록 반환
     *
     * @param {Card[]} cards - 카드 배열
     * @returns {Card[]} 매칭된 카드들
     */
    getMatchedCards(cards) {
        return cards.filter(card => card.isMatched);
    }

    /**
     * 모든 카드 리셋
     *
     * @param {Card[]} cards - 카드 배열
     */
    resetAllCards(cards) {
        cards.forEach(card => card.reset());
    }

    /**
     * 카드 이미지 프리로드 (선택)
     * TODO: 손아영 - 이미지 준비 완료 후 구현
     *
     * @param {string[]} imagePaths - 이미지 경로 배열
     * @returns {Promise<void>}
     */
    async preloadImages(imagePaths) {
        const promises = imagePaths.map(path => {
            return new Promise((resolve, reject) => {
                if (typeof loadImage === 'function') {
                    // p5.js loadImage 사용
                    loadImage(path, img => {
                        this.imageCache.set(path, img);
                        resolve(img);
                    }, reject);
                } else {
                    // 브라우저 기본 Image 사용
                    const img = new Image();
                    img.onload = () => {
                        this.imageCache.set(path, img);
                        resolve(img);
                    };
                    img.onerror = reject;
                    img.src = path;
                }
            });
        });

        try {
            await Promise.all(promises);
            console.log(`Preloaded ${promises.length} images`);
        } catch (error) {
            console.error('Failed to preload some images:', error);
        }
    }

    /**
     * 캐시된 이미지 가져오기
     *
     * @param {string} path - 이미지 경로
     * @returns {*|null} 이미지 객체 또는 null
     */
    getCachedImage(path) {
        return this.imageCache.get(path) || null;
    }

    /**
     * 디버그 정보 출력
     *
     * @param {Card[]} cards - 카드 배열
     */
    debugPrint(cards) {
        console.group('Card Deck Debug Info');
        console.log('Total cards:', cards.length);
        console.log('Unique IDs:', new Set(cards.map(c => c.id)).size);
        console.log('Flipped:', this.getFlippedCards(cards).length);
        console.log('Matched:', this.getMatchedCards(cards).length);

        // ID별 그룹화
        const grouped = ArrayUtils.groupBy(cards, card => card.id);
        console.log('Cards by ID:', grouped);

        console.groupEnd();
    }
}

// ES6 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardManager;
}
