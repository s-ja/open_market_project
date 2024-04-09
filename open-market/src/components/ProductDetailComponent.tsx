import {
	DetailBadge,
	DetailBadgeContainer,
} from "@/components/ProductDetailBadgeComponent";
import { ShowStarRating } from "@/components/ReplyComponent";
import { DetailControlPanel } from "@/components/audioPlayer/ControlPanel";
import { DetailPlayerSlider } from "@/components/audioPlayer/PlayerSlider";
import { Common } from "@/styles/common";
import { numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react";

interface DetailProps {
	product: Product | undefined;
	genre: string | undefined;
	rating: number;
	createdAt: string;
}

const ProductDetailArticle = styled.article`
	width: 1440px;
	height: 400px;
	margin: 0 auto;
	padding: ${Common.space.spacingXl};
	position: relative;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: ${Common.space.spacingXl};
	background-color: ${Common.colors.black};
	padding-top: 100px;
`;

const ProductMediaContainer = styled.div`
	width: 270px;
	height: 270px;
	position: relative;
	background-color: ${Common.colors.emphasize};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.8);

	img {
		width: 270px;
		height: 270px;
		object-fit: cover;
	}

	button {
		width: 70px;
		height: 70px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: transparent;
		border: none;
		font-size: 0;
	}

	.pauseButton {
		&::before {
			content: "";
			display: inline-block;
			margin-right: 20px;
			width: 10px;
			height: 70px;
			background-color: ${Common.colors.secondary};
		}
		&::after {
			content: "";
			display: inline-block;
			width: 10px;
			height: 70px;
			background-color: ${Common.colors.secondary};
		}
	}

	.playButton {
		&::after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			border-top: solid 35px transparent;
			border-bottom: solid 35px transparent;
			border-left: solid 54px ${Common.colors.secondary};
			border-right: solid 0px transparent;
		}
	}
`;

const ProductDetailInfo = styled.div`
	width: 670px;
	height: 270px;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	gap: 5px;
	color: ${Common.colors.white};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.8);

	.title {
		font-size: ${Common.font.size.xl};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.seller {
		font-size: ${Common.font.size.lg};
	}
`;

const ProductDetailContentContainer = styled.div`
	width: 425px;
	height: 160px;
	padding: ${Common.space.spacingMd};
	display: flex;
	flex-flow: column nowrap;
	gap: 5px;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	.genre {
		color: ${Common.colors.gray};
	}

	.tags {
		color: ${Common.colors.gray};
	}

	.content {
		height: 70px;
		color: ${Common.colors.black};
		white-space: pre-wrap;
		word-break: normal;
		overflow-wrap: break-word;
		overflow: auto;
	}

	.price {
		font-size: ${Common.font.size.lg};
		font-weight: ${Common.font.weight.bold};
		color: ${Common.colors.secondary};
		align-self: flex-end;

		&::after {
			content: "₩";
			margin-left: 2px;
			font-size: ${Common.font.size.sm};
		}
	}
`;

const ProductDetailExtra = styled.div`
	display: flex;
	flex-flow: column nowrap;
	align-items: flex-end;
	gap: 5px;
	position: relative;
	top: -98px;

	.rating {
		margin-left: 5px;
		color: ${Common.colors.white};
		position: relative;
		top: -6px;
	}
`;

function ProductDetailComponent({
	product,
	genre,
	rating,
	createdAt,
}: DetailProps) {
	const audioRef = useRef(null);
	const [percentage, setPercentage] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const audio = audioRef.current! as HTMLAudioElement;

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		audio.currentTime =
			(+product?.extra?.soundFile?.duration?.toFixed(2)! / 100) *
			parseInt(target.value);
		setPercentage(parseInt(target.value));
	}

	function getCurrentDuration(e: SyntheticEvent<HTMLAudioElement>) {
		const percent = (
			(e.currentTarget.currentTime / +product?.extra?.soundFile.duration!) *
			100
		).toFixed(2);
		const time = e.currentTarget.currentTime;

		setPercentage(+percent);
		setCurrentTime(+time.toFixed(2));
	}

	function handlePlayAndPauseMusic() {
		const audio = audioRef.current! as HTMLAudioElement;
		if (!audio) return;
		audio.volume = 0.1;

		if (!isPlaying) {
			setIsPlaying(true);
			audio.play();
		}

		if (isPlaying) {
			setIsPlaying(false);
			audio.pause();
		}
	}

	useEffect(() => {
		if (audio) {
			const handleAudioEnd = () => {
				setIsPlaying(false);
				setPercentage(0);
				audio.currentTime = 0;
			};

			audio.addEventListener("ended", handleAudioEnd);

			return () => {
				audio.removeEventListener("ended", handleAudioEnd);
			};
		}
	}, [percentage]);

	return (
		<ProductDetailArticle>
			<DetailPlayerSlider onChange={onChange} percentage={percentage} />
			<ProductMediaContainer>
				<img
					src={product?.mainImages[0].path}
					alt={`${product?.name} 앨범 아트`}
				/>
				{isPlaying ? (
					<button className="pauseButton" onClick={handlePlayAndPauseMusic}>
						pause
					</button>
				) : (
					<button className="playButton" onClick={handlePlayAndPauseMusic}>
						play
					</button>
				)}
				<audio
					src={product?.extra?.soundFile?.path!}
					ref={audioRef}
					onTimeUpdate={getCurrentDuration}
				/>
				<DetailControlPanel
					duration={+product?.extra?.soundFile?.duration?.toFixed(2)!}
					currentTime={currentTime}
				/>
			</ProductMediaContainer>
			<ProductDetailInfo>
				<span className="title">{product?.name}</span>
				<span className="seller">{product?.extra?.sellerName}</span>
				<span>{createdAt}</span>
				<ProductDetailContentContainer>
					<span className="genre">{genre}</span>
					<span className="tags">
						{product?.extra?.tags.map((tag) => `#${tag} `)}
					</span>
					<div className="content">{product?.content}</div>
					<span className="price">{numberWithComma(product?.price!)}</span>
				</ProductDetailContentContainer>
			</ProductDetailInfo>
			<ProductDetailExtra>
				<DetailBadgeContainer>
					{product?.extra?.isNew ? (
						<DetailBadge isNew>
							<StarIcon fontSize="small" />
							New!
						</DetailBadge>
					) : (
						<></>
					)}
					{product?.extra?.isBest ? (
						<DetailBadge isBest>
							<ThumbUpIcon fontSize="small" />
							Best!
						</DetailBadge>
					) : (
						<></>
					)}
				</DetailBadgeContainer>
				<div>
					<ShowStarRating rating={rating} />
					<span className="rating">{rating}</span>
				</div>
			</ProductDetailExtra>
		</ProductDetailArticle>
	);
}

export default ProductDetailComponent;
