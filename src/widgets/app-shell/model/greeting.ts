interface AppShellGreetingParams {
  pathname: string;
  name: string;
}

const getGreetingIndex = (key: string, length: number) => {
  let hash = 0;

  for (const letter of key) {
    hash = (hash * 31 + letter.charCodeAt(0)) % length;
  }

  return hash;
};

const pickGreeting = (greetings: string[], key: string) => {
  return greetings[getGreetingIndex(key, greetings.length)];
};

export const getAppShellGreeting = ({
  pathname,
  name,
}: AppShellGreetingParams) => {
  const greetingKey = `${pathname}:${name}:${new Date().toDateString()}`;

  if (pathname.startsWith("/study")) {
    return pickGreeting(
      [
        `${name}님, 오늘도 한 스테이지씩 차근차근 가볼까요?`,
        `${name}님, 배움의 로그를 하나 남겨볼까요?`,
        `${name}님, 오늘의 Git 감각을 깨워볼 시간이에요.`,
        `${name}님, 작은 커밋처럼 천천히 쌓아봐요.`,
        `${name}님, 막히면 꼬꼬가 옆에서 같이 볼게요.`,
      ],
      greetingKey,
    );
  }

  if (pathname.startsWith("/challenge")) {
    return pickGreeting(
      [
        `${name}님, 오늘의 도전 준비됐나요?`,
        `${name}님, 짧고 굵게 실력을 확인해볼까요?`,
        `${name}님, 이번 도전도 힘차게 달려가요!`,
        `${name}님! 응원하고 있어요!`,
        `${name}님, 오늘의 퀴즈도 화이팅!`,
      ],
      greetingKey,
    );
  }

  if (pathname.startsWith("/community")) {
    return pickGreeting(
      [
        `${name}님, 이야기들을 둘러볼까요?`,
        `${name}님, 다른 친구들은 어떤 생각을 했을까요?`,
        `${name}님, 좋은 질문은 좋은 커밋만큼 소중해요.`,
        `${name}님, 함께 배우는 흔적을 찾아볼까요?`,
        `${name}님, 오늘은 어떤 이야기가 기다릴까요?`,
      ],
      greetingKey,
    );
  }

  if (pathname.startsWith("/profile")) {
    return pickGreeting(
      [
        `${name}님, 정말 잘하고 있어요!`,
        `${name}님, 쌓아온 기록을 한번 살펴볼까요?`,
        `${name}님, 꾸준함이 꽤 근사하게 쌓이고 있어요.`,
        `${name}님, 오늘의 나를 기록해두는 것도 좋아요.`,
        `${name}님, 꼬깃에서의 발자국을 확인해봐요.`,
      ],
      greetingKey,
    );
  }

  return pickGreeting(
    [
      `${name}님! 오늘은 어떤 여정이 펼쳐질까요?`,
      `${name}님, 꼬깃에 온 걸 환영해요.`,
      `${name}님, 오늘도 가볍게 한 걸음 가볼까요?`,
      `${name}님, Git 여정의 다음 장을 열어볼까요?`,
      `${name}님! 꼬꼬가 기다리고 있었어요.`,
    ],
    greetingKey,
  );
};
