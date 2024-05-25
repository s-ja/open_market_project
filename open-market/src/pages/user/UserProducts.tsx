import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import HelmetSetup from "@/components/HelmetSetup";
import { UserProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { ProductListSkeleton } from "@/components/SkeletonUI";
import { useUserProductsInfiniteQuery } from "@/hooks/product/queries/useUserProductsQueries";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import {
	searchProductList,
	setItemWithExpireTime,
	sortByNewestProductList,
	sortByProfitProductList,
} from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";

function UserProducts() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();

	const {
		data,
		error,
		isLoading,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useUserProductsInfiniteQuery();

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
				url="/user/products"
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
						<FilterButton
							type="button"
							onClick={handleSortByProfit}
							aria-label="수익순 내림차순 정렬"
						>
							수익순
						</FilterButton>
						<FilterButton
							type="button"
							onClick={handleSortByNewest}
							aria-label="등록일별 오름차순 정렬"
						>
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
