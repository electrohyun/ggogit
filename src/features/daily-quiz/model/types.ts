export interface ChallengeQuestion {
  id: string;
  type: "mcq" | "command";
  question: string;
  description: string;
  options?: readonly string[];
  placeholder?: string;
  answer: string;
  explanation: string;
}
