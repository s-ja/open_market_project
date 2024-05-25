import { axiosInstance } from "@/utils";

export async function getProductOrder(productId?: string) {
	try {
		if (productId === undefined) {
			throw new Error("productId is required");
		}
		const response = await axiosInstance.get<OrderListResponse>(`/orders`);
		const userOrder = response.data.item.find(
			(order) => order.products[0]._id === +productId,
		);

		return userOrder;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getUserOrders(): Promise<Order[] | undefined> {
	const response = await axiosInstance.get(`/orders`);
	return response.data.item;
}

export async function getUserOrdersWithPageParam({ pageParam = 1 }) {
	try {
		const { data } = await axiosInstance.get(
			`/orders?page=${pageParam}&limit=8`,
		);

		return data;
	} catch (error) {
		console.error(error);
	}
}
