import { ProductRegisterForm, postProductDetail } from "@/apis/product/product";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const usePostProductMutation = () => {
	const navigate = useNavigate();
	const { mutate } = useMutation({
		mutationFn: (newProduct: ProductRegisterForm) =>
			postProductDetail(newProduct),

		onSuccess: (response) => {
			toast.success("상품 등록 성공!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});

			const productId = response._id;

			navigate(`/productmanage/${productId}`);

			localStorage.removeItem("userProductsInfo");
		},

		onError: (error) => {
			if (isAxiosError(error) && error.response) {
				error.response.data.errors.forEach(
					(err: { msg: Renderable | ValueFunction<Renderable, Toast> }) =>
						toast.error(err.msg),
				);
			} else {
				// Axios 에러가 아닌 경우의 처리
				console.error("An unexpected error occurred: ", error);
			}
		},
	});

	return { mutate };
};
