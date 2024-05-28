import { getUserBookmarks } from "@/apis/bookmark/get";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => ({
	axiosInstance: {
		get: vi.fn(),
	},
}));

describe("getUserBookmarks", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("성공적으로 북마크 데이터를 반환한다", async () => {
		const mockBookmarks = [
			{ id: 1, name: "Bookmark 1" },
			{ id: 2, name: "Bookmark 2" },
		];

		axiosInstance.get = vi.fn().mockResolvedValueOnce({
			data: { item: mockBookmarks },
		});

		const result = await getUserBookmarks();

		expect(axiosInstance.get).toHaveBeenCalledWith("/bookmarks");
		expect(result).toEqual(mockBookmarks);
	});

	it("에러 발생 시 undefined를 반환하고 콘솔에 에러를 기록한다", async () => {
		axiosInstance.get = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network Error"));

		console.error = vi.fn();
		const result = await getUserBookmarks();
		expect(axiosInstance.get).toHaveBeenCalledWith(`/bookmarks`);

		expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		expect(result).toBeUndefined();
	});
});
