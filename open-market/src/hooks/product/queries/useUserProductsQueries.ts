import {
	getUserProducts,
	getUserProductsWithPageParam,
} from "@/apis/product/get";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useUserProductsQuery() {
	return useQuery({
		queryKey: ["userProducts"],
		queryFn: () => getUserProducts(),
	});
}

export function useUserProductsInfiniteQuery() {
	return useInfiniteQuery({
		queryKey: ["userProductsInfinite"],
		queryFn: getUserProductsWithPageParam,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
}
