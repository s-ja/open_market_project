import { axiosInstance } from "@/utils";

export async function getUserBookmarks(
	productId?: string,
): Promise<Bookmark | undefined> {
	try {
		const response = await axiosInstance.get(
			`/bookmarks/products/${productId}`,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}
