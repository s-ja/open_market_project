import HelmetSetup from "@/components/HelmetSetup";
import { ProductListSkeleton } from "@/components/SkeletonUI";
import { useDeleteBookmarkMutation } from "@/hooks/bookmark/mutations/useDeleteBookmarkMutation";
import { useUserBookmarksQuery } from "@/hooks/bookmark/queries/useUserBookmarksQuery";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";

type Bookmark = {
	createdAt: string;
	memo: string;
	product: {
		buyQuantity: number;
		image: {
			path: string;
			fileName: string;
			orgName: string;
		};
		name: string;
		price: number;
		quantity: number;
	};
	product_id: number;
	user_id: number;
	_id: number;
};

const ListItem = styled.li`
	width: 1140px;
	height: 64px;
	padding: 5px 30px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	gap: 30px;
	border-radius: 10px;
	background-color: ${Common.colors.white};

	img {
		width: 42px;
		height: 42px;
	}

	.bookmark {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 2px;
		padding: 5px;
		background-color: transparent;
		border: none;

		span {
			position: relative;
			top: 1px;
			font-size: ${Common.font.size.sm};
		}
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
	.iconWrapper {
		display: flex;
		align-items: center;
		gap: 1px;
		padding: 5px 8px;
		border: none;
		border-radius: ${Common.space.spacingMd};
		background-color: ${Common.colors.emphasize};
	}
`;

const StyledTitleSpan = styled.span`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 30px;
	text-decoration: none;
	color: ${Common.colors.black};

	img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	span {
		width: 800px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
`;

const StyledLink = StyledTitleSpan.withComponent(Link);

function UserBookmarks() {
	const { data: bookmarkList, isLoading: isLoadingBookmarks } =
		useUserBookmarksQuery();

	const { mutate: deleteBookmark } = useDeleteBookmarkMutation();

	return (
		<ProductSection>
			<HelmetSetup
				title="My Bookmarks"
				description="북마크한 목록"
				url="/user/bookmarks"
			/>
			<Heading>북마크한 목록</Heading>
			<ProductContainer height="633px">
				{isLoadingBookmarks ? (
					<ProductListSkeleton />
				) : (
					<ProductList>
						{bookmarkList && bookmarkList.length !== 0 ? (
							bookmarkList.map((bookmark: Bookmark) => (
								<ListItem key={bookmark.product_id}>
									<StyledLink
										to={`/product/${bookmark.product_id}`}
										aria-label={`${bookmark.product.name}의 상세페이지로 이동`}
									>
										<img
											src={bookmark.product.image.path}
											alt={`${bookmark.product.name}의 앨범 아트`}
										/>
										<span title={bookmark.product.name}>
											{bookmark.product.name}
										</span>
									</StyledLink>
									<button
										className="iconWrapper"
										onClick={() =>
											deleteBookmark({
												bookmarkId: bookmark._id,
												productId: bookmark.product_id,
											})
										}
									>
										북마크 삭제
										<Delete
											sx={{ color: `${Common.colors.black}`, fontSize: "20px" }}
										/>
									</button>
								</ListItem>
							))
						) : (
							<span>북마크된 상품이 없습니다.</span>
						)}
					</ProductList>
				)}
			</ProductContainer>
		</ProductSection>
	);
}

export default UserBookmarks;
