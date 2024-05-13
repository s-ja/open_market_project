import { deleteProductDetail } from "@/apis/product/product";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteProductMutation = () => {
	const { mutate } = useMutation({
		mutationFn: (productId?: string) => deleteProductDetail(productId),

		onSuccess: () => {
			toast.success("상품 삭제 완료", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},

		onError: (error) => {
			console.error(error);
		},
	});

	return { mutate };
};
