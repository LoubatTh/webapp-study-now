export type Answer = {
  answer: string;
  isValid: boolean;
};

export type QCM = {
  question: string;
  answers: Answer[];
};

export type Quizz = {
  id: number;
  name: string;
  is_public: boolean;
  qcms: QCM[];
};

export type PostQuizz = {
  name: string;
  is_public: boolean;
  qcms: QCM[];
};

export type Questions = {
  question: {
    id: number;
    question: string;
    answers: Answer[];
  };
  onAnswerSelect: (answers: Answer[]) => void;
  answeredCorrectly?: boolean;
  isSubmitting?: boolean;
};
