import { axiosInstance } from "@/utils";
// import { useNavigate } from "react-router-dom";

export async function getProductDetail(
	productId?: string,
): Promise<Product | undefined> {
	// const navigate = useNavigate();

	try {
		const response = await axiosInstance.get<ProductResponse>(
			`/products/${productId}`,
		);

		return response.data.item;
	} catch (error) {
		// if (error instanceof AxiosError && error.response?.status === 404) {
		// 	return navigate("/err404", { replace: true });
		// }
		console.error(error);
	}
}
