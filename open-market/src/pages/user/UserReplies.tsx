import HelmetSetup from "@/components/HelmetSetup";
import { UserRepliesListItem } from "@/components/ProductListComponent";
import { ProductListSkeleton } from "@/components/SkeletonUI";
import { useUserRepliesQuery } from "@/hooks/reply/queries/useUserRepliesQuery";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	Heading,
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { useEffect, useState } from "react";

export default function UserReplies() {
	useRequireAuth();

	const { data: userReplies, isLoading: isLoadingUserReplies } =
		useUserRepliesQuery();

	const [displayReplies, setDisplayReplies] = useState<Reply[]>([]);
	const [currentPage, setCurrentPage] = useState(2);
	const REPLIES_PER_PAGE = 4;

	function handleMoreReplies() {
		const newPage = currentPage + 1;
		const newReplies = userReplies!.slice(
			currentPage * REPLIES_PER_PAGE,
			newPage * REPLIES_PER_PAGE,
		);
		setDisplayReplies((prev) => [...prev, ...newReplies]);
		setCurrentPage(newPage);
	}

	useEffect(() => {
		if (userReplies) {
			setDisplayReplies(userReplies.slice(0, currentPage * REPLIES_PER_PAGE));
		}
	}, [userReplies]);

	return (
		<ProductSection>
			<HelmetSetup
				title="My Replies"
				description="작성한 댓글 목록"
				url="/user/replies"
			/>
			<Heading>내가 쓴 댓글</Heading>
			{isLoadingUserReplies ? (
				<ProductListSkeleton />
			) : (
				<ProductContainer height="633px">
					<ProductList>
						{userReplies !== undefined && userReplies?.length === 0 ? (
							<p>댓글이 없습니다.</p>
						) : (
							displayReplies?.map((reply) => {
								return <UserRepliesListItem reply={reply} />;
							})
						)}
					</ProductList>
					{userReplies !== undefined &&
					currentPage * REPLIES_PER_PAGE < userReplies?.length ? (
						<MoreButton
							onClick={handleMoreReplies}
							aria-label="댓글을 추가로 더 표시합니다."
						>
							더보기
						</MoreButton>
					) : (
						<MoreButton
							disabled
							isDisable
							aria-label="더이상 표시할 댓글이 없습니다."
						>
							더보기
						</MoreButton>
					)}
				</ProductContainer>
			)}
		</ProductSection>
	);
}
