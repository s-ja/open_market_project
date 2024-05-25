import { axiosInstance } from "@/utils";

export async function deleteUserBookmark(bookmarkId: string | number) {
	const response = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
	return response.data;
}