import { patchProductDetail } from "@/apis/product/product";
import { ProductEditForm } from "@/pages/product/ProductEdit";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const usePatchProductMutation = () => {
	const navigate = useNavigate();
	const { mutate } = useMutation({
		mutationFn: ({
			productId,
			newProduct,
		}: {
			productId?: string;
			newProduct?: ProductEditForm;
		}) => patchProductDetail(productId, newProduct),

		onSuccess: () => {
			toast.success("상품 수정 완료!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});

			navigate(-1);
		},

		onError: (error) => {
			if (isAxiosError(error) && error.response) {
				error.response.data.errors.forEach(
					(err: { msg: Renderable | ValueFunction<Renderable, Toast> }) =>
						toast.error(err.msg),
				);
			} else {
				console.error("An unexpected error occurred: ", error);
			}
		},
	});

	return { mutate };
};
