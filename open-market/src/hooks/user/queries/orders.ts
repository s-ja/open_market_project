import { getUserOrders, getUserOrdersWithPageParam } from "@/apis/user/orders";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useUserOrdersQuery() {
	return useQuery({
		queryKey: ["userOrders"],
		queryFn: () => getUserOrders(),
	});
}

export function useUserOrdersInfiniteQuery() {
	return useInfiniteQuery({
		queryKey: ["userOrdersInfinite"],
		queryFn: getUserOrdersWithPageParam,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
}
