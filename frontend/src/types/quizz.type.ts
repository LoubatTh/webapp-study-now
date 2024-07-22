export type Answer = {
  answer: string;
  isValid: boolean;
};

export type QCM = {
  id: number;
  question: string;
  answers: Answer[];
  collapsed?: boolean;
};

export type PostQCM = {
  question: string;
  answers: Answer[];
};

export type Quizz = {
  id: number;
  name: string;
  type: string;
  tag: string;
  is_public: boolean;
  likes: number;
  qcms: QCM[];
  owner: string;
};

export type PostQuizz = {
  name: string;
  is_public: boolean;
  qcms: QCM[];
  tag_id: number;
};

export type GetQuizzResponse = {
  data: {
    links: {
      first: string;
      last: string;
      next: string | null;
      prev: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
    quizzes: Quizz[];
  };
  status: number;
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
