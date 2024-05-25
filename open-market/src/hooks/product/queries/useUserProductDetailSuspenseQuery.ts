import { getUserProductDetail } from "@/apis/product/get";
import { useQuery } from "@tanstack/react-query";

export const useUserProductDetailSuspenseQuery = (productId?: string) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["userProductDetail", productId],
		queryFn: () => getUserProductDetail(productId),
		enabled: productId !== undefined,
	});

	return { data, error, isLoading };
};
