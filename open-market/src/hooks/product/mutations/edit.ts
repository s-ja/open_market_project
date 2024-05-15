import { patchProductDetail } from "@/apis/product/product";
import { ProductEditForm } from "@/pages/product/ProductEdit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const usePatchProductMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: ({
			productId,
			newProduct,
		}: {
			productId?: string;
			newProduct?: ProductEditForm;
		}) => patchProductDetail(productId, newProduct),

		onMutate: async ({ productId, newProduct }) => {
			// 현재 상태를 저장하여 에러 시 롤백할 수 있게 합니다.
			await queryClient.cancelQueries({
				queryKey: ["userproductdetail", productId],
			});
			const previousProduct = queryClient.getQueryData<ProductEditForm>([
				"productDetail",
				productId,
			]);

			// 낙관적 업데이트를 적용합니다.
			if (newProduct && productId) {
				queryClient.setQueryData(["userproductdetail", productId], {
					...previousProduct,
					...newProduct,
				});
			}

			return { previousProduct };
		},

		onError: (error, variables, context) => {
			if (context?.previousProduct) {
				// 에러 발생 시 이전 상태로 롤백
				queryClient.setQueryData(
					["productDetail", variables.productId],
					context.previousProduct,
				);
			}

			if (isAxiosError(error) && error.response) {
				error.response.data.errors.forEach(
					(err: { msg: Renderable | ValueFunction<Renderable, Toast> }) =>
						toast.error(err.msg),
				);
			} else {
				console.error("An unexpected error occurred: ", error);
			}
		},

		onSuccess: () => {
			toast.success("상품 수정 완료!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});

			navigate(-1);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["productDetail"] });
		},
	});

	return { mutate };
};
