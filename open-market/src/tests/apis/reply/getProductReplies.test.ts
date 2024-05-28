import { getProductReplies } from "@/apis/reply/get";
import { axiosInstance } from "@/utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			get: vi.fn(),
		},
	};
});

describe("getProductReplies", () => {
	const productId = "45";

	const repliesDataMock = {
		_id: 0,
		order_id: 0,
		product_id: Number(productId),
		rating: 5,
		content: "",
		createdAt: "",
		user: {
			name: "",
			_id: 0,
		},
		extra: {
			profileImage: "",
		},
	};

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("상품 댓글 정보를 불러온다.", async () => {
		const mockResponse = {
			data: {
				item: {
					repliesDataMock,
				},
			},
		};
		axiosInstance.get = vi.fn().mockResolvedValue(mockResponse);

		const result = await getProductReplies(productId);

		expect(result).toEqual(mockResponse.data.item);
		expect(axiosInstance.get).toHaveBeenCalledWith(
			`/replies/products/${productId}`,
		);
	});

	it("상품 댓글 정보를 불러오지 못했을 때 에러가 발생한다.", async () => {
		const mockError = new Error("Network Error");
		axiosInstance.get = vi.fn().mockRejectedValue(mockError);

		await expect(getProductReplies(productId)).rejects.toThrow("Network Error");
		expect(axiosInstance.get).toHaveBeenCalledWith(
			`/replies/products/${productId}`,
		);
	});
});
