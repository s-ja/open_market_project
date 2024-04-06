import ControlPanel from "@/components/listMusicPlayer/ControlPanel";
import PlayerSlider from "@/components/listMusicPlayer/PlayerSlider";
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

interface MusicPlayerProps {
	soundFile: ProductFiles;
	showable?: boolean;
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

function MusicPlayer({ soundFile, showable }: MusicPlayerProps) {
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
		<PlayerContainer showable={showable}>
			<PlayButton onClick={handlePlayAndPauseMusic}>
				{isPlaying ? (
					<PauseIcon fontSize="large" />
				) : (
					<PlayArrowIcon fontSize="large" />
				)}
			</PlayButton>
			<PlayerSlider
				onChange={onChange}
				percentage={percentage}
				showable={showable}
			/>
			<audio
				ref={audioRef}
				onTimeUpdate={getCurrentDuration}
				onLoadedData={() => {
					setDuration(+soundFile.duration!.toFixed(2));
				}}
				src={soundFile?.path}
			/>
			<ControlPanel
				duration={duration}
				currentTime={currentTime}
				showable={showable}
			/>
		</PlayerContainer>
	);
}

export default MusicPlayer;
