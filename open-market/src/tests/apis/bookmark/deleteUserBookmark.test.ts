import { deleteUserBookmark } from "@/apis/bookmark/delete";
import { axiosInstance } from "@/utils";

vi.mock("@/utils", () => ({
	axiosInstance: {
		delete: vi.fn(),
	},
}));

describe("deleteUserBookmark", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("북마크를 성공적으로 삭제하고 응답 데이터를 반환한다", async () => {
		const mockResponse = { message: "Bookmark deleted successfully" };
		const bookmarkId = 1;

		axiosInstance.delete = vi.fn().mockResolvedValueOnce({
			data: mockResponse,
		});

		const result = await deleteUserBookmark(bookmarkId);

		expect(axiosInstance.delete).toHaveBeenCalledWith(
			`/bookmarks/${bookmarkId}`,
		);
		expect(result).toEqual(mockResponse);
	});

	it("에러가 발생했을 때 에러를 로그하고 undefined를 반환한다", async () => {
		const bookmarkId = 1;

		axiosInstance.delete = vi
			.fn()
			.mockRejectedValueOnce(new Error("Network Error"));

		await expect(deleteUserBookmark(bookmarkId)).resolves.toBeUndefined();
	});
});
