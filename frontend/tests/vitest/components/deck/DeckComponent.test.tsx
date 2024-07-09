import React from "react";
import "@testing-library/jest-dom";
import { Flashcard } from "../../../../src/types/deck.type";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DeckComponent from "../../../../src/components/deck/DeckComponent";

const flashcards: Flashcard[] = [
  {
    id: 1,
    question: "What color is it ?",
    answer: "Orange",
  },
  {
    id: 2,
    question: "What number is it ?",
    answer: "Two",
  },
  {
    id: 3,
    question: "Capital of France",
    answer: "Paris",
  },
];

//Test the create QCM component
describe("DeckComponent Component", () => {
  const defaultProps = {
    id: 1,
    name: "DeckTest",
    isPublic: true,
    flashcards: flashcards,
  };

  //Test the rendering of the component
  it("renders deck elements", () => {
    render(<DeckComponent {...defaultProps} />);

    expect(screen.getByText(`Deck: ${defaultProps.name}`)).toBeInTheDocument();

    const firstFlashcard = screen.getByTestId("flashcard-0");
    const secondFlashcard = screen.getByTestId("flashcard-1");
    const thirdFlashcard = screen.getByTestId("flashcard-2");

    const firstFlashcardQuestion = screen.getByTestId("flashcard-question-0");
    const secondFlashcardQuestion = screen.getByTestId("flashcard-question-1");
    const thirdFlashcardQuestion = screen.getByTestId("flashcard-question-2");

    const firstFlashcardAnswer = screen.getByTestId("flashcard-answer-0");
    const secondFlashcardAnswer = screen.getByTestId("flashcard-answer-1");
    const thirdFlashcardAnswer = screen.getByTestId("flashcard-answer-2");

    expect(firstFlashcard).toBeInTheDocument();
    expect(secondFlashcard).toBeInTheDocument();
    expect(thirdFlashcard).toBeInTheDocument();

    expect(firstFlashcardQuestion).toBeInTheDocument();
    expect(secondFlashcardQuestion).toBeInTheDocument();
    expect(thirdFlashcardQuestion).toBeInTheDocument();

    expect(firstFlashcardAnswer).toBeInTheDocument();
    expect(secondFlashcardAnswer).toBeInTheDocument();
    expect(thirdFlashcardAnswer).toBeInTheDocument();

    expect(firstFlashcardQuestion).toHaveTextContent("What color is it?");
    expect(secondFlashcardQuestion).toHaveTextContent("What number is it ?");
    expect(thirdFlashcardQuestion).toHaveTextContent("Capital of France");

    expect(firstFlashcardAnswer).toHaveTextContent("Orange");
    expect(secondFlashcardAnswer).toHaveTextContent("Two");
    expect(thirdFlashcardAnswer).toHaveTextContent("Paris");
  });

  //Test the error validation messages
  it("Flashcards turn on click", async () => {
    render(<DeckComponent {...defaultProps} />);

    const firstFlashcard = screen.getByTestId("flashcard-0");
    const secondFlashcard = screen.getByTestId("flashcard-1");
    const thirdFlashcard = screen.getByTestId("flashcard-2");

    const firstFlashcardQuestion = screen.getByTestId("flashcard-question-0");
    const secondFlashcardQuestion = screen.getByTestId("flashcard-question-1");
    const thirdFlashcardQuestion = screen.getByTestId("flashcard-question-2");

    const firstFlashcardAnswer = screen.getByTestId("flashcard-answer-0");
    const secondFlashcardAnswer = screen.getByTestId("flashcard-answer-1");
    const thirdFlashcardAnswer = screen.getByTestId("flashcard-answer-2");

    expect(firstFlashcardQuestion).toBeVisible();
    expect(secondFlashcardQuestion).toBeVisible();
    expect(thirdFlashcardQuestion).toBeVisible();

    expect(firstFlashcardAnswer).not.toBeInvalid();
    expect(secondFlashcardAnswer).not.toBeVisible();
    expect(thirdFlashcardAnswer).not.toBeVisible();

    fireEvent.click(firstFlashcard);
    fireEvent.click(secondFlashcard);
    fireEvent.click(thirdFlashcard);

    expect(firstFlashcardQuestion).not.toBeVisible();
    expect(secondFlashcardQuestion).not.toBeVisible();
    expect(thirdFlashcardQuestion).not.toBeVisible();

    expect(firstFlashcardAnswer).toBeInvalid();
    expect(secondFlashcardAnswer).toBeVisible();
    expect(thirdFlashcardAnswer).toBeVisible();
  });
});
