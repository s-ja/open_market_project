import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface DisplayProps {
	showable?: boolean;
}

const StyledControlPanel = styled.div<DisplayProps>`
	display: ${(props) => (props.showable ? "flex" : "none")};
	width: 90%;
	margin-left: 60px;
	flex-flow: row nowrap;
	justify-content: space-between;
	position: absolute;
	bottom: 8px;
	left: 0;
	font-size: ${Common.font.size.sm};
`;

const StyledDetailControlPanel = styled.div`
	color: white;
	position: relative;
	top: 5px;
	font-size: ${Common.font.size.sm};

	span:first-of-type::after {
		content: " / ";
	}
`;

function secondsToHms(seconds: number) {
	if (!seconds) return "00:00";

	let duration = seconds;
	let currentHours = duration / 3600;
	duration = duration % 3600;

	let currentMin: number | string = parseInt(String(duration / 60));
	duration = duration % 60;

	let currentSeconds: number | string = parseInt(String(duration));

	if (currentSeconds < 10) {
		currentSeconds = `0${currentSeconds}`;
	}
	if (currentMin < 10) {
		currentMin = `0${currentMin}`;
	}

	if (parseInt(String(currentHours), 10) > 0) {
		return `${parseInt(
			String(currentHours),
			10,
		)}:${currentMin}:${currentSeconds}`;
	} else if (currentMin == 0) {
		return `00:${currentSeconds}`;
	} else {
		return `${currentMin}:${currentSeconds}`;
	}
}

export function ListControlPanel({
	duration,
	currentTime,
	showable,
}: {
	duration: number;
	currentTime: number;
	showable?: boolean;
}) {
	return (
		<StyledControlPanel
			showable={showable}
			aria-label={`${secondsToHms(duration)} 중 현재 ${secondsToHms(
				currentTime,
			)}을 재생중입니다.`}
		>
			<span>{secondsToHms(currentTime)}</span>
			<span>{secondsToHms(duration)}</span>
		</StyledControlPanel>
	);
}

export function DetailControlPanel({
	duration,
	currentTime,
}: {
	duration: number;
	currentTime: number;
}) {
	return (
		<StyledDetailControlPanel
			aria-label={`${secondsToHms(duration)} 중 현재 ${secondsToHms(
				currentTime,
			)}을 재생중입니다.`}
		>
			<span>{secondsToHms(currentTime)}</span>
			<span>{secondsToHms(duration)}</span>
		</StyledDetailControlPanel>
	);
}
