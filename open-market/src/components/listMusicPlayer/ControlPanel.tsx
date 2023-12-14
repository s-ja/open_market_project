import { Common } from "@/styles/common";
import styled from "@emotion/styled";

const StyledControlPanel = styled("div")`
	width: 90%;
	margin-left: 60px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	position: absolute;
	bottom: 8px;
	left: 0;
	font-size: ${Common.font.size.sm};
`;

function ControlPanel({
	duration,
	currentTime,
}: {
	duration: number;
	currentTime: number;
}) {
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

	return (
		<StyledControlPanel>
			<span>{secondsToHms(currentTime)}</span>
			<span>{secondsToHms(duration)}</span>
		</StyledControlPanel>
	);
}
export default ControlPanel;