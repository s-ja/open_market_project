import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";

interface ReplyProps {
	user?: boolean;
}

export const ReplyContainer = styled.article`
	width: 1160px;
	min-height: 346px;
	padding: ${Common.space.spacingMd};
	margin: ${Common.space.spacingXl} auto;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	position: relative;
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;

	h3 {
		position: absolute;
		top: -40px;
		left: 0;

		& :first-of-type {
			margin-right: 5px;
			position: relative;
			top: 6px;
			color: ${Common.colors.gray2};
		}
	}
`;

const StyledReplyListItem = styled.li`
	width: 100%;
	margin: ${Common.space.spacingMd} 0;
	display: flex;
	flex-flow: column nowrap;
	position: relative;
`;

export const ReplyBlock = styled.div<ReplyProps>`
	width: ${(props) => (props.user ? "260px" : "100%")};
	min-height: ${(props) => (props.user ? "24px" : "40px")};
	height: auto;
	white-space: pre-wrap;
	word-break: normal;
	overflow-wrap: break-word;
	padding: ${(props) =>
		props.user ? `0 ${Common.space.spacingMd}` : `${Common.space.spacingMd}`};
	display: flex;
	flex-flow: column nowrap;
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;
	${(props) =>
		!props.user &&
		`
    line-height: ${Common.space.spacingXl};
  `};

	${(props) =>
		props.user &&
		`
    justify-content: center;
    position: absolute;
    top: 1px;
    left: ${Common.space.spacingXl};
  `};

	& :last-of-type {
		display: ${(props) => (props.user ? "relative" : "flex")};
		justify-content: ${(props) => (props.user ? "" : "flex-end")};
	}
`;

export const ReplyInputForm = styled.form`
	position: relative;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.replyTextAreaContainer {
		width: 100%;
		height: 80px;
		border: 1px solid ${Common.colors.gray};
		border-radius: 10px;
	}

	.inputRating {
		position: absolute;
		top: -2px;
		left: 300px;
	}

	button {
		width: 100px;
		height: 24px;
		position: absolute;
		bottom: 5px;
		right: 5px;
		color: ${Common.colors.black};
		font-weight: ${Common.font.weight.bold};
		background-color: ${Common.colors.emphasize};
		border: none;
		border-radius: 10px;

		&:disabled {
			cursor: not-allowed;
		}
	}
`;

export const ReplyUserProfileImage = styled.img`
	width: 25px;
	height: 25px;
	border: 2px solid ${Common.colors.black};
	border-radius: 50%;
	object-fit: cover;
`;

export const ReplyTextarea = styled(ReplyBlock)`
	height: 50px;
	line-height: normal;
	word-break: normal;
	border-width: 0;
	background-color: ${Common.colors.white};
	resize: none;
`.withComponent("textarea");

export function ShowStarRating({ rating }: { rating: number }) {
	return (
		<Rating
			name="showRating"
			value={Number(rating)}
			precision={0.5}
			readOnly
			emptyIcon={
				<StarIcon
					style={{ color: `${Common.colors.gray2}` }}
					fontSize="inherit"
				/>
			}
			aria-label={`매겨진 별점은 ${Number(rating)}점 입니다.`}
		/>
	);
}

function ReplyListItem({ reply }: { reply: Reply }) {
	return (
		<StyledReplyListItem key={reply._id}>
			<div>
				{reply?.extra?.profileImage ? (
					<ReplyUserProfileImage
						src={reply.extra?.profileImage}
						alt={`${reply.user.name}님의 프로필 이미지`}
					/>
				) : (
					<span aria-label={`${reply.user.name}님의 프로필 이미지`}>
						<AccountCircleIcon />
					</span>
				)}

				<ReplyBlock user aria-label="댓글을 작성한 사람">
					{reply.user.name}
				</ReplyBlock>
			</div>
			<ReplyBlock>
				<span aria-label="작성된 댓글 내용">{reply.content}</span>
				<ShowStarRating rating={reply.rating} />
			</ReplyBlock>
		</StyledReplyListItem>
	);
}

export default ReplyListItem;
