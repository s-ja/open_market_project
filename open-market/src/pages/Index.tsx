import {
	FilterButton,
	FilterContainer,
	FilterSelect,
} from "@/components/FilterComponent";
import HelmetSetup from "@/components/HelmetSetup";
import { ProductListItem } from "@/components/ProductListComponent";
import SearchBar from "@/components/SearchBar";
import { IndexSkeleton } from "@/components/SkeletonUI";
import { useCategoryFilterProductList } from "@/hooks/useCategoryFilterProductList";
import { codeState } from "@/states/categoryState";
import {
	categoryValueState,
	searchKeywordState,
} from "@/states/productListState";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { Common } from "@/styles/common";
import {
	axiosInstance,
	searchProductList,
	setItemWithExpireTime,
	sortByNewestProductList,
	sortByOrdersProductList,
} from "@/utils";
import styled from "@emotion/styled";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

interface bannerProps {
	showable?: boolean;
}

const BannerSection = styled.section<bannerProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: 100%;
	/* height: auto; */
	height: 530px;
	background-color: ${Common.colors.black};
	padding-top: 80px;
	position: relative;

	overflow: hidden;
	video {
		width: 100%;
		height: 500px;
		object-fit: cover;
		aspect-ratio: 16 / 9;
	}

	.description {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
		width: 100%;
		bottom: 0px;
		padding: 200px 0;
		font-size: xx-large;
		font-weight: 800;
		color: white;
		text-shadow: 5px 3px 3px rgba(19, 4, 4, 0.3);
	}

	.playingButton {
		background-color: transparent;
		border: 1px solid ${Common.colors.gray2};
		border-radius: 50%;
		position: absolute;
		bottom: 20px;
		left: 20px;
	}
`;
function Index() {
	const searchRef = useRef<HTMLInputElement>(null);
	const paginationButtonRef = useRef(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const category = useRecoilValue(codeState);

	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [categoryValue, setCategoryValue] =
		useRecoilState<string>(categoryValueState);

	const [isPlaying, setIsPlaying] = useState(true);
	const [selectedCode, setSelectedCode] = useState("");
	const [searchedProductList, setSearchedProductList] = useState<Product[]>();
	const [sortedProductList, setSortedProductList] = useState<Product[]>();
	const [sortedFilteredProductList, setSortedFilteredProductList] =
		useState<Product[]>();

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

	function togglePlay() {
		if (videoRef.current !== null) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	}

	const handleSortByOrders = useCallback(() => {
		if (fetchedProductList) {
			if (fetchedProductList.length === 0) return;

			let sortedProductList =
				searchedProductList && searchedProductList.length > 0
					? sortByOrdersProductList([...searchedProductList])
					: sortByOrdersProductList([...fetchedProductList]);

			if (searchedProductList && searchedProductList.length > 0) {
				setSearchedProductList(sortedProductList);
			} else {
				setSortedProductList(sortedProductList);
			}

			if (fetchedFilterProductList && fetchedFilterProductList.length > 0) {
				setSortedFilteredProductList(
					sortByOrdersProductList([...fetchedFilterProductList]),
				);
			}

			setItemWithExpireTime("sortedProductList", sortedProductList, 5000 * 100);
		}
	}, [fetchedProductList, searchedProductList, fetchedFilterProductList]);

	const handleSortByNewest = useCallback(() => {
		if (fetchedProductList) {
			if (fetchedProductList.length === 0) return;

			let sortedProductList =
				searchedProductList && searchedProductList.length > 0
					? sortByNewestProductList([...searchedProductList])
					: sortByNewestProductList([...fetchedProductList]);

			if (searchedProductList && searchedProductList.length > 0) {
				setSearchedProductList(sortedProductList);
			} else {
				setSortedProductList(sortedProductList);
			}

			if (fetchedFilterProductList && fetchedFilterProductList.length > 0) {
				setSortedFilteredProductList(
					sortByNewestProductList([...fetchedFilterProductList]),
				);
			}

			setItemWithExpireTime("sortedProductList", sortedProductList, 5000 * 100);
		}
	}, [fetchedProductList, searchedProductList, fetchedFilterProductList]);

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
		setSortedFilteredProductList([]);
	}, [fetchedFilterProductList]);

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
			<HelmetSetup title="Home" description="홈페이지" url="" />
			{isLoading ? (
				<IndexSkeleton searchKeyword={searchKeyword} />
			) : (
				<div>
					<BannerSection showable={searchKeyword ? false : true}>
						<video
							autoPlay
							loop
							muted
							ref={videoRef} // 비디오 요소에 대한 참조 설정
						>
							<source src="/videos/mainVideo.mp4" type="video/mp4" />
							<track
								src="/videos/mainVideo.vtt"
								kind="captions"
								srcLang="ko"
								label="한국어 자막"
								default
							/>
							모두의 오디오! MODI 메인 페이지 배너 영상입니다.
						</video>
						<div className="description">
							<span>소규모 음원 제작자들을 위한 오픈마켓 플랫폼</span>
							<span>MODI</span>
						</div>
						<button className="playingButton" onClick={togglePlay}>
							{isPlaying ? (
								<PauseRoundedIcon
									style={{
										fontSize: 45,
										textShadow: "2px 2px 5px rgba(255, 255, 255, 0.6)",
										color: "white",
									}}
								/>
							) : (
								<PlayArrowRoundedIcon
									style={{
										fontSize: 45,
										textShadow: "2px 2px 5px rgba(255, 255, 255, 0.6)",
										color: "white",
									}}
								/>
							)}
						</button>
					</BannerSection>
					<ProductSection isIndex={!searchKeyword}>
						<Heading>메인페이지</Heading>
						<SearchBar
							onClick={handleSearchKeyword}
							searchRef={searchRef}
							showable={!!searchKeyword}
						/>
						<FilterContainer>
							<FilterButton type="button" onClick={handleSortByOrders}>
								인기순
							</FilterButton>
							<FilterButton type="button" onClick={handleSortByNewest}>
								최신순
							</FilterButton>
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
						<ProductContainer height={searchKeyword ? "633px" : "400px"}>
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
									) : sortedFilteredProductList &&
									  sortedFilteredProductList.length !== 0 ? (
										sortedFilteredProductList.map((product: Product) => (
											<ProductListItem
												key={product._id}
												product={product}
												bookmark
											/>
										))
									) : (
										fetchedFilterProductList.map((product: Product) => (
											<ProductListItem
												key={product._id}
												product={product}
												bookmark
											/>
										))
									)
								) : sortedProductList ? (
									sortedProductList.map((product: Product) => (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									))
								) : (
									fetchedProductList?.map((product: Product) => (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									))
								)}
							</ProductList>
							<MoreButton
								type="submit"
								ref={paginationButtonRef}
								onClick={() => {
									fetchNextPage();
								}}
								disabled={!hasNextPage || isFetchingNextPage}
								isDisable={!hasNextPage || isFetchingNextPage}
							>
								더보기
							</MoreButton>
						</ProductContainer>
					</ProductSection>
				</div>
			)}
		</>
	);
}

export default Index;
