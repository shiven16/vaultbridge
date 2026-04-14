import { describe, it, expect, vi, beforeEach } from "vitest";
import { listFiles } from "./drive.api";
import apiClient from "../utils/apiClient";

vi.mock("../utils/apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Drive API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list files successfully", async () => {
    const mockData = {
      files: [
        { id: "1", name: "test.pdf", mimeType: "application/pdf", size: "100" },
      ],
      nextPageToken: "token123",
    };

    // @ts-expect-error - mockResolvedValue is safe here
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await listFiles("source");

    expect(apiClient.get).toHaveBeenCalledWith("/sources/files", {
      params: {
        type: "source",
        pageToken: undefined,
        pageSize: 20,
        sourceType: "drive",
      },
    });
    expect(result).toEqual(mockData);
  });
});
