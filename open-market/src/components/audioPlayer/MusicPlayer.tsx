import { AudioSkeleton } from "@/components/SkeletonUI";
import { ListControlPanel } from "@/components/audioPlayer/ControlPanel";
import PlayerSlider from "@/components/audioPlayer/PlayerSlider";
import { currentAudioIdState } from "@/states/audioPlayerState";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useRecoilState } from "recoil";

interface MusicPlayerProps {
	audioId: number;
	soundFile: ProductFiles;
	showable?: boolean;
	name: string;
}

interface WidthProps {
	showable?: boolean;
}

const PlayerContainer = styled.div<WidthProps>`
	width: auto;
	min-width: ${(props) => (props.showable ? "600px;" : "65px")};
	overflow: hidden;
	padding: ${Common.space.spacingMd};
	display: flex;
	flex-flow: row wrap;
	gap: 10px;
	align-items: center;
	flex: ${(props) => (props.showable ? "1" : "0")};
	position: relative;
`;

const PlayButton = styled.button`
	background-color: transparent;
	border: none;
`;

function MusicPlayer({ soundFile, audioId, showable, name }: MusicPlayerProps) {
	const [currentAudioId, setCurrentAudioId] =
		useRecoilState(currentAudioIdState);

	const [isLoaded, setIsLoaded] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const audioRef = useRef(null);

	const audio = audioRef.current! as HTMLAudioElement;

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		audio.currentTime =
			(+soundFile.duration!.toFixed(2) / 100) * parseInt(target.value);
		setPercentage(parseInt(target.value));
	}

	function handlePlayAndPauseMusic() {
		if (!audio) return;
		audio.volume = 0.1;

		if (currentAudioId === audioId) {
			if (isPlaying) {
				setCurrentAudioId(null);
				setIsPlaying(false);
				audio.pause();
			} else {
				setIsPlaying(true);
				audio.play();
			}
		} else {
			setCurrentAudioId(audioId);
			setIsPlaying(true);
			audio.play();
		}
	}

	function getCurrentDuration(e: SyntheticEvent<HTMLAudioElement>) {
		const percent = (
			(e.currentTarget.currentTime / +soundFile.duration!) *
			100
		).toFixed(2);
		const time = e.currentTarget.currentTime;

		setPercentage(+percent);
		setCurrentTime(+time.toFixed(2));
	}

	useEffect(() => {
		if (audioRef.current) {
			const audio = audioRef.current as HTMLAudioElement;

			function onCanPlay() {
				setIsLoaded(true);
			}

			audio.addEventListener("loadeddata", onCanPlay);
			audio.addEventListener("canplay", onCanPlay);

			return () => {
				audio.removeEventListener("loadeddata", onCanPlay);
				audio.removeEventListener("canplay", onCanPlay);
			};
		}
	}, [audioRef.current]);

	useEffect(() => {
		if (audio) {
			function handleAudioEnd() {
				setIsPlaying(false);
				setPercentage(0);
				audio.currentTime = 0;
			}

			audio.addEventListener("ended", handleAudioEnd);

			return () => {
				audio.removeEventListener("ended", handleAudioEnd);
			};
		}
	}, [percentage]);

	useEffect(() => {
		if (!audio) return;

		if (isPlaying) {
			audio.play();
		} else {
			audio.pause();
		}
	}, [isPlaying, audioRef]);

	useEffect(() => {
		if (audio && currentAudioId !== audioId) {
			audio.pause();
		}
	}, [currentAudioId, audioId]);

	useEffect(() => {
		if (currentAudioId !== audioId && isPlaying) {
			setIsPlaying(false);
		}
	}, [currentAudioId, audioId, isPlaying]);

	return (
		<PlayerContainer showable={showable}>
			<audio
				ref={audioRef}
				onTimeUpdate={getCurrentDuration}
				onLoadedData={() => {
					setDuration(+soundFile.duration!.toFixed(2));
				}}
				src={soundFile?.path}
				preload="auto"
			/>
			{isLoaded ? (
				<>
					<PlayButton onClick={handlePlayAndPauseMusic}>
						{isPlaying ? (
							<span aria-label={`${name} 음원의 재생을 멈춥니다.`}>
								<PauseIcon fontSize="large" />
							</span>
						) : (
							<span aria-label={`${name} 음원을 재생합니다.`}>
								<PlayArrowIcon fontSize="large" />
							</span>
						)}
					</PlayButton>
					<PlayerSlider
						onChange={onChange}
						percentage={percentage}
						showable={showable}
					/>
					<ListControlPanel
						duration={duration}
						currentTime={currentTime}
						showable={showable}
					/>
				</>
			) : (
				<AudioSkeleton />
			)}
		</PlayerContainer>
	);
}

export default MusicPlayer;
