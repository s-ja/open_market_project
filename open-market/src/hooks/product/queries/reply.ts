import { getProductReplies } from "@/apis/product/replies";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
};

export function useProductRepliesQuery({ productId }: TParams) {
	const { data, error, isLoading } = useQuery({
		queryKey: ["productReplies", productId],
		queryFn: () => getProductReplies(productId),
		enabled: productId !== undefined,
	});
	return { data, error, isLoading };
}
