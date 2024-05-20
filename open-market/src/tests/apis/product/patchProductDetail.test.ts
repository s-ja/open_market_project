import { patchProductDetail } from "@/apis/product/product";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			patch: vi.fn(),
		},
	};
});

describe("patchProductDetail", () => {
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
		// 각 테스트가 끝날 때마다 모든 모킹을 초기화합니다.
		vi.clearAllMocks();
	});

	it("should return updated information on successful patch", async () => {
		const productId = "123";
		const responseData = { updated: "Updated Product Name" };

		// axios.patch 메소드가 호출될 때 반환할 응답을 정의합니다.
		axiosInstance.patch = vi.fn().mockResolvedValue({ data: responseData });

		await expect(patchProductDetail(productId, newProductDetail)).resolves.toBe(
			responseData.updated,
		);
	});

	it("should handle an error if the patch request fails", async () => {
		const productId = "123";

		// 네트워크 오류 시뮬레이션을 위해 Promise를 reject합니다.
		axiosInstance.patch = vi.fn().mockRejectedValue(new Error("Network Error"));

		await expect(
			patchProductDetail(productId, newProductDetail),
		).resolves.toBeUndefined();
	});
});
