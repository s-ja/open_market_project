import { axiosInstance } from "@/utils";

export async function deleteUserBookmark(bookmarkId: string | number) {
	try {
		const response = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
