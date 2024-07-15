import React from "react";
import "@testing-library/jest-dom";
import { Flashcard } from "../../../../src/types/deck.type";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FlashcardComponent from "../../../../src/components/deck/FlashcardComponent";

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

//Test the Flashcard component
for (let i = 0; i < 3; i++) {
  describe("FlashcardComponent Component", () => {
    const defaultProps = {
      question: flashcards[i].question,
      answer: flashcards[i].answer,
      index: flashcards[i].id - 1,
    };

    //Test the rendering of the component
    it("renders flashcard elements", () => {
      render(<FlashcardComponent {...defaultProps} />);

      expect(screen.getByText(`${defaultProps.question}`)).toBeInTheDocument();
      expect(screen.getByText(`${defaultProps.answer}`)).toBeInTheDocument();
      expect(screen.getByText("My Rating")).toBeInTheDocument();

      const flashcardRating = screen.getByTestId(`flashcard-rating-${i}`);

      expect(flashcardRating).toBeInTheDocument();
    });

    //Test the rating behaviour
    it("Flashcards rating", async () => {
      render(<FlashcardComponent {...defaultProps} />);

      const flashcardRating = screen.getByTestId(`flashcard-rating-${i}`);
      const emptyStars = screen.getByTestId("StarBorderIcon");

      expect(emptyStars).length;

      const starIndex = 4;
      const starWidth = flashcardRating.clientWidth / 5;

      const clickX = starWidth * starIndex - starWidth / 2;
      const clickY = flashcardRating.clientHeight / 2;

      fireEvent.click(flashcardRating, { clientX: clickX, clientY: clickY });

      expect(emptyStars).length;
    });
  });
}
