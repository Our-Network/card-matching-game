/* ====================================
   게임 설정 파일
   담당: 방채민 (난이도 옵션 정의, 점수 시스템 설계)
   ==================================== */

// 게임 난이도 설정
const DIFFICULTY = {
    EASY: {
        name: '하',
        pairs: 6,           // 6쌍 = 12장
        timeLimit: 180,     // 3분
        gridCols: 4,
        gridRows: 3,
        pointsPerMatch: 10,
        timePenalty: 5,     // 실패 시 5초 감점
        color: {
            bg: '#E8F5E9',
            card: '#81C784',
            text: '#2E7D32'
        }
    },
    MEDIUM: {
        name: '중',
        pairs: 8,           // 8쌍 = 16장
        timeLimit: 120,     // 2분
        gridCols: 4,
        gridRows: 4,
        pointsPerMatch: 15,
        timePenalty: 10,
        color: {
            bg: '#FFF3E0',
            card: '#FFB74D',
            text: '#E65100'
        }
    },
    HARD: {
        name: '상',
        pairs: 10,          // 10쌍 = 20장
        timeLimit: 90,      // 1.5분
        gridCols: 5,
        gridRows: 4,
        pointsPerMatch: 20,
        timePenalty: 15,
        color: {
            bg: '#FFEBEE',
            card: '#E57373',
            text: '#C62828'
        }
    },
    HELL: {
        name: '지옥',
        pairs: 15,          // 15쌍 = 30장
        timeLimit: 60,      // 1분
        gridCols: 6,
        gridRows: 5,
        pointsPerMatch: 30,
        timePenalty: 20,
        color: {
            bg: '#212121',
            card: '#D32F2F',
            text: '#FFEBEE'
        }
    }
};

// 캔버스 설정
const CANVAS_CONFIG = {
    width: 1200,
    height: 800,
    backgroundColor: '#FFFFFF'
};

// 카드 설정
const CARD_CONFIG = {
    width: 100,
    height: 140,
    cornerRadius: 10,
    margin: 10,
    backColor: '#424242',
    flipDuration: 300,      // ms
    matchDelay: 500,        // 성공 시 대기
    mismatchDelay: 1000     // 실패 시 대기
};

// 게임 상태
const GAME_STATE = {
    START: 'start',         // 시작 화면
    DIFFICULTY: 'difficulty', // 난이도 선택
    PLAYING: 'playing',     // 게임 중
    RESULT: 'result'        // 결과 화면
};

// TODO (방채민): 점수 계산 공식
// - 기본 점수: 매칭 성공 시 난이도별 점수
// - 보너스: 남은 시간에 비례
// - 콤보: 연속 성공 시 배수 증가
// - 페널티: 실패 시 점수 감점

// TODO (방채민): 카드 테마 이미지 경로
const CARD_THEMES = {
    FRUIT: [
        'assets/images/cards/apple.png',
        'assets/images/cards/banana.png',
        'assets/images/cards/cherry.png',
        // ... 추가 필요
    ],
    COFFEE: [
        // 손아영: 커피 테마 이미지 경로 추가
    ],
    FASHION: [
        // 손아영: 패션 아이템 이미지 경로 추가
    ]
};

// 효과음 경로 (손아영)
const SOUNDS = {
    click: 'assets/sounds/click.mp3',
    match: 'assets/sounds/match.mp3',
    mismatch: 'assets/sounds/mismatch.mp3',
    complete: 'assets/sounds/complete.mp3'
};
