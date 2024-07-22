export const congratulation = (score: number, maxScore: number) => {
  if (score === maxScore) {
    return `<div>Amazing! A perfect score!</div>`;
  } else if ((score / maxScore) * 100 >= 80) {
    return "Very nice job!";
  } else if ((score / maxScore) * 100 >= 50) return "Good job!";
  else return "Keep practicing! You can do it!";
};
