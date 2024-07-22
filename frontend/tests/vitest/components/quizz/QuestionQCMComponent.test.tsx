import React from "react";
import "@testing-library/jest-dom";
import { QCM, Answer } from "../../../../src/types/quizz.type";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import QuestionQCM from "../../../../src/components/quizz/QuestionQCM";

const qcm: QCM = {
  id: 1,
  question: "What color is it ?",
  answers: [
    {
      answer: "Orange",
      isValid: true,
    },
    {
      answer: "Green",
      isValid: false,
    },
    {
      answer: "Blue",
      isValid: false,
    },
    {
      answer: "Red",
      isValid: false,
    },
  ],
};

//Test the Deck component
describe("QuestionQCMComponent Component", () => {
  const defaultProps = {
    question: qcm,
    answeredCorrectly: true,
    isSubmitting: false,
  };

  //Test the rendering of the component
  it("renders qcm elements", () => {
    const onAnswerSelect = vi.fn();
    render(<QuestionQCM {...defaultProps} onAnswerSelect={onAnswerSelect} />);

    const qcmQuestion = screen.getByTestId("qcm-question");

    const qcmAnswer1 = screen.getByTestId("qcm-answer-0");
    const qcmAnswer2 = screen.getByTestId("qcm-answer-1");
    const qcmAnswer3 = screen.getByTestId("qcm-answer-2");
    const qcmAnswer4 = screen.getByTestId("qcm-answer-3");

    expect(qcmQuestion).toBeInTheDocument();

    expect(qcmAnswer1).toBeInTheDocument();
    expect(qcmAnswer2).toBeInTheDocument();
    expect(qcmAnswer3).toBeInTheDocument();
    expect(qcmAnswer4).toBeInTheDocument();

    expect(qcmQuestion).toHaveTextContent("What color is it ?");

    expect(qcmAnswer1).toHaveTextContent("Orange");
    expect(qcmAnswer2).toHaveTextContent("Green");
    expect(qcmAnswer3).toHaveTextContent("Blue");
    expect(qcmAnswer4).toHaveTextContent("Red");
  });

  //Test the change on click
  it("calls handleAnswerClick when clicked", () => {
    const onAnswerSelect = vi.fn();
    render(<QuestionQCM {...defaultProps} onAnswerSelect={onAnswerSelect} />);

    const qcmAnswer1 = screen.getByTestId("qcm-answer-0");
    const qcmAnswer2 = screen.getByTestId("qcm-answer-1");
    const qcmAnswer3 = screen.getByTestId("qcm-answer-2");
    const qcmAnswer4 = screen.getByTestId("qcm-answer-3");

    fireEvent.click(qcmAnswer1);

    expect(onAnswerSelect).toHaveBeenCalledWith([
      {
        answer: "Orange",
        isValid: true,
      },
    ]);

    fireEvent.click(qcmAnswer2);

    expect(onAnswerSelect).toHaveBeenCalledWith([
      {
        answer: "Orange",
        isValid: true,
      },
      {
        answer: "Green",
        isValid: false,
      },
    ]);

    expect(qcmAnswer1).toHaveStyle("cursor: pointer");
    expect(qcmAnswer2).toHaveStyle("cursor: pointer");
    expect(qcmAnswer3).toHaveStyle("cursor: pointer");
    expect(qcmAnswer4).toHaveStyle("cursor: pointer");
  });
});
