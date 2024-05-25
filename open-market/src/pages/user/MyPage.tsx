import HelmetSetup from "@/components/HelmetSetup";
import MyPageList from "@/components/MyPageList";
import { MyPageListSkeleton, UserDataSkeleton } from "@/components/SkeletonUI";
import { useUserBookmarksQuery } from "@/hooks/bookmark/queries/useUserBookmarksQuery";
import { useUserOrdersQuery } from "@/hooks/order/queries/useUserOrdersQueries";
import { useUserProductsQuery } from "@/hooks/product/queries/useUserProductsQueries";
import { useUserRepliesQuery } from "@/hooks/reply/queries/useUserRepliesQuery";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUserDataQuery } from "@/hooks/user/queries/useUserDataQuery";
import { currentUserState } from "@/states/authState";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Section = styled.section`
	width: 1440px;
	height: 100%;
	background-color: ${Common.colors.white};
	padding: 56px;
	margin: 0 auto;
	padding-top: 100px;
`;

const MainTitle = styled.h2`
	font-weight: ${Common.font.weight.bold};
	font-size: ${Common.font.size.xl};
	color: ${Common.colors.gray};
`;

const Article = styled.article`
	width: 1328px;
	height: 241px;
	background: ${Common.colors.gray2};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	margin: 20px auto;
	position: relative;
	padding: ${Common.space.spacingMd};
	display: flex;
	justify-content: center;
	align-items: center;
	gap: ${Common.space.spacingXl};
`;

export const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const PersonalInfo = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 879px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const PersonalInfoItem = styled.div`
	display: flex;
	align-items: center;
	height: 30px;
	gap: ${Common.space.spacingXl};
	div {
		display: flex;
		gap: ${Common.space.spacingLg};
		& > h5 {
			font-size: 18px;
		}

		& > p {
			color: ${Common.colors.gray};
			text-decoration: underline;
		}
	}
`;

const UserImage = styled.img`
	width: 200px;
	height: 200px;
	object-fit: cover;
	border-radius: 50%;
`;

export const Comment = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 879px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const CommentInfo = styled.div`
	height: 60px;
	margin-top: 7px;

	ul {
		display: flex;
		flex-direction: column;
		gap: 8px;

		li {
			display: flex;
			gap: ${Common.space.spacingMd};

			p {
				width: 100px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 18px;
				font-weight: ${Common.font.weight.bold};
			}

			span {
				width: 750px;
				color: ${Common.colors.gray};
				text-decoration: underline;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 16px;
			}
		}
	}
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	position: absolute;
	right: 5px;
	bottom: 3px;
	background-color: ${Common.colors.emphasize};
	width: 100px;
	height: 20px;
	text-align: center;
	line-height: 20px;
	font-size: 16px;
	border-radius: 10px;
	color: inherit;
	& > visited {
		color: inherit;
	}
`;

const InfoTitle = styled.h3`
	color: ${Common.colors.gray};
	position: absolute;
	top: 10px;
	left: 10px;
`;

const Title = styled.h3`
	color: ${Common.colors.gray};
`;

const Image = styled.img`
	width: 200px;
	height: 200px;
	object-fit: cover;
`;

const formatPhoneNumber = (phoneNumber: number) => {
	// Ensure the input is a string
	const cleaned = ("" + phoneNumber).replace(/\D/g, "");
	// Check if the input is of correct length
	if (cleaned.length === 11) {
		const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
		if (match) {
			return `${match[1]}-${match[2]}-${match[3]}`;
		}
	}
	return phoneNumber;
};

