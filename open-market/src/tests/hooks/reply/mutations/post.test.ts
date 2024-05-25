import { postProductReply } from "@/apis/product/replies";
import { useProductRepliesQuery } from "@/hooks/product/queries/reply";
import { usePostReplyMutation } from "@/hooks/reply/mutations/usePostReplyMutation";
import TestWrapper from "@/tests/Wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { MockInstance, vi } from "vitest";

vi.mock("@/apis/product/replies", () => ({
	...vi.importActual("@/apis/product/replies"),
	postProductReply: vi.fn(),
}));

const mockPostProductReply = postProductReply as unknown as MockInstance;

describe("usePostReplyMutation", () => {
	const mockProductId = "45";
	const mockReply = {
		order_id: 0,
		product_id: Number(mockProductId),
		rating: 5,
		content: "정말 좋네요!",
		extra: {
			profileImage: "",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("댓글 작성이 성공하면, 성공했다는 toast가 보여지고, 쿼리 데이터가 업데이트된다.", async () => {
		mockPostProductReply.mockResolvedValueOnce(mockReply);

		const toastSuccessSpy = vi.spyOn(toast, "success");

		const { result: mutationResult } = renderHook(
			() => usePostReplyMutation({ productId: mockProductId }),
			{
				wrapper: TestWrapper,
			},
		);

		const { result: queryResult } = renderHook(
			() => useProductRepliesQuery({ productId: mockProductId }),
			{ wrapper: TestWrapper },
		);

		await waitFor(async () => {
			mutationResult.current.mutate(mockReply);
		});

		expect(toastSuccessSpy).toHaveBeenCalledWith(
			"댓글을 작성했습니다.",
			expect.anything(),
		);

		await waitFor(() => {
			expect(queryResult.current.data).toContainEqual(mockReply);
		});
	});

	it("댓글 작성이 실패하면, 에러를 console.error()로 확인할 수 있다", async () => {
		mockPostProductReply.mockRejectedValueOnce(new Error("Network Error"));

		const consoleErrorSpyOn = vi.spyOn(console, "error");

		const { result: mutationResult } = renderHook(
			() => usePostReplyMutation({ productId: mockProductId }),
			{
				wrapper: TestWrapper,
			},
		);

		await waitFor(async () => {
			mutationResult.current.mutate(mockReply);
		});

		expect(consoleErrorSpyOn).toHaveBeenCalled();
	});
});
