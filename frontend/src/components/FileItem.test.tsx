import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FileItem from "./FileItem";
import type { DriveFile } from "../api/drive.api";

describe("FileItem Component", () => {
  const mockFile: DriveFile = {
    id: "test-doc-id",
    name: "Important Document.pdf",
    mimeType: "application/pdf",
    size: "1048576", // 1MB
  };

  it("renders file details correctly", () => {
    render(<FileItem file={mockFile} isSelected={false} onToggle={() => {}} />);

    expect(screen.getByText("Important Document.pdf")).toBeInTheDocument();
    expect(screen.getByText("1.0 MB")).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggleMock = vi.fn();
    render(
      <FileItem file={mockFile} isSelected={false} onToggle={onToggleMock} />,
    );

    // Click on the entire container
    fireEvent.click(screen.getByText("Important Document.pdf"));
    expect(onToggleMock).toHaveBeenCalledWith(mockFile);
  });

  it("shows as checked when selected", () => {
    render(<FileItem file={mockFile} isSelected={true} onToggle={() => {}} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
});
