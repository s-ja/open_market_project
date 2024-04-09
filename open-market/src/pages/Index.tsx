import {
	FilterButton,
	FilterContainer,
	FilterSelect,
} from "@/components/FilterComponent";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { useCategoryFilterProductList } from "@/hooks/useCategoryFilterProductList";
import { codeState } from "@/states/categoryState";
import {
	categoryValueState,
	searchKeywordState,
} from "@/states/productListState";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { Common } from "@/styles/common";
import { axiosInstance, searchProductList } from "@/utils";
import styled from "@emotion/styled";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRecoilState, useRecoilValue } from "recoil";

interface bannerProps {
	showable?: boolean;
}

const BannerSection = styled.section<bannerProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: 100%;
	height: auto;
	background-color: ${Common.colors.black};
	padding-top: 80px;
	video {
		width: 100%;
		height: 500px;
		object-fit: cover;
		aspect-ratio: 16 / 9;
	}
`;

function Index() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);

	const category = useRecoilValue(codeState);

	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [categoryValue, setCategoryValue] =
		useRecoilState<string>(categoryValueState);

	const [selectedCode, setSelectedCode] = useState("");
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();

	async function fetchProducts({ pageParam = 1 }) {
		try {
			const { data } = await axiosInstance.get(
				`/products?page=${pageParam}&limit=4`,
			);
			return data;
		} catch (error) {
			console.error("Error fetching products:", error);
			throw error;
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
		queryKey: ["products"],
		queryFn: fetchProducts,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.pagination.page < lastPage.pagination.totalPages
				? lastPage.pagination.page + 1
				: null,
	});

	const fetchedProductList = data?.pages.map((page) => page.item).flat();

	const {
		data: categoryFilterData,
		error: categoryFilterError,
		isError: categoryFilterIsError,
	} = useCategoryFilterProductList({
		resource: "products",
		category: selectedCode,
	});

	const fetchedFilterProductList = categoryFilterData?.item;

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		if (category) {
			const selectedCategory = category.find(
				(item: { value: string }) => item.value === categoryValue,
			);
			if (selectedCategory) {
				setSelectedCode(selectedCategory.code);
			}
		}
	}, [categoryValue]);

	useEffect(() => {
		async function fetchSearchResult() {
			const searchResult = await searchProductList({
				resource: "products",
				searchKeyword,
			});
			setSearchedProductList(searchResult);
		}

		fetchSearchResult();
	}, [searchKeyword]);

	if (isLoading) {
		return <LoadingSpinner width="100vw" height="100vh" />;
	}

	if (isError || categoryFilterIsError) {
		if (isError) {
			const err = error as Error;
			return <div>에러가 발생했습니다: {err.message}</div>;
		} else {
			const err = categoryFilterError as Error;
			return <div>에러가 발생했습니다: {err.message}</div>;
		}
	}

	return (
		<>
			<Helmet>
				<title>Home - 모두의 오디오 MODI</title>
			</Helmet>
			<BannerSection showable={searchKeyword ? false : true}>
				<video autoPlay loop muted>
					<source src="/videos/mainVideo.mp4" type="video/mp4" />
					메인 영상 배너
				</video>
			</BannerSection>
			<ProductSection isIndex={!searchKeyword}>
				<Heading>메인페이지</Heading>
				<SearchBar
					onClick={handleSearchKeyword}
					searchRef={searchRef}
					showable={!!searchKeyword}
				/>
				<FilterContainer>
					<FilterButton type="submit">인기순</FilterButton>
					<FilterButton type="submit">최신순</FilterButton>
					<FilterSelect showable={!searchKeyword}>
						<select
							value={categoryValue}
							onChange={(e) => {
								setCategoryValue(e.target.value);
							}}
						>
							<option value="none" disabled hidden>
								장르 선택
							</option>
							<option value="all">전체 보기</option>
							{category && category.length !== 0
								? category.map((item) => (
										<option key={item.code} value={item.value}>
											{item.value}
										</option>
									))
								: undefined}
						</select>
					</FilterSelect>
				</FilterContainer>
				<ProductContainer
					height={searchKeyword ? "633px" : "400px"}
					isDisable={!hasNextPage || isFetchingNextPage}
				>
					<ProductList>
						{searchKeyword && searchedProductList !== undefined ? (
							searchedProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								searchedProductList.map((product) => (
									<ProductListItem
										key={product._id}
										product={product}
										bookmark
									/>
								))
							)
						) : !searchKeyword &&
						  categoryValue !== "all" &&
						  fetchedFilterProductList !== undefined ? (
							fetchedFilterProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								fetchedFilterProductList.map((product: Product) => (
									<ProductListItem
										key={product._id}
										product={product}
										bookmark
									/>
								))
							)
						) : (
							fetchedProductList?.map((product: Product) => (
								<ProductListItem key={product._id} product={product} bookmark />
							))
						)}
					</ProductList>
					<button
						type="submit"
						className="moreButton"
						ref={paginationButtonRef}
						onClick={() => {
							fetchNextPage();
						}}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						더보기
					</button>
				</ProductContainer>
			</ProductSection>
		</>
	);
}

export default Index;