function MyPage() {
	useRequireAuth();

	const currentUser = useRecoilValue(currentUserState);

	const { data: userData, isLoading: isLoadingUserData } = useUserDataQuery(
		currentUser!._id.toString(),
	);

	const { data: userProducts, isLoading: isLoadingProducts } =
		useUserProductsQuery();

	const { data: userOrders, isLoading: isLoadingOrders } = useUserOrdersQuery();

	const { data: bookmarkDetails, isLoading: isLoadingBookmarks } =
		useUserBookmarksQuery();

	const { data: userReplies, isLoading: isLoadingUserReplies } =
		useUserRepliesQuery();

	const historyList = JSON.parse(
		sessionStorage.getItem("historyList") as string,
	);

	const profileImageUrl = userData?.extra?.profileImage || "/user.svg";

	return (
		<Section>
			<HelmetSetup title="My Page" description="마이페이지" url="mypage" />
			<MainTitle>마이페이지</MainTitle>
			<Article>
				<InfoTitle>내 정보</InfoTitle>
				{isLoadingUserData || isLoadingUserReplies ? (
					<UserDataSkeleton />
				) : (
					<>
						<UserImage
							src={profileImageUrl}
							alt={`${userData.name}님의 프로필 이미지`}
						/>
						<Info>
							<PersonalInfo>
								<Title>회원정보</Title>
								<PersonalInfoItem>
									<div>
										<h5>이메일 : </h5>
										<p>{userData.email}</p>
									</div>
									<div>
										<h5>이름 : </h5>
										<p>{userData.name}</p>
									</div>
									<div>
										<h5>휴대폰 번호 : </h5>
										<p>{formatPhoneNumber(userData.phone)}</p>
									</div>
								</PersonalInfoItem>
								<StyledLink to={`/user/edit`}>회원정보 수정</StyledLink>
							</PersonalInfo>
							<Comment>
								<Title>내가 쓴 댓글</Title>
								<CommentInfo>
									{userReplies ? (
										<ul>
											{userReplies.slice(0, 2).map((reply: Reply) => {
												return (
													<li key={reply._id}>
														<p>{reply.product.name}</p>
														<span>{reply.content}</span>
													</li>
												);
											})}
										</ul>
									) : (
										<span>작성한 댓글이 없습니다.</span>
									)}
								</CommentInfo>
								<StyledLink
									to={"/user/replies"}
									aria-label="내가 쓴 댓글 전체보기"
								>
									전체보기
								</StyledLink>
							</Comment>
						</Info>
					</>
				)}
			</Article>
			{isLoadingBookmarks ? (
				<MyPageListSkeleton />
			) : (
				<MyPageList
					title="북마크"
					data={isLoadingBookmarks ? [] : (bookmarkDetails || []).slice(0, 5)}
					emptyMessage="북마크가 없습니다."
					renderItem={(item) => (
						<Link to={`/product/${item.product_id}`}>
							<Image
								src={`${item.product.image.path}`}
								alt={`${item.product.name}의 앨범 아트`}
								onError={(e) => (e.currentTarget.src = "/alt_cover.png")}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl="/user/bookmarks"
				/>
			)}
			<MyPageList
				title="히스토리"
				data={historyList ? historyList.slice(0, 5) : []}
				emptyMessage="히스토리가 없습니다."
				renderItem={(item) => (
					<Link to={`/product/${item._id}`}>
						<Image
							src={`${item.mainImages[0].path}`}
							alt={`${item.name}의 앨범 아트`}
							onError={(e) => (e.currentTarget.src = "/alt_cover.png")}
						/>
					</Link>
				)}
			/>
			{isLoadingOrders ? (
				<MyPageListSkeleton />
			) : (
				<MyPageList
					title="구매내역"
					data={isLoadingOrders ? [] : (userOrders || []).slice(0, 5)}
					emptyMessage="구매내역이 없습니다."
					renderItem={(item) => (
						<Link to={`/product/${item.products[0]._id}`}>
							<Image
								src={item.products[0].image.path}
								alt={`${item.products[0].name}의 앨범 아트`}
								onError={(e) => (e.currentTarget.src = "/alt_cover.png")}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl="/user/orders"
				/>
			)}
			{isLoadingProducts ? (
				<MyPageListSkeleton />
			) : (
				<MyPageList
					title="판매상품관리"
					data={isLoadingProducts ? [] : (userProducts || []).slice(0, 5)}
					emptyMessage="판매내역이 없습니다."
					renderItem={(item) => (
						<Link to={`/productmanage/${item._id}`}>
							<Image
								src={`${item.mainImages[0].path}`}
								alt={`${item.name}의 앨범 아트`}
								onError={(e) => (e.currentTarget.src = "/alt_cover.png")}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl={`/user/products`}
				/>
			)}
		</Section>
	);
}

export default MyPage;
