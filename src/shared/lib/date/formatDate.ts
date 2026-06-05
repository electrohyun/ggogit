const DEFAULT_TIME_ZONE = "Asia/Seoul";

export const formatDateWithDots = (
  dateValue: string,
  timeZone = DEFAULT_TIME_ZONE,
) => {
  const date = new Date(dateValue);
  const dateParts = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = dateParts.find((part) => part.type === "year")?.value ?? "";
  const month = dateParts.find((part) => part.type === "month")?.value ?? "";
  const day = dateParts.find((part) => part.type === "day")?.value ?? "";

  return `${year}.${month}.${day}`;
};
