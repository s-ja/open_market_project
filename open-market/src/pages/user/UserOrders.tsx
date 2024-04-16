import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import HelmetSetup from "@/components/HelmetSetup";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import {
	axiosInstance,
	getItemWithExpireTime,
	searchProductList,
} from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

function UserOrders() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);

	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const [searchedOrderList, setSearchedOrderList] = useState<Order[]>();

	useRequireAuth();

	async function fetchOrderProductsInfo({ pageParam = 1 }) {
		try {
			const { data } = await axiosInstance.get(
				`/orders?page=${pageParam}&limit=8`,
			);

			return data;
		} catch (error) {
			console.error(error);
		}
	}

	const {
		data,
		error,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["orders"],
		queryFn: fetchOrderProductsInfo,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});

	const fetchedOrderProductList =
		data?.pages.flatMap((page) => page.item) || [];

	function handleSearchKeyword(e: { preventDefault: () => void }) {
		e.preventDefault();

		const keyword =
			searchRef.current?.value.split(" ").join("").toLowerCase() || "";
		setSearchKeyword(keyword);
	}

	useEffect(() => {
		setSearchKeyword(getItemWithExpireTime("searchOrderKeyword"));
		async function fetchSearchResult() {
			const searchResult = await searchProductList({
				resource: "orders",
				searchKeyword,
			});
			setSearchedOrderList(searchResult);
		}

		fetchSearchResult();
	}, [searchKeyword]);

	if (isLoading) {
		return <LoadingSpinner width="100vw" height="100vh" />;
	}

	if (isError) {
		const err = error as Error;
		return <div>에러가 발생했습니다: {err.message}</div>;
	}
	return (
		<ProductSection>
			<HelmetSetup
				title="My Orders"
				description="주문 내역 조회"
				url="orders"
			/>
			<Heading>구매내역</Heading>
			<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} showable />
			<FilterContainer>
				<FilterButton type="submit">인기순</FilterButton>
				<FilterButton type="submit">최신순</FilterButton>
			</FilterContainer>
			<ProductContainer height={"633px"}>
				<ProductList>
					{searchKeyword && searchedOrderList?.length === 0 ? (
						<span className="emptyList">해당하는 구매내역이 없습니다.</span>
					) : searchedOrderList && searchedOrderList.length !== 0 ? (
						searchedOrderList.map((order) => (
							<ProductListItem
								key={order._id}
								product={order.products[0]}
								bookmark={false}
							/>
						))
					) : fetchedOrderProductList.length !== 0 ? (
						fetchedOrderProductList.map((order) => {
							return (
								<ProductListItem
									key={order._id}
									product={order.products[0]}
									bookmark={false}
								/>
							);
						})
					) : (
						<span className="emptyList">구매내역이 없습니다.</span>
					)}
				</ProductList>
				<MoreButton
					type="submit"
					ref={paginationButtonRef}
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
					isDisable={!hasNextPage || isFetchingNextPage}
				>
					더보기
				</MoreButton>
			</ProductContainer>
		</ProductSection>
	);
}

export default UserOrders;
