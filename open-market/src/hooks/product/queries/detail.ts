import { getProductDetail } from "@/apis/product/product";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
};

export const useProductDetailSuspenseQuery = ({ productId }: TParams) => {
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["productdetail", productId],
		queryFn: () => getProductDetail(productId),
		enabled: productId !== undefined,
	});

	return { data, error, isLoading, refetch };
};
