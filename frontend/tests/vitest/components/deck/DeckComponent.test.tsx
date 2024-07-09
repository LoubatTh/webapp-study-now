import React from "react";
import "@testing-library/jest-dom";
import { Flashcard } from "../../../../src/types/deck.type";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DeckComponent from "../../../../src/components/deck/DeckComponent";

const flashcards: Flashcard[] = [
    {
        1,
        "What color is it ?",
        "orange"
    },
    {

    }
];
  

//Test the create QCM component
describe("DeckComponent Component", () => {
  const defaultProps = {
    id: 1,
    name: "DeckTest",
    isPublic: true,
    flashcards: ,
  };

  //Test the rendering of the component
  it("renders form elements", () => {
    render(<DeckComponent {...defaultProps} />);

    expect(screen.getByLabelText(/Question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer/i)).toBeInTheDocument();
  });

  //Test the error validation messages
  it("shows validation messages when submitting without values", async () => {
    render(<CreateFlashcard {...defaultProps} />);

    fireEvent.click(screen.getByText(/Validate Flashcard/i));

    const validationMessages = await screen.findAllByText(
      /This field is required/i
    );
    expect(validationMessages.length).toBeGreaterThan(0);
    validationMessages.forEach((message) => {
      expect(message).toBeInTheDocument();
    });
  });
});
