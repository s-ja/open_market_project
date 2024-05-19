import { axiosInstance } from "@/utils";

export async function getUserBookmarks() {
	const response = await axiosInstance.get(`/bookmarks`);
	return response.data.item;
}

export async function deleteUserBookmark(bookmarkId: string | number) {
	const response = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
	return response.data;
}

export async function postUserBookmark(
	currentUserId: string | number,
	productId: string | number,
) {
	const response = await axiosInstance.post(`/bookmarks/`, {
		user_id: currentUserId,
		product_id: productId,
		memo: "",
	});
	return response.data;
}
