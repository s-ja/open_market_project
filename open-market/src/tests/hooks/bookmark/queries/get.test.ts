import { getProductBookmark } from "@/apis/bookmark/get";
import { useBookMarksSuspenseQuery } from "@/hooks/bookmark/queries/useBookMarksSuspenseQuery";
import TestWrapper from "@/tests/Wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import { MockInstance, vi } from "vitest";

vi.mock("@/apis/bookmark/get", () => ({
	getProductBookmark: vi.fn(),
}));

const mockGetProductBookmark = getProductBookmark as unknown as MockInstance;

describe("useBookMarksSuspenseQuery", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return bookmark data successfully", async () => {
		const mockResponse = { _id: 1, name: "Test Bookmark" };
		mockGetProductBookmark.mockResolvedValueOnce(mockResponse);

		const { result } = renderHook(
			() => useBookMarksSuspenseQuery({ productId: 1 }),
			{ wrapper: TestWrapper },
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual(mockResponse);
		expect(result.current.error).toBeNull();
	});
});
