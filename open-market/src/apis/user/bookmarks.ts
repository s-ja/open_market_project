import { axiosInstance } from "@/utils";

export async function getUserBookmarks() {
	const response = await axiosInstance.get(`/bookmarks`);
	return response.data.item;
}

export async function deleteUserBookmark(bookmarkId: string) {
	const response = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
	return response.data;
}
