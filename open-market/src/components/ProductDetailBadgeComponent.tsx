import { useBookMarksSuspenseQuery } from "@/hooks/product/queries/bookmark";
import {
	useDeleteBookmarkMutation,
	usePostBookmarkMutation,
} from "@/hooks/user/mutations/bookmark";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
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
}: ProductDetailProps) {
	const { data: bookMarkData } = useBookMarksSuspenseQuery({
		productId: product?._id,
	});

	const { mutate: deleteBookmark } = useDeleteBookmarkMutation();
	const { mutate: postBookmark } = usePostBookmarkMutation();
	const [bookmarkCount, setBookmarkCount] = useState(
		product?.bookmarks?.length || 0,
	);

	const navigate = useNavigate();

	function handelSignIn() {
		if (confirm("로그인 후 이용 가능합니다")) {
			navigate("/signin");
		}
	}

	function handleScrap() {
		if (bookMarkData) {
			deleteBookmark({ bookmarkId: bookMarkData._id, productId: product!._id });
			setBookmarkCount((prevCount) => prevCount - 1);
		} else if (bookMarkData === undefined && currentUser) {
			postBookmark({ currentUserId: currentUser._id, productId: product!._id });
			setBookmarkCount((prevCount) => prevCount + 1);
		}
	}

	return (
		<ProductExtraLinkContainer>
			<div>
				<BookmarkButton
					onClick={handleScrap}
					aria-label={bookMarkData ? "북마크에서 제거" : "북마크에 추가"}
				>
					{bookMarkData ? (
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
