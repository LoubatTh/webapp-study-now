import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateFlashcard from "../../../../src/components/deck/CreateFlashcard";

// Simple mock for useDeckStore
vi.mock("../../../../src/lib/stores/deckStore", () => ({
  default: () => ({
    saveFlashcard: vi.fn(),
  }),
}));

//Test the create QCM component
describe("CreateFlashcard Component", () => {
  const defaultProps = {
    id: 1,
    index: 1,
    flashcardsSize: 1,
    collapsed: false,
    onToggleCollapse: vi.fn(),
    onDelete: vi.fn(),
  };

  //Test the rendering of the component
  it("renders form elements", () => {
    render(<CreateFlashcard {...defaultProps} />);

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
