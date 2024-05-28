import { postUserBookmark } from "@/apis/bookmark/post";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => ({
	axiosInstance: {
		post: vi.fn(),
	},
}));
describe("postUserBookmark", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("성공적으로 북마크 데이터를 반환한다", async () => {
		const currentUserId = "123";
		const productId = "123";

		const mockData = {
			item: {
				id: 1,
				user_id: currentUserId,
				product_id: productId,
				memo: "",
			},
		};
		axiosInstance.post = vi.fn().mockResolvedValueOnce({ data: mockData });

		const result = await postUserBookmark(currentUserId, productId);

		expect(axiosInstance.post).toHaveBeenCalledWith(`/bookmarks/`, {
			user_id: currentUserId,
			product_id: productId,
			memo: "",
		});

		expect(result).toEqual(mockData);
	});

	it("요청이 실패하면 에러를 콘솔에 출력하고 undefined를 반환한다", async () => {
		axiosInstance.post = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network Error"));

		const currentUserId = "123";
		const productId = "123";

		console.error = vi.fn();

		const result = await postUserBookmark(currentUserId, productId);

		expect(axiosInstance.post).toHaveBeenCalledWith(`/bookmarks/`, {
			user_id: currentUserId,
			product_id: productId,
			memo: "",
		});

		expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		expect(result).toBeUndefined();
	});
});
