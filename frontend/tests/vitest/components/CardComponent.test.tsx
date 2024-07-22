import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserProvider } from "../../../src/contexts/UserContext";
import { AuthProvider } from "../../../src/contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { Flashcard } from "../../../src/types/deck.type";
import QuizzDeckCard from "../../../src/components/quizzDeckCard";

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

//Test the Card component
describe("CardComponent Component", () => {
  const defaultProps = {
    id: 1,
    Cardname: "CardTest",
    owner: "UserTest",
    tag: "History",
    type: "Deck",
    likes: 290,
    isLiked: true,
    size: 3,
    flashcards: flashcards,
    onDeleteCard: (id: number) => {
      console.log(`Delete card with id: ${id}`);
    },
  };

  //Test the rendering of the component
  it("renders card elements", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserProvider>
            <QuizzDeckCard {...defaultProps} />
          </UserProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const cardName = screen.getByTestId("card-name");
    const cardOwner = screen.getByTestId("card-owner");
    const cardDescription = screen.getByTestId("card-description");
    const cardTag = screen.getByTestId("card-tag");

    expect(cardName).toBeInTheDocument();
    expect(cardOwner).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
    expect(cardTag).toBeInTheDocument();

    expect(cardName).toHaveTextContent("CardTest");
    expect(cardOwner).toHaveTextContent("UserTest");

    expect(cardDescription).toHaveTextContent("of 3 flashcards");
    expect(cardTag).toHaveTextContent("History");
  });
});
