import { postProductDetail } from "@/apis/product/product";
import { axiosInstance } from "@/utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			post: vi.fn(),
		},
	};
});

describe("postProductDetail", () => {
	const newProductDetail = {
		show: true,
		active: true,
		name: "",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			sellerName: "currentUser.name",
			isNew: true,
			isBest: false,
			category: "",
			tags: [],
			soundFile: { path: "", name: "", originalname: "" },
		},
	};

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should post product detail and return the item", async () => {
		const mockResponse = {
			data: {
				item: {
					id: 1,
					...newProductDetail,
				},
			},
		};

		axiosInstance.post = vi.fn().mockResolvedValue(mockResponse);
		const result = await postProductDetail(newProductDetail);

		expect(result).toEqual(mockResponse.data.item);
		expect(axiosInstance.post).toHaveBeenCalledWith(
			"/seller/products",
			newProductDetail,
		);
	});

	it("should throw an error if the request fails", async () => {
		const mockError = new Error("Network Error");
		axiosInstance.post = vi.fn().mockRejectedValue(mockError);

		await expect(postProductDetail(newProductDetail)).rejects.toThrow(
			"Network Error",
		);
		expect(axiosInstance.post).toHaveBeenCalledWith(
			"/seller/products",
			newProductDetail,
		);
	});
});
