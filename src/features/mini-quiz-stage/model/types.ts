export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "command";
  question: string;
  description: string;
  options?: readonly QuizOption[];
  placeholder?: string;
  answer: string;
  explanation: string;
}
