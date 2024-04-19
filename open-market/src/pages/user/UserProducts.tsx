import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import HelmetSetup from "@/components/HelmetSetup";
import { UserProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { ProductListSkeleton } from "@/components/SkeletonUI";
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
	searchProductList,
	setItemWithExpireTime,
	sortByNewestProductList,
	sortByProfitProductList,
} from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

function UserProducts() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();

	async function fetchUserProductsInfo({ pageParam = 1 }) {
		try {
			const { data } = await axiosInstance.get(
				`/seller/products?page=${pageParam}&limit=8`,
			);
			return data;
		} catch (error) {
			console.error("상품 리스트 조회 실패:", error);
			return [];
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
		queryKey: ["seller/products"],
		queryFn: fetchUserProductsInfo,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});
	const fetchedProductList = data?.pages.flatMap((page) => page.item) || [];

	function handleSearchKeyword(e: { preventDefault: () => void }) {
		e.preventDefault();

		const keyword =
			searchRef.current?.value.split(" ").join("").toLowerCase() || "";
		setSearchKeyword(keyword);
	}

	const handleSortByProfit = useCallback(() => {
		if (fetchedProductList.length === 0) return;

		let sortedProductList;
		sortedProductList =
			searchedProductList && searchedProductList.length > 0
				? sortByProfitProductList([...searchedProductList])
				: sortByProfitProductList([...fetchedProductList]);

		if (searchedProductList && searchedProductList.length > 0) {
			setSearchedProductList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [fetchedProductList, searchedProductList]);

	const handleSortByNewest = useCallback(() => {
		if (fetchedProductList.length === 0) return;

		let sortedProductList =
			searchedProductList && searchedProductList.length > 0
				? sortByNewestProductList([...searchedProductList])
				: sortByNewestProductList([...fetchedProductList]);

		if (searchedProductList && searchedProductList.length > 0) {
			setSearchedProductList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [fetchedProductList, searchedProductList]);

	useEffect(() => {
		async function fetchSearchResult() {
			const searchResult = await searchProductList({
				resource: "seller/products",
				searchKeyword,
			});

			setSearchedProductList(searchResult);
		}

		fetchSearchResult();
	}, [searchKeyword]);

	useRequireAuth();

	if (isError) {
		const err = error as Error;
		return <div>에러가 발생했습니다: {err.message}</div>;
	}

	return (
		<ProductSection>
			<HelmetSetup
				title="My Products"
				description="판매 음원 목록"
				url="orders"
			/>
			<Heading>상품관리</Heading>
			{userProductsInfo ? (
				<>
					<SearchBar
						onClick={handleSearchKeyword}
						searchRef={searchRef}
						showable
					/>
					<FilterContainer>
						<FilterButton type="button" onClick={handleSortByProfit}>
							수익순
						</FilterButton>
						<FilterButton type="button" onClick={handleSortByNewest}>
							최신순
						</FilterButton>
					</FilterContainer>
					{isLoading ? (
						<ProductListSkeleton />
					) : (
						<ProductContainer height="633px">
							<ProductList>
								{searchKeyword && searchedProductList?.length === 0 ? (
									<span className="emptyList">해당하는 상품이 없습니다.</span>
								) : searchKeyword && searchedProductList?.length !== 0 ? (
									searchedProductList?.map((item) => (
										<UserProductListItem key={item._id} product={item} />
									))
								) : Array.isArray(userProductsInfo) &&
								  userProductsInfo.length > 0 ? (
									userProductsInfo.map((item) => (
										<UserProductListItem key={item._id} product={item} />
									))
								) : fetchedProductList.length !== 0 ? (
									fetchedProductList?.map((item) => (
										<UserProductListItem key={item.id} product={item} />
									))
								) : (
									<span className="emptyList">판매 내역이 없습니다.</span>
								)}
							</ProductList>
							<MoreButton
								type="submit"
								ref={paginationButtonRef}
								onClick={() => {
									setSearchedProductList([]);
									setUserProductsInfo([]);
									fetchNextPage();
								}}
								disabled={!hasNextPage || isFetchingNextPage}
								isDisable={!hasNextPage || isFetchingNextPage}
							>
								더보기
							</MoreButton>
						</ProductContainer>
					)}
				</>
			) : (
				<span className="emptyList">
					현재 회원님이 판매하고 있는 상품이 없습니다
				</span>
			)}
		</ProductSection>
	);
}

export default UserProducts;
