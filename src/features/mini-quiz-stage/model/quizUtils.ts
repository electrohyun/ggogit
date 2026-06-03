import type { MiniQuizChapter, MiniQuizStage } from "@/entities/mini-quiz";
import type { QuizQuestion } from "./types";

export const buildQuizQuestions = (
  chapter: MiniQuizChapter,
  stage: MiniQuizStage
): QuizQuestion[] => {
  const otherCommands = chapter.commands.filter(
    (command) => command !== stage.command
  );
  const fallbackOptions = ["git stash", "git tag", "git diff"];
  const commandOptions = [
    stage.command,
    ...otherCommands,
    ...fallbackOptions,
  ].slice(0, 4);

  return [
    {
      id: "meaning",
      type: "mcq",
      question: `${stage.title}에서 가장 먼저 떠올릴 명령어는 무엇인가요?`,
      description: "이번 스테이지의 핵심 명령어를 골라봐요.",
      options: commandOptions,
      answer: stage.command,
      explanation: `${stage.command}는 이 스테이지의 핵심 명령어예요.`,
    },
    {
      id: "situation",
      type: "mcq",
      question: `언제 ${stage.command}를 사용하면 좋을까요?`,
      description: "명령어는 사용하는 순간과 함께 기억하면 좋아요.",
      options: [
        stage.description,
        "브라우저 캐시를 비울 때 사용해요.",
        "패키지를 설치할 때만 사용해요.",
        "디자인 파일을 내보낼 때 사용해요.",
      ],
      answer: stage.description,
      explanation: "명령어는 상황과 함께 기억하면 더 오래 남아요.",
    },
    {
      id: "flow",
      type: "mcq",
      question: "Git 학습에서 가장 먼저 확인해야 하는 흐름은 무엇인가요?",
      description: "Git이 변경사항을 어떤 단계로 다루는지 떠올려요.",
      options: [
        "작업 디렉터리, 스테이징 영역, 저장소의 관계예요.",
        "브라우저 화면 크기와 색상표의 관계예요.",
        "컴퓨터 전원과 충전기의 관계예요.",
        "파일 이름과 폴더 아이콘의 관계예요.",
      ],
      answer: "작업 디렉터리, 스테이징 영역, 저장소의 관계예요.",
      explanation: "Git은 변경사항이 어디에 있는지 이해하는 것이 중요해요.",
    },
    {
      id: "mistake",
      type: "mcq",
      question: "명령어를 헷갈렸을 때 가장 좋은 태도는 무엇인가요?",
      description: "실수했을 때 바로 삭제하기보다 상태를 먼저 확인해요.",
      options: [
        "상태를 확인하고 다음 행동을 고르면 돼요.",
        "무조건 같은 명령어를 여러 번 입력해요.",
        "에러 메시지는 읽지 않아도 괜찮아요.",
        "저장소를 바로 삭제해요.",
      ],
      answer: "상태를 확인하고 다음 행동을 고르면 돼요.",
      explanation: "Git에서는 현재 상태를 차분히 확인하는 습관이 좋아요.",
    },
    {
      id: "command",
      type: "command",
      question: `${stage.command} 명령어를 직접 입력해요.`,
      description: "앞뒤 공백과 연속 공백은 정리되지만, 명령어는 정확히 입력해요.",
      placeholder: `예: ${stage.command}`,
      answer: stage.command,
      explanation: `${stage.command}를 직접 입력하면 이 스테이지의 핵심 흐름을 익힐 수 있어요.`,
    },
  ];
};

export const normalizeCommand = (command: string) => {
  return command.trim().replace(/\s+/g, " ");
};

export const getQuestionLimit = (question: QuizQuestion) => {
  return question.type === "command" ? 45 : 20;
};

export const getQuestionLimitMs = (question: QuizQuestion) => {
  return getQuestionLimit(question) * 1000;
};

export const getStarCount = (correctCount: number) => {
  if (correctCount >= 5) {
    return 3;
  }

  if (correctCount === 4) {
    return 2;
  }

  if (correctCount === 3) {
    return 1;
  }

  return 0;
};
