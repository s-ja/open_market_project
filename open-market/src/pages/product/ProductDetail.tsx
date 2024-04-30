import HelmetSetup from "@/components/HelmetSetup";
import ProductDetailExtraLink from "@/components/ProductDetailBadgeComponent";
import ProductDetailComponent from "@/components/ProductDetailComponent";
import ReplyListItem, {
	ReplyBlock,
	ReplyContainer,
	ReplyInputForm,
	ReplyTextarea,
	ReplyUserProfileImage,
} from "@/components/ReplyComponent";
import { ProductDetailSkeleton } from "@/components/SkeletonUI";
import { currentUserState } from "@/states/authState";
import { codeState } from "@/states/categoryState";
import { Heading, MoreButton } from "@/styles/ProductListStyle";
import { axiosInstance, debounce, formatDate } from "@/utils";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import { AxiosError } from "axios";
import _ from "lodash";
import { SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function ProductDetail() {
	const navigate = useNavigate();

	const { productId } = useParams();

	const currentUser = useRecoilValue(currentUserState);
	const category = useRecoilValue(codeState);

	const replyRef = useRef<HTMLTextAreaElement & HTMLDivElement>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [product, setProduct] = useState<Product>();
	const [order, setOrder] = useState<Order>();
	const [genre, setGenre] = useState<string>();
	const [createdAt, setCreatedAt] = useState<string>();
	const [bookmark, setBookmark] = useState<Bookmark>();

	const [allReplies, setAllReplies] = useState<Reply[]>([]);
	const [displayReplies, setDisplayReplies] = useState<Reply[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const REPLIES_PER_PAGE = 4;

	const [rating, setRating] = useState(0);
	const [ratingValue, setRatingValue] = useState<number>(3);
	const [replyContent, setReplyContent] = useState<string>();
	const [__, setHover] = useState(-1);
	const [isReplyLoading, setIsReplyLoading] = useState<boolean>(false);

	async function fetchUserBookmarks(productId: string | undefined) {
		try {
			const response = await axiosInstance.get(
				`/bookmarks/products/${productId}`,
			);
			if (response.status === 200) {
				setBookmark(response.data.item);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchProduct(id: string) {
		try {
			const response = await axiosInstance.get<ProductResponse>(
				`/products/${id}`,
			);
			setProduct(response.data.item);
			setRating(getRating(response.data.item));
			setCreatedAt(formatDate(response.data.item.createdAt));
			if (currentUser && currentUser?._id !== response.data.item.seller_id) {
				fetchOrder(Number(id)!);
			}
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return navigate("/err404", { replace: true });
			}
			console.error(error);
		}
	}

	async function fetchOrder(productId: number) {
		try {
			const response = await axiosInstance.get<OrderListResponse>(`/orders`);
			const userOrder = response.data.item.find(
				(order) => order.products[0]._id === productId,
			);
			setOrder(userOrder);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleReplySubmit(e: { preventDefault: () => void }) {
		e.preventDefault();

		if (!replyContent || replyContent?.trim() === "")
			return toast.error("내용을 입력해주세요!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});

		setIsReplyLoading(true);

		try {
			const response = await axiosInstance.post<ReplyResponse>(`/replies`, {
				order_id: order!._id,
				product_id: Number(productId),
				rating: ratingValue,
				content: replyContent,
				extra: { profileImage: currentUser?.profileImage },
			});

			setTimeout(() => {
				if (response.data.ok) {
					toast.success("댓글을 작성했습니다.", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					replyRef.current!.value = "";
					setReplyContent("");
					setRatingValue(3);
					fetchProduct(productId!);
					setIsReplyLoading(false);
				}
			}, 500);
		} catch (error) {
			setIsReplyLoading(false);
			console.error(error);
		}
	}

	function getRating(product: Product) {
		return +_.meanBy(product.replies, "rating").toFixed(2) || 0;
	}

	function handleMoreReplies() {
		const newPage = currentPage + 1;
		const newReplies = allReplies!.slice(
			currentPage * REPLIES_PER_PAGE,
			newPage * REPLIES_PER_PAGE,
		);
		setDisplayReplies((prev) => [...prev, ...newReplies]);
		setCurrentPage(newPage);
	}

	useEffect(() => {
		if (productId === null || productId === "") {
			return navigate("/err", { replace: true });
		}
		fetchProduct(productId!);
		fetchUserBookmarks(productId);
	}, []);

	useEffect(() => {
		let sessionHistory: Product[] = JSON.parse(
			sessionStorage.getItem("historyList") || "[]",
		);
		if (product) {
			setIsLoading(false);
			if (product.replies) {
				setAllReplies(product.replies);
			}
			if (sessionHistory.length > 5) {
				sessionHistory.pop();
			}
			sessionHistory.unshift(product);
			sessionHistory = Array.from(
				new Set(sessionHistory.map((item) => JSON.stringify(item))),
			).map((item) => JSON.parse(item));
			sessionStorage.setItem("historyList", JSON.stringify(sessionHistory));
		}
	}, [product]);

	useEffect(() => {
		if (allReplies) {
			setDisplayReplies(allReplies.slice(0, currentPage * REPLIES_PER_PAGE));
		}
	}, [allReplies]);

	useEffect(() => {
		function translateCodeToValue(code: string) {
			if (
				code !== undefined &&
				category !== undefined &&
				product !== undefined
			) {
				return category?.find((item) => item.code === code)?.value;
			}
		}
		setGenre(translateCodeToValue(product?.extra?.category!));
	}, [product, category]);

	return (
		<section>
			<HelmetSetup
				title="Product Detail"
				description="음원 상세 페이지"
				url={`productdetail/${productId}`}
			/>
			<Heading>상세 페이지</Heading>
			{isLoading ? (
				<ProductDetailSkeleton />
			) : (
				<>
					<ProductDetailComponent
						product={product}
						genre={genre}
						rating={rating}
						createdAt={createdAt!}
					/>
					<ProductDetailExtraLink
						product={product}
						order={order}
						currentUser={currentUser}
						bookmark={bookmark}
					/>
					<ReplyContainer>
						<h3>
							<ModeCommentIcon />
							댓글
						</h3>
						<div>
							{!currentUser ? (
								<p>로그인 후 댓글을 작성할 수 있습니다.</p>
							) : currentUser && currentUser?._id === product?.seller_id ? (
								<p>내 상품에는 댓글을 작성할 수 없습니다.</p>
							) : (currentUser && !order) || order === undefined ? (
								<p>음원 구매 후 댓글을 작성할 수 있습니다.</p>
							) : (
								<ReplyInputForm action="submit">
									<span>
										{currentUser?.profileImage ? (
											<ReplyUserProfileImage
												src={currentUser?.profileImage}
												alt={`${currentUser?.name}님의 프로필 이미지`}
											/>
										) : (
											<span
												aria-label={`${currentUser?.name}님의 프로필 이미지`}
											>
												<AccountCircleIcon />
											</span>
										)}
									</span>
									<ReplyBlock user>{currentUser?.name}</ReplyBlock>
									<div className="inputRating">
										<Rating
											name="rating"
											value={ratingValue}
											precision={0.5}
											max={5}
											onChange={(_, newValue) => {
												newValue === null
													? setRatingValue(1)
													: setRatingValue(newValue);
											}}
											onChangeActive={(_, newHover) => {
												setHover(newHover);
											}}
											emptyIcon={
												<StarIcon
													style={{ opacity: 0.55 }}
													fontSize="inherit"
												/>
											}
											aria-label={`별점 선택: ${ratingValue}점`}
										/>
									</div>
									<label htmlFor="content" className="a11yHidden">
										댓글 내용
									</label>
									<div className="replyTextAreaContainer">
										<ReplyTextarea
											id="content"
											name="content"
											ref={replyRef}
											onChange={debounce(
												(e: {
													target: { value: SetStateAction<string | undefined> };
												}) => setReplyContent(e.target.value),
											)}
											required
										/>
										<button
											type="submit"
											onClick={handleReplySubmit}
											aria-label="작성한 댓글 등록"
											disabled={isReplyLoading}
										>
											{isReplyLoading ? "업로드 중.." : "작성하기"}
										</button>
									</div>
								</ReplyInputForm>
							)}
						</div>
						<ul>
							{allReplies !== undefined && allReplies?.length === 0 ? (
								<p>댓글이 없습니다.</p>
							) : (
								displayReplies?.map((reply) => {
									return <ReplyListItem reply={reply} />;
								})
							)}
						</ul>
						{allReplies !== undefined &&
						currentPage * REPLIES_PER_PAGE < allReplies?.length ? (
							<MoreButton
								onClick={handleMoreReplies}
								isReply
								aria-label="댓글을 추가로 더 표시합니다."
							>
								더보기
							</MoreButton>
						) : (
							<MoreButton
								isReply
								disabled
								isDisable
								aria-label="더이상 표시할 댓글이 없습니다."
							>
								더보기
							</MoreButton>
						)}
					</ReplyContainer>
				</>
			)}
		</section>
	);
}

export default ProductDetail;
