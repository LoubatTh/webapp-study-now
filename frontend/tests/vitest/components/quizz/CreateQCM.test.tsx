import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateQCM from "../../../../src/components/quizz/CreateQCM";

// Simple mock for useQCMStore
vi.mock("../../../../src/lib/stores/quizzStore", () => ({
  default: () => ({
    saveQCM: vi.fn(),
  }),
}));

//Test the create QCM component
describe("CreateQCM Component", () => {
  const defaultProps = {
    id: 1,
    index: 1,
    qcmsSize: 1,
    collapsed: false,
    onToggleCollapse: vi.fn(),
    onDelete: vi.fn(),
  };

  //Test the rendering of the component
  it("renders form elements", () => {
    render(<CreateQCM {...defaultProps} />);

    expect(screen.getByLabelText(/Question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer 4/i)).toBeInTheDocument();
  });

  //Test the error validation messages
  it("shows validation messages when submitting without values", async () => {
    render(<CreateQCM {...defaultProps} />);

    fireEvent.click(screen.getByText(/Validate QCM/i));

    const validationMessages = await screen.findAllByText(
      /This field is required/i
    );
    expect(validationMessages.length).toBeGreaterThan(0);
    validationMessages.forEach((message) => {
      expect(message).toBeInTheDocument();
    });
  });

  //Test the number of valid answers
  it("calculates the number of valid answers correctly", async () => {
    const { container } = render(<CreateQCM {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Question/i), {
      target: { value: "Sample Question" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 1/i), {
      target: { value: "Answer 1" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 2/i), {
      target: { value: "Answer 2" },
    });
    fireEvent.click(screen.getAllByLabelText(/is a correct answer/i)[0]);

    fireEvent.click(screen.getByText(/Validate QCM/i));

    await waitFor(() => {
      const validAnswers = container.querySelectorAll(
        '[data-valid-answer="true"]'
      ).length;
      expect(validAnswers).toBe(1);
    });
  });
});
