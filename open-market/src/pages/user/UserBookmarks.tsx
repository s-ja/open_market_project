import { ProductList, ProductSection } from "@/styles/ProductListStyle";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

function UserBookmarks() {
	const [bookmarkList, setBookmarkList] = useState<Bookmark[]>([]);

	async function deleteScrap(bookmarkId: number) {
		try {
			axiosInstance.delete(`/bookmarks/${bookmarkId}`).then(() => {
				setBookmarkList((currentList) =>
					currentList.filter((bookmark) => bookmark._id !== bookmarkId),
				);
				toast.success("북마크 삭제 완료", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
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
	}

	useEffect(() => {
		async function fetchedBookmarksData() {
			const { data } = await axiosInstance.get("/bookmarks/");
			setBookmarkList(data.item.reverse());
		}
		fetchedBookmarksData();
	}, []);

	return (
		<UserBookmarksComponentWrapper>
			<ProductSection>
				<ProductContainer>
					<ProductList>
						{bookmarkList ? (
							bookmarkList!.map((i) => (
								<ListItem key={i.product_id}>
									<StyledLink to={`/productdetail/${i.product_id}`}>
										<img
											src={i.product.image.path}
											alt={`${i.product.name} 앨범 아트`}
										/>
										<span title={i.product.name}>{i.product.name}</span>
									</StyledLink>
									<button
										className="iconWrapper"
										onClick={() => deleteScrap(i._id)}
									>
										북마크 삭제
										<Delete />
									</button>
								</ListItem>
							))
						) : (
							<span>북마크된 상품이 없습니다.</span>
						)}
					</ProductList>
				</ProductContainer>
			</ProductSection>
		</UserBookmarksComponentWrapper>
	);
}

export default UserBookmarks;

const UserBookmarksComponentWrapper = styled.div`
	height: calc(100vh - 100px);
	overflow-y: scroll;
`;

const ProductContainer = styled.div`
	width: 1160px;
	padding: ${Common.space.spacingLg} 0 5px 0;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-between;
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);

	span.emptyList {
		padding-top: 40px;
		font-weight: ${Common.font.weight.regular};
	}

	.moreButton {
		width: 100px;
		height: 40px;
		position: relative;
		background-color: transparent;
		border: none;
		font-weight: ${Common.font.weight.regular};

		&::after {
			content: "";
			position: absolute;
			top: 50%;
			transform: translateY(-30%);
			right: 12px;
			border-bottom: solid 8px transparent;
			border-left: solid 8px transparent;
			border-right: solid 8px transparent;
		}
	}
`;

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
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const StyledLink = StyledTitleSpan.withComponent(Link);
