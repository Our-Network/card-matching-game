# Documentation Index

Card Matching Game의 전체 문서 목록입니다.

## 📚 문서 목록

### 사용자 문서

#### [User Guide](USER_GUIDE.md)
게임 사용자를 위한 완벽한 가이드입니다.

**내용**:
- 게임 소개 및 주요 특징
- 빠른 시작 가이드
- 게임 방법 및 규칙
- 난이도별 가이드 (하, 중, 상)
- 점수 시스템 상세 설명
- 키보드 단축키
- 팁과 전략
- 문제 해결 (FAQ)

**대상**: 게임 플레이어

---

### 개발자 문서

#### [API Reference](API_REFERENCE.md)
전체 클래스 및 함수 API 레퍼런스입니다.

**내용**:
- Core Layer (Card, GameState)
- Logic Layer (CardManager, GameManager)
- Rendering Layer (CardRenderer, UIRenderer, ParticleSystem)
- Utils Layer (EventEmitter, Logger, ArrayUtils, GridCalculator)
- 전역 설정 객체 (DIFFICULTY, CARD_CONFIG, GAME_STATE)
- 디버그 함수
- 타입 정의

**대상**: 개발자, API 사용자

#### [Architecture](ARCHITECTURE.md)
시스템 아키텍처 및 설계 문서입니다.

**내용**:
- 시스템 개요 및 설계 원칙
- 아키텍처 패턴 (Layered Architecture, MVC-Like, Event-Driven)
- 레이어 구조 (Config, Core, Logic, Rendering, Main)
- 데이터 흐름 (게임 시작, 카드 클릭, 매칭 플로우)
- 상태 관리 전략
- 이벤트 시스템
- 컴포넌트 다이어그램 (Mermaid)
- 확장성 및 유지보수성
- 성능 최적화

**대상**: 시스템 아키텍트, 개발자

#### [Developer Guide](DEVELOPER_GUIDE.md)
프로젝트 개발을 위한 종합 가이드입니다.

**내용**:
- 개발 환경 설정
- 프로젝트 구조 상세 설명
- 개발 워크플로우
- 코딩 규칙 (JavaScript, HTML, CSS)
- 테스팅 (수동, 자동)
- 디버깅 도구 및 기법
- 성능 최적화
- 배포 가이드
- 확장 개발 가이드

**대상**: 프로젝트 개발자

#### [Contributing Guide](CONTRIBUTING.md)
프로젝트 기여 방법을 안내합니다.

**내용**:
- 행동 강령
- 시작하기 (Fork, Clone, Setup)
- 기여 방법 (버그 수정, 기능 추가, 문서 개선)
- 개발 워크플로우
- 코드 스타일 가이드
- 커밋 규칙 (Conventional Commits)
- Pull Request 가이드
- 이슈 리포팅 (버그, 기능 제안, 질문)
- 커뮤니티 및 연락처

**대상**: 오픈소스 기여자

---

### 디자인 문서

#### [Design Guide](../DESIGN_GUIDE.md)
디자인 시스템 및 스타일 가이드입니다.

**내용**:
- 디자인 컨셉 (Soft Toy / Plushie Aesthetic)
- 컬러 팔레트 (메인, 버튼, 카드, 캐릭터)
- 타이포그래피 (폰트, 크기, 스타일)
- UI 컴포넌트 (곰 캐릭터, 알약 버튼, 카드, 장식 요소)
- 애니메이션 (카드, 호버, UI)
- 레이아웃 (시작 화면, 난이도 선택, 게임 화면, 결과 화면)
- 인터랙션 가이드
- 반응형 디자인
- 접근성
- 성능 최적화
- 디자인 토큰

**대상**: 디자이너, 프론트엔드 개발자

---

### 프로젝트 문서

#### [README](../README.md)
프로젝트 개요 및 빠른 시작 가이드입니다.

**내용**:
- 프로젝트 소개
- 주요 특징
- 빠른 시작 (실행 방법)
- 게임 방법
- 난이도별 특징
- 키보드 단축키
- 디자인 시스템
- 프로젝트 구조
- 기술 스택
- 개발 로드맵
- 기여 방법
- 라이선스
- 제작진

**대상**: 모든 사용자

#### [Project Overview](../PROJECT_OVERVIEW.md)
프로젝트 기획 및 개요 문서입니다.

