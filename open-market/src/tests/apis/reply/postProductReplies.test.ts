import { postProductReply } from "@/apis/product/replies";
import { axiosInstance } from "@/utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			post: vi.fn(),
		},
	};
});

describe("postReply", () => {
	const newReply = {
		order_id: 0,
		product_id: 0,
		rating: 0,
		content: "",
		extra: {
			profileImage: "",
		},
	};

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("댓글 작성에 성공한다", async () => {
		const mockResponse = {
			data: {
				item: {
					id: 1,
					...newReply,
				},
			},
		};

		axiosInstance.post = vi.fn().mockResolvedValue(mockResponse);
		const result = await postProductReply(newReply);

		expect(result).toEqual(mockResponse.data.item);
		expect(axiosInstance.post).toHaveBeenCalledWith("/replies", newReply);
	});

	it("댓글 작성을 실패한 경우 에러가 발생한다", async () => {
		const mockError = new Error("Network Error");
		axiosInstance.post = vi.fn().mockRejectedValue(mockError);

		await expect(postProductReply(newReply)).rejects.toThrow("Network Error");
		expect(axiosInstance.post).toHaveBeenCalledWith("/replies", newReply);
	});
});
