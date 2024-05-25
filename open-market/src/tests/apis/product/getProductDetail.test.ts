import { getProductDetail } from "@/apis/product/product";
import { axiosInstance } from "@/utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			get: vi.fn(),
		},
	};
});

describe("getProductDetail", () => {
	const productId = "45";

	const productDataMock = {
		_id: productId,
		seller_id: 4,
		price: 3000,
		name: "50글자가넘어갔을때어떻게보일까요50글자가넘어갔을때어떻게보일까요50글자가넘어갔을때어떻게보일까",
		mainImages: [
			{
				name: "YcAxQ-Z4B.jpeg",
				originalname: "KakaoTalk_Photo_2022-12-29-14-02-19.jpeg",
				path: "https://modi-ip3-modi.koyeb.app/api/files/YcAxQ-Z4B.jpeg",
			},
		],
		content: "내이름음짱난.\n어린이탐정이죠.\n호호이",
		buyQuantity: 1,
		createdAt: "2024.04.21 11:22:36",
		extra: {
			sellerName: "제이지",
			isNew: true,
			isBest: true,
			category: "",
			tags: ["신나는"],
			soundFile: {
				duration: 36.3885625,
				name: "fM-aV_I-s.mp3",
				originalname: "sample-oppa (1).mp3",
				path: "https://modi-ip3-modi.koyeb.app/api/files/fM-aV_I-s.mp3",
			},
		},
		replies: [],
		bookmarks: [
			{
				_id: 112,
				user_id: 2,
				product_id: productId,
				memo: "",
				createdAt: "2024.04.21",
			},
		],
	};

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("상품 상세 정보를 불러온다", async () => {
		const mockResponse = {
			data: {
				item: {
					productDataMock,
				},
			},
		};
		axiosInstance.get = vi.fn().mockResolvedValue(mockResponse);

		const result = await getProductDetail(productId);

		expect(result).toEqual(mockResponse.data.item);
		expect(axiosInstance.get).toHaveBeenCalledWith(`/products/${productId}`);
	});

	it("상품 상세 정보를 불러오지 못했을 때 에러가 발생한다.", async () => {
		const mockError = new Error("Network Error");
		axiosInstance.get = vi.fn().mockRejectedValue(mockError);

		await expect(getProductDetail(productId)).rejects.toThrow("Network Error");
		expect(axiosInstance.get).toHaveBeenCalledWith(`/products/${productId}`);
	});
});
