import { axiosInstance } from "@/utils";

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
