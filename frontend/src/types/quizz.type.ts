export type Answer = {
  answer: string;
  isValid: boolean;
};

export type QCM = {
  id: number;
  question: string;
  answers: Answer[];
};

export type Quizz = {
  id: number;
  name: string;
  qcms: QCM[];
};
