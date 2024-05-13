import { axiosInstance } from "@/utils";

export async function getUserProductDetail(productId?: string) {
	try {
		const response = await axiosInstance.get<ProductResponse>(
			`/seller/products/${productId}`,
		);
		return response.data.item;
	} catch (error) {
		console.error("상품 정보 조회 실패:", error);
	}
}
