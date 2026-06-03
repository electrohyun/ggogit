import type { MiniQuizChapter } from "./types";

export const MINI_QUIZ_CHAPTERS = [
  {
    id: "git-start",
    title: "Git 시작하기",
    description: "저장소를 만들고 변경사항을 기록할 준비를 해요.",
    commands: ["git init", "git status", "git add"],
    badgeName: "시작의 별",
    isBadgeUnlocked: true,
    stages: [
      {
        id: "init",
        title: "처음 저장소 만들기",
        command: "git init",
        description: "폴더를 Git 저장소로 시작하는 방법을 익혀요.",
        status: "completed",
        starCount: 3,
      },
      {
        id: "status",
        title: "변경사항 살펴보기",
        command: "git status",
        description: "현재 작업 상태와 스테이징 여부를 확인해요.",
        status: "completed",
        starCount: 3,
      },
      {
        id: "add",
        title: "기록할 파일 올리기",
        command: "git add",
        description: "커밋 전에 변경사항을 스테이징 영역에 올려요.",
        status: "available",
        starCount: 0,
      },
    ],
  },
  {
    id: "commit-record",
    title: "기록 남기기",
    description: "커밋으로 작업의 순간을 또렷하게 남겨요.",
    commands: ["git commit", "커밋 메시지", "git log"],
    badgeName: "기록의 도장",
    isBadgeUnlocked: false,
    stages: [
      {
        id: "commit",
        title: "첫 커밋 만들기",
        command: "git commit",
        description: "스테이징된 변경사항을 하나의 기록으로 남겨요.",
        status: "available",
        starCount: 0,
      },
      {
        id: "message",
        title: "메시지 다듬기",
        command: "커밋 메시지",
        description: "변경 이유가 잘 드러나는 커밋 메시지를 써요.",
        status: "locked",
        starCount: 0,
      },
      {
        id: "log",
        title: "기록 되돌아보기",
        command: "git log",
        description: "저장소에 쌓인 커밋 기록을 확인해요.",
        status: "locked",
        starCount: 0,
      },
    ],
  },
  {
    id: "branch-flow",
    title: "가지 나누기",
    description: "브랜치를 만들고 원하는 흐름으로 이동해요.",
    commands: ["git branch", "git switch", "브랜치 흐름"],
    badgeName: "가지 탐험가",
    isBadgeUnlocked: false,
    stages: [
      {
        id: "branch",
        title: "새 가지 만들기",
        command: "git branch",
        description: "작업 흐름을 나눌 브랜치를 만들고 확인해요.",
        status: "available",
        starCount: 0,
      },
      {
        id: "switch",
        title: "가지 바꿔 타기",
        command: "git switch",
        description: "원하는 브랜치로 이동해 작업 위치를 바꿔요.",
        status: "locked",
        starCount: 0,
      },
      {
        id: "branch-model",
        title: "흐름 이해하기",
        command: "브랜치 흐름",
        description: "브랜치가 커밋 위에서 어떻게 움직이는지 익혀요.",
        status: "locked",
        starCount: 0,
      },
    ],
  },
  {
    id: "merge-restore",
    title: "합치고 되돌리기",
    description: "작업을 합치고 실수를 차분하게 되돌려요.",
    commands: ["git merge", "conflict", "git restore"],
    badgeName: "복구의 방패",
    isBadgeUnlocked: false,
    stages: [
      {
        id: "merge",
        title: "작업 합치기",
        command: "git merge",
        description: "다른 브랜치의 작업을 현재 흐름에 합쳐요.",
        status: "available",
        starCount: 0,
      },
      {
        id: "conflict",
        title: "충돌 살펴보기",
        command: "conflict",
        description: "같은 부분이 다르게 바뀌었을 때의 상황을 이해해요.",
        status: "locked",
        starCount: 0,
      },
      {
        id: "restore",
        title: "변경 되돌리기",
        command: "git restore",
        description: "작업 중인 변경사항을 필요한 만큼 되돌려요.",
        status: "locked",
        starCount: 0,
      },
    ],
  },
  {
    id: "remote-repo",
    title: "원격 저장소",
    description: "내 작업을 원격 저장소와 주고받아요.",
    commands: ["git remote", "git push", "git pull"],
    badgeName: "원격 연결 메달",
    isBadgeUnlocked: false,
    stages: [
      {
        id: "remote",
        title: "연결 확인하기",
        command: "git remote",
        description: "현재 저장소와 연결된 원격 저장소를 확인해요.",
        status: "available",
        starCount: 0,
      },
      {
        id: "push",
        title: "작업 올리기",
        command: "git push",
        description: "로컬 커밋을 원격 저장소로 올려요.",
        status: "locked",
        starCount: 0,
      },
      {
        id: "pull",
        title: "작업 가져오기",
        command: "git pull",
        description: "원격 저장소의 새 변경사항을 가져와 합쳐요.",
        status: "locked",
        starCount: 0,
      },
    ],
  },
] as const satisfies readonly MiniQuizChapter[];

export const findMiniQuizStage = (chapterId: string, stageId: string) => {
  const chapter = MINI_QUIZ_CHAPTERS.find((item) => item.id === chapterId);
  const stage = chapter?.stages.find((item) => item.id === stageId);

  if (!chapter || !stage) {
    return null;
  }

  return { chapter, stage };
};
