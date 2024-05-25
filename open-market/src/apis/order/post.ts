import { axiosInstance } from "@/utils";

export async function postProductOrder(productId: string) {
	try {
		const response = await axiosInstance.post<OrderResponse>("/orders", {
			products: [
				{
					_id: parseInt(productId),
					quantity: 1,
				},
			],
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
