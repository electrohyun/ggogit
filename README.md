<p align="center">
  <img width="400" height="400" alt="ChatGPT Image 2026년 5월 11일 오후 04_47_16" src="https://github.com/user-attachments/assets/a9ac7043-3a66-48ab-9772-58d2524aa969" />
</p>


# 🐤 GGoGit (꼬깃)

> **🎨 꼬깃꼬깃 구겨져도 괜찮아! 그게 우리의 히스토리니까: Git 튜토리얼 게임 '꼬깃(GGoGit)'**

## 🔗 배포 주소

[ggogit.com](https://ggogit.com)

## 📖 프로젝트 소개

새로운 팀에 합류해 처음 Git을 마주할 때의 막막함을 기억하나요? '꼬깃(GGoGit)'은 터미널의 까만 화면이 두려운 사람들을 위해 만들어진 **인터랙티브 Git 시각화 웹 게임**입니다. 명령어를 칠 때마다 즉각적으로 반응하는 시각화된 트리를 통해, 코드를 날려먹고 에러를 내는 모든 삽질의 과정이 결국 훌륭한 성장의 기록(History)으로 남는다는 것을 직관적으로 배울 수 있습니다.

---

## ✨ 주요 기능

- **실시간 커밋 트리 시각화 (Interactive DAG):** 터미널 창에 `git commit`, `git branch`를 입력하면 화면 중앙에 커밋 노드가 실시간으로 가지를 치며 렌더링됩니다.
- **클라이언트 모의 깃 엔진 (Mock Git Engine):** 실제 저장소를 망칠 걱정 제로! 브라우저 메모리상에서 독립적으로 작동하는 깃 엔진을 통해 마음껏 명령어 입력과 취소를 실험해 볼 수 있습니다.
- **충돌 및 에러 시뮬레이션:** `Merge Conflict`나 잘못된 명령어(예: 존재하지 않는 브랜치로 체크아웃) 입력 시, 친절한 피드백을 통해 자연스럽게 트러블슈팅을 경험합니다.

---

## 🛠 기술 스택

프론트엔드 환경에서 텍스트 파싱과 복잡한 상태 관리를 통제하여, 브라우저만으로 동작하는 가벼우면서도 강력한 애플리케이션을 지향합니다.

- **Framework:** React
- **State Management:** Zustand (복잡한 Git History 트리 및 활성화된 브랜치 상태의 전역 제어)
- **Visualization:** HTML5 Canvas (비순환 방향 그래프 렌더링 및 노드 애니메이션 최적화)
- **Styling:** Framer Motion (부드러운 UI 전환 및 시각적 피드백)

---

## 🚀 Getting Started

로컬 환경에서 꼬깃 프로젝트를 실행하는 방법입니다.

### 1. 저장소 클론

```bash
$ git clone [https://github.com/](https://github.com/)[본인 깃허브 아이디]/ggogit.git
```

### 2. 디렉토리 이동

```bash
$ cd ggogit
```

### 3. 의존성 패키지 설치

```bash
$ pnpm install
```

### 4. 개발 서버 실행

```bash
$ pnpm dev
```
