import { getProductBookmark } from "@/apis/product/bookmark";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string | number;
};

export const useBookMarksSuspenseQuery = ({ productId }: TParams) => {
	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["bookmark", productId],
		queryFn: () => getProductBookmark(productId),
	});

	return { data, error, isLoading, refetch };
};
