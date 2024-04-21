import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const API_KEY = import.meta.env.VITE_API_SERVER;

interface BadgeProps {
	isNew?: boolean;
	isBest?: boolean;
}

interface ProductDetailProps {
	product: Product | undefined;
	order: Order | undefined;
	currentUser: CurrentUser | null;
	bookmark: Bookmark | undefined | null;
}

export const DetailBadgeContainer = styled.div`
	width: 250px;
	height: auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	gap: 10px;
`;

export const DetailBadge = styled.div<BadgeProps>`
	width: 100px;
	height: 40px;
	margin: 5px 0;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	gap: 5px;
	border-radius: 100px;
	background-color: ${Common.colors.white};

	& :first-of-type {
		${(props) =>
			props.isNew &&
			`color: ${Common.colors.emphasize}; position: relative; right: 2px;`}
		${(props) => props.isBest && `color: ${Common.colors.secondary}`}
	}
`;

export const ProductExtraLinkContainer = styled.article`
	width: 1440px;
	height: 80px;
	margin: 0 auto;
	margin-bottom: 70px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	background-color: ${Common.colors.gray2};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);

	div {
		width: 1160px;
		padding-right: ${Common.space.spacingMd};
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}
`;

const ProductExtraBadgeStyle = styled(DetailBadge)`
	width: 200px;
	height: 50px;
	text-decoration: none;
	color: ${Common.colors.black};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);
	& :first-of-type {
		color: ${Common.colors.secondary};
		position: relative;
		top: -1px;
	}
`.withComponent("span");

const ProductExtraLink = ProductExtraBadgeStyle.withComponent(Link);

const DownloadLink = ProductExtraBadgeStyle.withComponent("a");

const BookmarkButton = styled(ProductExtraBadgeStyle)`
	border: none;
	font-size: 18px;
	& :first-of-type {
		color: ${Common.colors.emphasize};
		position: relative;
		top: -1px;
	}
`.withComponent("button");

const NoUserPurchaseButton = styled(ProductExtraBadgeStyle)`
	border: none;
	font-size: 18px;
`.withComponent("button");

function ProductDetailExtraLink({
	product,
	order,
	currentUser,
	bookmark: initialBookmark,
}: ProductDetailProps) {
	const [bookmark, setBookmark] = useState(initialBookmark);
	const [bookmarkCount, setBookmarkCount] = useState(
		product?.bookmarks ? product.bookmarks.length : 0,
	);

	const navigate = useNavigate();

	function handelSignIn() {
		if (confirm("로그인 후 이용 가능합니다")) {
			navigate("/signin");
		}
	}
	function handleScrap() {
		if (bookmark) {
			try {
				axiosInstance.delete(`/bookmarks/${bookmark._id}`).then(() => {
					toast.success("북마크 삭제 완료", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					setBookmark(null);
					setBookmarkCount((prevCount) => prevCount - 1);
				});
			} catch (error) {
				console.error(error);
				toast.error("북마크 삭제 실패", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
			}
		} else {
			try {
				axiosInstance
					.post(`/bookmarks/`, {
						user_id: currentUser?._id,
						product_id: product?._id,
						memo: "",
					})
					.then((response) => {
						toast.success("북마크 성공 완료", {
							ariaProps: {
								role: "status",
								"aria-live": "polite",
							},
						});
						setBookmark(response.data.item);
						setBookmarkCount((prevCount) => prevCount + 1);
					})
					.catch((error) => {
						if (isAxiosError(error)) {
							if (error.response && error.response.status === 409) {
								toast.error("이미 북마크된 상품입니다.", {
									ariaProps: {
										role: "status",
										"aria-live": "polite",
									},
								});
							} else {
								console.error("알 수 없는 오류가 발생했습니다.", error.message);
							}
						}
					});
			} catch (error) {
				console.error(error);
			}
		}
	}
	useEffect(() => {
		setBookmark(initialBookmark);
	}, [initialBookmark]);
	return (
		<ProductExtraLinkContainer>
			<div>
				<BookmarkButton
					onClick={handleScrap}
					aria-label={bookmark ? "북마크에서 제거" : "북마크에 추가"}
				>
					{bookmark ? (
						<BookmarkIcon sx={{ color: `primary.main` }} />
					) : (
						<BookmarkBorderIcon sx={{ color: `primary.light` }} />
					)}
					북마크
					{bookmarkCount}
				</BookmarkButton>
				{!currentUser ? (
					<NoUserPurchaseButton
						type="button"
						onClick={handelSignIn}
						aria-label="음원 상품 구매하기 버튼"
					>
						<CheckIcon />
						구매하기
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</NoUserPurchaseButton>
				) : currentUser && currentUser._id === product?.seller_id ? (
					<ProductExtraLink
						to={`/productmanage/${product?._id}`}
						aria-label="판매 음원 관리 페이지로 이동"
					>
						<CheckIcon />
						상품 관리
					</ProductExtraLink>
				) : (currentUser && !order) || order === undefined ? (
					<ProductExtraLink
						to={`/productpurchase/${product?._id}`}
						aria-label="음원 상품 구매하기 버튼"
					>
						<CheckIcon />
						구매하기
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</ProductExtraLink>
				) : (
					<DownloadLink
						href={`${API_KEY}/files/download/${product?.extra?.soundFile.name}?name=${product?.extra?.soundFile.originalname}`}
						download={true}
						aria-label="음원 상품 다운로드 버튼"
					>
						<DownloadIcon />
						다운로드
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</DownloadLink>
				)}
			</div>
		</ProductExtraLinkContainer>
	);
}

export default ProductDetailExtraLink;
