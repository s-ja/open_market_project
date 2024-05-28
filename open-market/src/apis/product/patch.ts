import { axiosInstance } from "@/utils";

export async function patchProductDetail(
	productId?: string,
	newProductDetail?: ProductEditForm,
): Promise<string | undefined> {
	try {
		const response = await axiosInstance.patch(
			`/seller/products/${productId}`,
			newProductDetail,
		);
		return response.data.updated;
	} catch (error) {
		console.error(error);
	}
}
