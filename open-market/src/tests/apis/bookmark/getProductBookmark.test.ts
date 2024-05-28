import { getProductBookmark } from "@/apis/bookmark/get";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => ({
	axiosInstance: {
		get: vi.fn(),
	},
}));

describe("getProductBookmark", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("성공적으로 북마크 데이터를 반환한다", async () => {
		const productId = 123;
		const mockBookmark = {
			_id: 1,
			user_id: 1,
			product_id: 123,
			memo: "",
			createdAt: "",
		};

		axiosInstance.get = vi.fn().mockResolvedValueOnce({
			data: { item: mockBookmark },
		});

		const result = await getProductBookmark(productId);

		expect(axiosInstance.get).toHaveBeenCalledWith(
			`/bookmarks/products/${productId}`,
		);
		expect(result).toEqual(mockBookmark);
	});

	it("에러가 발생하면 undefined를 반환하고 콘솔에 에러를 로그한다", async () => {
		const productId = 123;
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		axiosInstance.get = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network Error"));

		const result = await getProductBookmark(productId);

		expect(axiosInstance.get).toHaveBeenCalledWith(
			`/bookmarks/products/${productId}`,
		);
		expect(result).toBeUndefined();
		expect(consoleErrorSpy).toHaveBeenCalled();

		consoleErrorSpy.mockRestore();
	});
});
