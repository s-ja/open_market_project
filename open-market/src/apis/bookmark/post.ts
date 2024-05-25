import { axiosInstance } from "@/utils";

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
