import { getProductListWithPageParam } from "@/apis/product/get";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useProductListInfiniteQuery() {
	return useInfiniteQuery({
		queryKey: ["products"],
		queryFn: getProductListWithPageParam,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
}
