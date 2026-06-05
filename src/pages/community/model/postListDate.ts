const COMMUNITY_TIME_ZONE = "Asia/Seoul";

const getDateParts = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    timeZone: COMMUNITY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export const isCommunityPostCreatedToday = (dateValue: string) =>
  getDateParts(new Date(dateValue)) === getDateParts(new Date());

export const formatCommunityPostListDate = (dateValue: string) => {
  if (!isCommunityPostCreatedToday(dateValue)) {
    const date = new Date(dateValue);
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone: COMMUNITY_TIME_ZONE,
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const day = parts.find((part) => part.type === "day")?.value ?? "";

    return `${month}.${day}`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: COMMUNITY_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateValue));
};
