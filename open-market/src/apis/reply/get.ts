import { axiosInstance } from "@/utils";

export async function getProductReplies(
	productId?: string,
): Promise<Reply[] | undefined> {
	try {
		const response = await axiosInstance.get(`/replies/products/${productId}`);
		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getUserReplies(): Promise<Reply[] | undefined> {
	try {
		const response = await axiosInstance.get(`/replies`);
		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
