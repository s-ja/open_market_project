import { axiosInstance } from "@/utils";

export async function deleteProductDetail(productId?: string) {
	try {
		const response = await axiosInstance.delete(
			`/seller/products/${productId}`,
		);

		return response;
	} catch (error) {
		console.error(error);
	}
}
