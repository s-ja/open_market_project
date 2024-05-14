import { getProductBookmark } from "@/apis/product/bookmark";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
};

export const useBookMarksSuspenseQuery = ({ productId }: TParams) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["bookmark", { productId }],
		queryFn: () => getProductBookmark(productId),
	});

	return { data, error, isLoading };
};
