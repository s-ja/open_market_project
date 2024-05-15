import { getUserProductDetail } from "@/apis/user/product";
import { useQuery } from "@tanstack/react-query";

export const useUserProductDetailSuspenseQuery = (productId?: string) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["userproductdetail", productId],
		queryFn: () => getUserProductDetail(productId),
		enabled: productId !== undefined,
	});

	return { data, error, isLoading };
};
