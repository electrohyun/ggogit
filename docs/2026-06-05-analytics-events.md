# Analytics 이벤트 설계

## 목적

- Vercel Analytics 기본 pageview에 더해, 익명 사용자가 게스트 또는 로그인 사용자로 전환되는 핵심 지점을 파악한다.
- v0.5에서는 모든 클릭을 추적하지 않고, 제품 판단에 필요한 최소 이벤트만 기록한다.
- 개인정보를 이벤트 속성에 넣지 않는다.

## 원칙

- 이벤트는 행동 단위로 짧고 명확하게 이름 짓는다.
- 이벤트 이름은 snake_case를 사용한다.
- userId, email, nickname, guestSessionId, IP, 자유 입력 텍스트는 보내지 않는다.
- 페이지, 모드, 행동 종류, 콘텐츠 종류처럼 개인을 식별하지 않는 값만 보낸다.
- 실패 원인을 추적할 때도 원문 에러 메시지 대신 `reason` enum을 사용한다.

## 추적 대상

### 인증 유도 모달

- `auth_prompt_shown`
  - 익명 사용자가 저장, 보상 수령, 작성 같은 보호된 행동을 시도해 인증 유도 모달이 표시될 때 기록한다.
  - 속성:
    - `reason`: `save_progress` | `claim_reward` | `write_community` | `react_community`
    - `source`: `study` | `challenge` | `daily_quest` | `community`

- `guest_start_clicked`
  - 인증 유도 모달에서 게스트 시작을 선택할 때 기록한다.
  - 속성:
    - `source`: `study` | `challenge` | `daily_quest` | `community` | `header`

- `login_clicked`
  - 인증 유도 모달이나 헤더 CTA에서 소셜 로그인을 선택할 때 기록한다.
  - 속성:
    - `source`: `study` | `challenge` | `daily_quest` | `community` | `header`

### 익명 보호 행동 시도

- `anonymous_save_attempt`
  - 익명 사용자가 스테이지 또는 챌린지 결과 저장이 필요한 순간에 도달할 때 기록한다.
  - 속성:
    - `mode`: `study` | `challenge`
    - `chapterId`: 학습 모드일 때만 사용
    - `stageId`: 학습 모드일 때만 사용

- `anonymous_reward_attempt`
  - 익명 사용자가 데일리 퀘스트 보상 수령을 시도할 때 기록한다.
  - 속성:
    - `source`: `daily_quest`

- `anonymous_community_write_attempt`
  - 익명 사용자가 커뮤니티 글 또는 댓글 작성을 시도할 때 기록한다.
  - 속성:
    - `target`: `post` | `comment`
    - `board`: `guestbook` | `question`

- `anonymous_community_react_attempt`
  - 익명 사용자가 커뮤니티 반응을 시도할 때 기록한다.
  - 속성:
    - `target`: `question`

## 보류 이벤트

아래 이벤트는 추후 필요성이 확인되면 추가한다.

- 모든 버튼 클릭 추적
- 모든 페이지 내부 링크 클릭 추적
- 사운드 토글/볼륨 조절 추적
- 문제별 정답/오답 상세 추적
- 커뮤니티 게시글별 상세 조회 추적

## 구현 위치

- 공통 유틸: `src/shared/lib/analytics`
- 인증 유도 모달: 모달 표시 시점과 버튼 클릭 시점
- 학습/챌린지 결과: 익명 상태에서 저장이 필요한 순간
- 데일리 퀘스트: 익명 상태에서 보상 수령 버튼 클릭 시점
- 커뮤니티: 익명 상태에서 작성/댓글/반응 시도 시점

## 검증 기준

- `pnpm lint` 또는 프로젝트에서 사용하는 pnpm 버전의 lint가 통과해야 한다.
- `pnpm build` 또는 프로젝트에서 사용하는 pnpm 버전의 build가 통과해야 한다.
- 이벤트 속성에 개인정보가 포함되지 않았는지 코드 리뷰에서 확인한다.