**내용**:
- 프로젝트 목표
- 기술적 도전 과제
- 설계 결정
- 향후 계획

**대상**: 프로젝트 매니저, 팀원

#### [Improvement Roadmap](../IMPROVEMENT_ROADMAP.md)
개선 계획 및 로드맵입니다.

**내용**:
- 개선 우선순위
- 향후 기능
- 기술 부채

**대상**: 개발팀, 프로젝트 매니저

---

## 🗺️ 문서 탐색 가이드

### 처음 시작하는 경우

1. **게임 플레이어**: [User Guide](USER_GUIDE.md) → [README](../README.md)
2. **개발자**: [Developer Guide](DEVELOPER_GUIDE.md) → [API Reference](API_REFERENCE.md) → [Architecture](ARCHITECTURE.md)
3. **디자이너**: [Design Guide](../DESIGN_GUIDE.md)
4. **오픈소스 기여자**: [Contributing Guide](CONTRIBUTING.md)

### 특정 작업별 문서

#### 🎮 게임 플레이
- 게임 방법을 배우고 싶다면: [User Guide](USER_GUIDE.md)
- 높은 점수를 얻고 싶다면: [User Guide - 점수 시스템](USER_GUIDE.md#점수-시스템)
- 전략과 팁을 알고 싶다면: [User Guide - 팁과 전략](USER_GUIDE.md#팁과-전략)

#### 🛠️ 개발 및 확장
- 프로젝트 설정: [Developer Guide - 개발 환경 설정](DEVELOPER_GUIDE.md#개발-환경-설정)
- API 사용법: [API Reference](API_REFERENCE.md)
- 새로운 기능 추가: [Developer Guide - 확장 개발 가이드](DEVELOPER_GUIDE.md#확장-개발-가이드)
- 버그 수정: [Developer Guide - 디버깅](DEVELOPER_GUIDE.md#디버깅)

#### 🏗️ 아키텍처 이해
- 시스템 구조: [Architecture - 레이어 구조](ARCHITECTURE.md#레이어-구조)
- 데이터 흐름: [Architecture - 데이터 흐름](ARCHITECTURE.md#데이터-흐름)
- 이벤트 시스템: [Architecture - 이벤트 시스템](ARCHITECTURE.md#이벤트-시스템)

#### 🎨 디자인 작업
- 디자인 시스템: [Design Guide](../DESIGN_GUIDE.md)
- 컬러 팔레트: [Design Guide - 컬러 팔레트](../DESIGN_GUIDE.md#컬러-팔레트)
- UI 컴포넌트: [Design Guide - UI 컴포넌트](../DESIGN_GUIDE.md#ui-컴포넌트)

#### 🤝 프로젝트 기여
- 기여 시작하기: [Contributing Guide](CONTRIBUTING.md)
- 코드 스타일: [Contributing Guide - 코드 스타일 가이드](CONTRIBUTING.md#코드-스타일-가이드)
- Pull Request: [Contributing Guide - Pull Request 가이드](CONTRIBUTING.md#pull-request-가이드)

---

## 📖 문서 업데이트

문서는 프로젝트와 함께 지속적으로 업데이트됩니다.

### 최근 업데이트

- **2024-01-15**: 전체 문서 생성
  - API Reference
  - Architecture
  - User Guide
  - Developer Guide
  - Contributing Guide

### 문서 기여

문서 개선에 기여하고 싶으시다면:

1. 오타나 오류 발견 시 [이슈 생성](https://github.com/your-org/card-matching-game/issues)
2. 설명 추가 또는 개선 제안
3. 새로운 예제 코드 작성
4. [Contributing Guide](CONTRIBUTING.md)를 참고하여 Pull Request 생성

---

## 💡 도움이 필요하신가요?

- **버그 리포트**: [GitHub Issues](https://github.com/your-org/card-matching-game/issues)
- **기능 제안**: [GitHub Issues](https://github.com/your-org/card-matching-game/issues)
- **일반 질문**: [GitHub Discussions](https://github.com/your-org/card-matching-game/discussions)
- **문서 피드백**: [Issues - Documentation](https://github.com/your-org/card-matching-game/issues?q=label%3Adocumentation)

---

## 📄 라이선스

모든 문서는 프로젝트와 동일한 [MIT License](../LICENSE)를 따릅니다.

---

**Happy Reading! 📚**
