import { getProductReplies } from "@/apis/product/replies";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
};

export function useProductRepliesQuery({ productId }: TParams) {
	return useQuery({
		queryKey: ["productReplies"],
		queryFn: () => getProductReplies(productId),
		enabled: productId !== undefined,
	});
}
