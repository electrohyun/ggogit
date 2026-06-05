<img width="1672" height="941" alt="og" src="https://github.com/user-attachments/assets/a7faaa2c-7a37-415f-94cc-2164b48cb362" />

<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 35 39" src="https://github.com/user-attachments/assets/48627786-54e1-4ccb-a904-d4375dc2748c" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 35 44" src="https://github.com/user-attachments/assets/43b1a21f-91be-4beb-9eb8-17e5de2dea5d" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 35 48" src="https://github.com/user-attachments/assets/94666939-bd9a-42cb-9876-bd57e331feb4" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 36 15" src="https://github.com/user-attachments/assets/00a3baf7-432d-4e70-b1af-1255096e2d0d" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 36 20" src="https://github.com/user-attachments/assets/49423996-94d6-439b-8add-5c56a1db4454" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 36 54" src="https://github.com/user-attachments/assets/cc51728e-8139-490c-bbea-3e9dae0ef731" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 37 01" src="https://github.com/user-attachments/assets/166e52f8-e598-4c1c-9419-52535c5bf80e" />
<img width="1629" height="1121" alt="스크린샷 2026-06-06 오전 2 37 36" src="https://github.com/user-attachments/assets/7b20adbb-a07d-4f0c-af25-ef3c4e776af4" />
<img width="1536" height="1024" alt="ggoggo-credits-group" src="https://github.com/user-attachments/assets/7dedcb05-14e3-4cd3-8299-2bd76cb59abc" />


# 🐤 GGoGit (꼬깃)

> **🎨 꼬깃꼬깃 구겨져도 괜찮아! 그게 우리의 히스토리니까: Git 튜토리얼 게임 '꼬깃(GGoGit)'**

## 🔗 배포 주소

[ggogit.com](https://ggogit.com)

## 📖 프로젝트 소개

새로운 팀에 합류해 처음 Git을 마주할 때의 막막함을 기억하나요? 꼬깃(GGoGit)은 터미널의 까만 화면과 낯선 개념이 두려운 사람들을 위해 만들어진 **게임형 Git 학습 서비스**입니다.

지금의 꼬깃은 미니 퀴즈와 오늘의 챌린지를 통해 Git 개념을 작게 나누어 익히는 데 집중합니다. 문제를 풀고, 별을 모으고, 매일의 퀘스트를 완료하면서 낯선 Git 용어와 흐름을 조금씩 익숙하게 만들어갑니다.

앞으로는 명령어 입력 기반 플레이를 확장해, 직접 Git 명령어를 입력하고 브랜치와 커밋의 변화를 눈으로 확인하는 학습 경험까지 이어갈 예정입니다.

---

## ✨ 주요 기능

- **미니 퀴즈 학습:** 챕터와 스테이지를 선택해 Git 개념 퀴즈를 풀 수 있습니다.
- **오늘의 챌린지:** 매일 하나의 Git 퀴즈 세트에 도전할 수 있습니다.
- **데일리 퀘스트:** 로그인, 커뮤니티 글 작성, 오늘의 챌린지 완료 보상을 제공합니다.
- **커뮤니티:** 방명록, 질문과 답변, 공지사항, 팁 모음을 제공합니다.
- **프로필과 기록:** 로그인 사용자의 콩, 스트릭, 학습 기록, 프로필 정보를 보여줍니다.
- **익명 체험:** 로그인하지 않아도 학습과 커뮤니티를 둘러볼 수 있습니다.
- **사운드 경험:** 배경음과 효과음, 볼륨 설정을 제공합니다.

---

## 🛠 기술 스택

- **Framework:** Next.js 16, React 19
- **Language:** TypeScript
- **Backend:** Supabase
- **State Management:** Zustand
- **Sound:** Howler
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics, 커스텀 이벤트
- **Package Manager:** pnpm

---

## 🚀 Getting Started

로컬 환경에서 꼬깃 프로젝트를 실행하는 방법입니다.

### 1. 저장소 클론

```bash
git clone https://github.com/electrohyun/ggogit.git
```

### 2. 디렉토리 이동

```bash
cd ggogit
```

### 3. 의존성 패키지 설치

```bash
pnpm install
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 🔐 환경 변수

로컬 실행에는 Supabase 환경 변수가 필요합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

배포 환경에서 사이트 URL을 명시하고 싶다면 아래 값을 추가할 수 있습니다.

```bash
NEXT_PUBLIC_SITE_URL=
```

## 📄 라이선스

Copyright © 2026 electrohyun. All rights reserved.

이 저장소의 코드, 디자인, 이미지, 사운드 구성 및 서비스 기획은 별도 허가 없이 복제, 수정, 배포, 상업적/비상업적 재사용할 수 없습니다. 학습 및 포트폴리오 참고 목적의 열람은 가능하지만, 코드 또는 에셋의 재사용이 필요한 경우 사전에 문의해주세요.
