import { axiosInstance } from "@/utils";

export async function getUserProducts(): Promise<Product[] | undefined> {
	const response = await axiosInstance.get(`/seller/products/`);
	return response.data.item;
}

export async function getUserProductsWithPageParam({ pageParam = 1 }) {
	try {
		const { data } = await axiosInstance.get(
			`/seller/products?page=${pageParam}&limit=8`,
		);

		return data;
	} catch (error) {
		console.error("상품 리스트 조회 실패:", error);
		return [];
	}
}
