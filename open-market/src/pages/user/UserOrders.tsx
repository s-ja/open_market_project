import HelmetSetup from "@/components/HelmetSetup";
import { ProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { ProductListSkeleton } from "@/components/SkeletonUI";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUserOrdersInfiniteQuery } from "@/hooks/user/queries/orders";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { getItemWithExpireTime, searchProductList } from "@/utils";
import { useEffect, useRef, useState } from "react";

function UserOrders() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);

	const [searchKeyword, setSearchKeyword] = useState<string>("");
	const [searchedOrderList, setSearchedOrderList] = useState<Order[]>();

	useRequireAuth();

	const {
		data,
		error,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useUserOrdersInfiniteQuery();

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
			{isLoading ? (
				<ProductListSkeleton />
			) : (
				<ProductContainer height={"633px"}>
					<ProductList>
						{searchKeyword && searchedOrderList?.length === 0 ? (
							<span className="emptyList">해당하는 구매내역이 없습니다.</span>
						) : searchedOrderList && searchedOrderList.length !== 0 ? (
							searchedOrderList.map((order) => (
								<ProductListItem key={order._id} product={order.products[0]} />
							))
						) : fetchedOrderProductList.length !== 0 ? (
							fetchedOrderProductList.map((order) => {
								return (
									<ProductListItem
										key={order._id}
										product={order.products[0]}
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
						aria-label={
							hasNextPage
								? "리스트에 4개의 상품을 더 표시합니다."
								: "더 이상 표시할 상품이 없습니다."
						}
					>
						더보기
					</MoreButton>
				</ProductContainer>
			)}
		</ProductSection>
	);
}

export default UserOrders;
