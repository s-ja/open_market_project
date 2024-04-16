import HelmetSetup from "@/components/HelmetSetup";
import MyPageList from "@/components/MyPageList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { currentUserState } from "@/states/authState";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import Skeleton from "@mui/material/Skeleton";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
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
	padding-left: 100px;
	display: flex;
	gap: 20px;
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const PersonalInfo = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 979px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const PersonalInfoItem = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	width: 960px;
	height: 60px;
	gap: 5px;
	div {
		display: flex;
		gap: 10px;
		& > * {
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
		}
		& > h5 {
			width: 100px;
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

const Comment = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 979px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const CommentInfo = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 5px;
	height: 60px;
	& > div {
		display: flex;
		& > * {
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
		}
		& > h5 {
			width: 100px;
		}
		& > p {
			color: ${Common.colors.gray};
			text-decoration: underline;
		}
	}
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	position: absolute;
	right: 5px;
	bottom: 3px;
	background-color: ${Common.colors.emphasize};
	width: 83px;
	height: 18px;
	text-align: center;
	line-height: 18px;
	font-size: ${Common.font.size.sm};
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

async function fetchUserInfo(userId: string) {
	const response = await axiosInstance.get(`/users/${userId}`);
	return response.data.item;
}

async function fetchUserProductsInfo() {
	const response = await axiosInstance.get(`/seller/products/`);
	return response.data.item;
}

async function fetchUserOrderInfo() {
	const response = await axiosInstance.get(`/orders`);
	return response.data.item;
}

async function fetchBookmarks() {
	const response = await axiosInstance.get(`/bookmarks`);
	return response.data.item;
}

function MyPage() {
	useRequireAuth();

	const currentUser = useRecoilValue(currentUserState);

	const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
		queryKey: ["userInfo", currentUser?._id.toString()],
		queryFn: () => fetchUserInfo(currentUser!._id.toString()),
	});
	const { data: userProductsInfo, isLoading: isLoadingProductsInfo } = useQuery(
		{
			queryKey: ["userProducts", currentUser?._id.toString()],
			queryFn: () => fetchUserProductsInfo(),
		},
	);
	const { data: userOrdersInfo, isLoading: isLoadingOrdersInfo } = useQuery({
		queryKey: ["userOrders", currentUser?._id.toString()],
		queryFn: () => fetchUserOrderInfo(),
	});
	const { data: bookmarkDetails, isLoading: isLoadingBookmarks } = useQuery({
		queryKey: ["bookmarks", currentUser?._id.toString()],
		queryFn: () => fetchBookmarks(),
	});

	const historyList = JSON.parse(
		sessionStorage.getItem("historyList") as string,
	);

	const profileImageUrl = userInfo?.extra?.profileImage || "/user.svg";

	const UserInfoSkeleton = () => (
		<>
			<Skeleton variant="circular" width={200} height={200} />
			<Info>
				<PersonalInfo>
					<Skeleton variant="text" width={100} height={24} />
					<Skeleton variant="text" width={960} height={12} />
					<Skeleton variant="text" width={960} height={12} />
				</PersonalInfo>
				<Comment>
					<Skeleton variant="text" width={100} height={24} />
					<Skeleton variant="text" width={960} height={12} />
					<Skeleton variant="text" width={960} height={12} />
				</Comment>
			</Info>
		</>
	);

	return (
		<Section>
			<HelmetSetup title="My Page" description="마이페이지" url="mypage" />
			<MainTitle>마이페이지</MainTitle>
			<Article>
				<InfoTitle>내 정보</InfoTitle>
				{isLoadingUserInfo ? (
					<UserInfoSkeleton />
				) : (
					<>
						<UserImage
							src={profileImageUrl}
							alt={`${userInfo.name} 프로필 이미지`}
						/>
						<Info>
							<PersonalInfo>
								<Title>회원정보</Title>
								<PersonalInfoItem>
									<div>
										<h5>이메일</h5>
										<p>{userInfo.email}</p>
									</div>
									<div>
										<h5>이름</h5>
										<p>{userInfo.name}</p>
									</div>
									<div>
										<h5>휴대폰 번호</h5>
										<p>{userInfo.phone}</p>
									</div>
								</PersonalInfoItem>
								<StyledLink to={`/useredit/${currentUser!._id}`}>
									회원정보 수정
								</StyledLink>
							</PersonalInfo>
							<Comment>
								<Title>내가 쓴 댓글</Title>
								<CommentInfo>
									<div>
										<h5>게시글 제목</h5>
										<p>내용</p>
									</div>
									<div>
										<h5>게시글 제목</h5>
										<p>내용</p>
									</div>
									<div>
										<h5>게시글 제목</h5>
										<p>내용</p>
									</div>
								</CommentInfo>
								<StyledLink to="/">전체보기</StyledLink>
							</Comment>
						</Info>
					</>
				)}
			</Article>
			{isLoadingBookmarks ? (
				<Skeleton
					variant="rounded"
					width="100%"
					height={241}
					animation="wave"
				/>
			) : (
				<MyPageList
					title="북마크"
					data={isLoadingBookmarks ? [] : (bookmarkDetails || []).slice(0, 5)}
					emptyMessage="북마크가 없습니다."
					renderItem={(item) => (
						<Link to={`/productdetail/${item.product_id}`}>
							<Image
								src={`${item.product.image.path}`}
								alt={`${item.product.name} 앨범 아트`}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl="/userbookmarks"
				/>
			)}
			<MyPageList
				title="히스토리"
				data={historyList ? historyList.slice(0, 5) : []}
				emptyMessage="히스토리가 없습니다."
				renderItem={(item) => (
					<Link to={`/productdetail/${item._id}`}>
						<Image
							src={`${item.mainImages[0].path}`}
							alt={`${item.name} 앨범 아트`}
						/>
					</Link>
				)}
			/>
			{isLoadingProductsInfo ? (
				<Skeleton
					variant="rounded"
					width="100%"
					height={241}
					animation="wave"
				/>
			) : (
				<MyPageList
					title="구매내역"
					data={isLoadingOrdersInfo ? [] : (userOrdersInfo || []).slice(0, 5)}
					emptyMessage="구매내역이 없습니다."
					renderItem={(item) => (
						<Link to={`/productdetail/${item.products[0]._id}`}>
							<Image
								src={item.products[0].image.path}
								alt={`${item.products[0].name} 앨범 아트`}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl="/orders"
				/>
			)}
			{isLoadingOrdersInfo ? (
				<Skeleton
					variant="rounded"
					width="100%"
					height={241}
					animation="wave"
				/>
			) : (
				<MyPageList
					title="판매상품관리"
					data={
						isLoadingProductsInfo ? [] : (userProductsInfo || []).slice(0, 5)
					}
					emptyMessage="판매내역이 없습니다."
					renderItem={(item) => (
						<Link to={`/productmanage/${item._id}`}>
							<Image
								src={`${item.mainImages[0].path}`}
								alt={`${item.name} 앨범 아트`}
							/>
						</Link>
					)}
					linkText="전체보기"
					linkUrl={`/user/${currentUser!._id}/products`}
				/>
			)}
		</Section>
	);
}

export default MyPage;
