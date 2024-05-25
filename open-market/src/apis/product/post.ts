import { axiosInstance } from "@/utils";

export async function postProductDetail(newProductDetail: ProductRegisterForm) {
	try {
		const response = await axiosInstance.post(
			`/seller/products`,
			newProductDetail,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
