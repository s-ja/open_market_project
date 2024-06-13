import { axiosInstance } from "@/utils";

export async function getProductDetail(
	productId?: string,
): Promise<Product | undefined> {
	try {
		const response = await axiosInstance.get<ProductResponse>(
			`/products/${productId}`,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

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

export async function getProductListWithPageParam({ pageParam = 1 }) {
	try {
		const { data } = await axiosInstance.get(
			`/products?page=${pageParam}&limit=4`,
		);
		return data;
	} catch (error) {
		console.error("Error fetching products:", error);
		throw error;
	}
}
