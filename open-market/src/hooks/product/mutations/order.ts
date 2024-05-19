import { postProductOrder } from "@/apis/product/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function usePostProductOrderMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (productId: string) => postProductOrder(productId),

		onSuccess: (data) => {
			if (data?.ok) {
				queryClient.invalidateQueries({ queryKey: ["productorder"] });
				toast.success("구매 완료!", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
				navigate(`/orders`);
			} else {
				toast.error("구매하지 못했습니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
			}
		},

		onError: (error) => {
			toast.error("구매하지 못했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			console.error(error);
		},
	});

	return { mutate };
}
