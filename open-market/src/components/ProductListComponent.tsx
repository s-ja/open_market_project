import { ShowStarRating } from "@/components/ReplyComponent";
import MusicPlayer from "@/components/audioPlayer/MusicPlayer";
import { Common } from "@/styles/common";
import { numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DownloadIcon from "@mui/icons-material/Download";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_API_SERVER;

interface ProductItemProps {
	product: Product | OrderProduct;
}

const theme = createTheme({
	palette: {
		primary: { main: "#FFB258", light: "#D9D9D9", dark: "#828280" },
	},
});

const ListItem = styled.li`
	width: 1140px;
	height: 64px;
	padding: 5px 30px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	gap: 30px;
	position: relative;
	border-radius: 10px;
	background-color: ${Common.colors.white};

	.bookmark {
		color: ${Common.colors.black};
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 17px;
	}

	.download {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 2px;
		position: relative;
		top: 2px;
		padding: 5px;
		text-decoration: none;
		color: ${Common.colors.black};
		font-size: ${Common.font.size.sm};
	}

	.manageLink {
		width: 100px;
		height: 24px;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		color: ${Common.colors.black};
		text-decoration: none;
		background-color: ${Common.colors.emphasize};
		border-radius: 10px;
	}

	span.replyContent {
		width: 500px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const StyledTitleSpan = styled.span`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 30px;
	width: 180px;
	text-decoration: none;
	color: ${Common.colors.black};
	position: relative;

	img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	span {
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const StyledTitleIcon = styled(ArrowForwardIosIcon)`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: -20px;
`;

const StyledElementSpan = styled.span`
	width: 200px;
	height: 30px;
	padding: ${Common.space.spacingMd};
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: ${Common.space.spacingMd};
	color: ${Common.colors.gray};
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
`;

const StyledLink = styled(Link)`
	width: auto;
	height: 24px;
	padding: 0 10px;
	color: ${Common.colors.black};
	font-size: 16px;
	text-decoration: none;
	text-align: center;
	line-height: 24px;
	border-radius: 10px;
	background-color: ${Common.colors.emphasize};
`;

const StyledTitleLink = StyledTitleSpan.withComponent(Link);

export function ProductListItem({ product }: ProductItemProps) {
	return (
		<ListItem key={product?._id}>
			<StyledTitleLink
				to={`/productdetail/${product._id}`}
				aria-label={`${product.name}의 상세 페이지로 이동`}
			>
				<img
					src={
						"image" in product
							? (product as OrderProduct).image!.path
							: product.mainImages[0]?.path
					}
					alt={`${product.name}의 앨범 아트`}
				/>
				<span title={product.name}>{product.name}</span>
				<ThemeProvider theme={theme}>
					<StyledTitleIcon sx={{ color: `primary.dark` }} />
				</ThemeProvider>
			</StyledTitleLink>
			<MusicPlayer
				soundFile={product.extra?.soundFile!}
				audioId={product?._id}
				showable
				name={product.name}
			/>
			{"image" in product ? (
				<a
					href={`${API_KEY}/files/download/${product?.extra?.soundFile.name}?name=${product?.extra?.soundFile.originalname}`}
					download={true}
					className="download"
				>
					<ThemeProvider theme={theme}>
						<DownloadIcon sx={{ color: `primary.main` }} />
					</ThemeProvider>
					다운로드
				</a>
			) : (
				<></>
			)}
			{"bookmarks" in product ? (
				<ThemeProvider theme={theme}>
					<BookmarkIcon sx={{ color: `primary.main` }} />
					<span className="bookmark" aria-label="북마크 수">
						{product?.bookmarks
							? typeof product?.bookmarks === "number"
								? product.bookmarks
								: product.bookmarks.length
							: 0}
					</span>
				</ThemeProvider>
			) : (
				<></>
			)}
		</ListItem>
	);
}

export function UserProductListItem({ product }: { product: Product }) {
	return (
		<ListItem key={product?._id}>
			<StyledTitleSpan>
				<img
					src={product?.mainImages[0]?.path}
					alt={`${product?.name}의 앨범 아트`}
				/>
				<span title={product?.name}>{product?.name}</span>
			</StyledTitleSpan>
			<MusicPlayer
				soundFile={product.extra?.soundFile!}
				audioId={product?._id}
				name={product.name}
			/>
			<StyledElementSpan>
				판매 개수: <span>{product?.buyQuantity}</span>
			</StyledElementSpan>
			<StyledElementSpan>
				총 수익:
				<span>
					{typeof product?.buyQuantity !== "undefined"
						? numberWithComma(product?.buyQuantity * product?.price)
						: "0"}
				</span>
			</StyledElementSpan>
			<StyledElementSpan>
				북마크 수:
				<span>
					{product?.bookmarks
						? typeof product?.bookmarks === "number"
							? product.bookmarks
							: product.bookmarks.length
						: 0}
				</span>
			</StyledElementSpan>
			<ThemeProvider theme={theme}>
				{product.show ? (
					<span aria-label="공개되어 있는 상품입니다.">
						<LockOpenIcon sx={{ color: `primary.dark` }} />
					</span>
				) : (
					<span aria-label="비공개되어 있는 상품입니다.">
						<LockIcon sx={{ color: `primary.main` }} />
					</span>
				)}
			</ThemeProvider>
			<Link
				className="manageLink"
				to={`/productmanage/${product?._id}`}
				aria-label={`${product.name}의 상세 페이지로 이동합니다.`}
			>
				상세보기
			</Link>
		</ListItem>
	);
}

export function UserRepliesListItem({ reply }: { reply: Reply }) {
	return (
		<ListItem key={reply.product?._id}>
			<StyledTitleSpan>
				<img
					src={reply.product.image.path}
					alt={`${reply.product.name}의 앨범 아트`}
				/>
				<span title={reply.product.name}>{reply.product.name}</span>
			</StyledTitleSpan>
			<span className="replyContent">{reply.content}</span>
			<ShowStarRating rating={reply.rating} />
			<StyledLink to={`/productdetail/${reply.product._id}`}>
				음원 상세 페이지 이동
			</StyledLink>
		</ListItem>
	);
}
