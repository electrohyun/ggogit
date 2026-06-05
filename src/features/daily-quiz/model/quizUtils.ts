export const normalizeCommand = (command: string) => {
  return command.trim().replace(/\s+/g, " ");
};

export const formatElapsedTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const calculateScore = (correctCount: number, elapsedMs: number) => {
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const speedBonus = Math.max(0, 300 - elapsedSeconds * 3);

  return correctCount * 200 + speedBonus;
};
