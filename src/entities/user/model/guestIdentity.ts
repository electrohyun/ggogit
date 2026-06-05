export const GUEST_ENTRY_COOKIE = "ggogit_entry";
export const GUEST_SESSION_ID_COOKIE = "ggogit_guest_session_id";
export const GUEST_NAME_COOKIE = "ggogit_guest_name";

const GUEST_SESSION_ID_STORAGE_KEY = GUEST_SESSION_ID_COOKIE;
const GUEST_NAME_STORAGE_KEY = GUEST_NAME_COOKIE;

const GUEST_NAME_MODIFIERS = [
  "불꽃코딩하는",
  "차분히커밋하는",
  "야무지게푸시하는",
  "오늘도배우는",
  "브랜치마스터",
  "신중히머지하는",
];

const GUEST_NAME_CHARACTERS = [
  "꼬꼬",
  "깃초보",
  "커밋러",
  "브랜처",
  "머지장인",
  "로그탐험가",
];

export interface GuestIdentity {
  guestSessionId: string;
  guestName: string;
}

interface GetOrCreateGuestIdentityParams {
  guestSessionId?: string;
  guestName?: string;
}

const getRandomItem = (items: string[]) => {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

export const createGuestSessionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createGuestName = () => {
  const modifier = getRandomItem(GUEST_NAME_MODIFIERS);
  const character = getRandomItem(GUEST_NAME_CHARACTERS);
  const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  return `${modifier} ${character} ${suffix}`;
};

export const getOrCreateGuestIdentity = ({
  guestSessionId: preferredGuestSessionId,
  guestName: preferredGuestName,
}: GetOrCreateGuestIdentityParams = {}): GuestIdentity => {
  const storedGuestSessionId = localStorage.getItem(
    GUEST_SESSION_ID_STORAGE_KEY,
  );
  const storedGuestName = localStorage.getItem(GUEST_NAME_STORAGE_KEY);
  const guestSessionId =
    preferredGuestSessionId ?? storedGuestSessionId ?? createGuestSessionId();
  const guestName = preferredGuestName ?? storedGuestName ?? createGuestName();

  if (storedGuestSessionId !== guestSessionId) {
    localStorage.setItem(GUEST_SESSION_ID_STORAGE_KEY, guestSessionId);
  }

  if (storedGuestName !== guestName) {
    localStorage.setItem(GUEST_NAME_STORAGE_KEY, guestName);
  }

  return {
    guestSessionId,
    guestName,
  };
};
