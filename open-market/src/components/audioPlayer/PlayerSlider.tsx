import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";

interface DisplayProps {
	showable?: boolean;
	isDetail?: boolean;
}

const SliderContainer = styled.div<DisplayProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: ${(props) => (props.isDetail ? "100%" : "90%")};
	height: auto;
	background-color: transparent;
	${(props) =>
		props.isDetail
			? `position: absolute;
	       bottom: -9px;
	       right: 0;`
			: `position: relative`};

	/*  Hide Original */
	.range {
		appearance: none;
		margin: 0 auto;
		background-color: ${Common.colors.gray2};
		width: 100%;
		height: ${(props) => (props.isDetail ? "3px" : "24px")};
		opacity: 0;
		border-radius: 10px;
		cursor: pointer;
	}

	.sliderContainer {
		--progress-bar-height: ${(props) => (props.isDetail ? "3px" : "4px")};
		position: relative;
		width: 100%;
	}

	.sliderContainer::before {
		content: "";
		background-color: ${Common.colors.gray};
		width: ${(props) => (props.isDetail ? "100%" : "99.5%")};
		height: ${(props) => (props.isDetail ? "3px" : "12px")};
		display: block;
		position: absolute;
		border-radius: 10px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		opacity: 1;
	}

	/* Custom Progress Bar */
	.progressBarCover {
		background-color: ${(props) =>
			props.isDetail
				? `${Common.colors.primary}`
				: `${Common.colors.emphasize}`};
		width: 80%;
		height: ${(props) => (props.isDetail ? "3px" : "12px")};
		display: block;
		position: absolute;
		border-radius: 10px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		user-select: none;
		pointer-events: none;
	}

	/* thumb */
	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		background-color: white;
		width: 20px;
		height: 20px;
	}

	.thumb {
		z-index: 10;
		position: absolute;
		border-radius: 50%;
		top: 50%;
		transform: translate(0%, -50%);
		pointer-events: none;
		user-select: none;
	}
`;

function PlayerSlider({
	onChange,
	percentage,
	showable,
	isDetail,
}: {
	onChange: ChangeEventHandler;
	percentage: number;
	showable?: boolean;
	isDetail?: boolean;
}) {
	const [position, setPosition] = useState(0);
	const [marginLeft, setMarginLeft] = useState(0);
	const [progressBarWidth, setProgressBarWidth] = useState(0);

	const rangeRef = useRef(null);
	const thumbRef = useRef(null);

	useEffect(() => {
		const rangeWidth = (rangeRef.current! as Element).getBoundingClientRect()
			.width;
		const thumbWidth = (thumbRef.current! as Element).getBoundingClientRect()
			.width;
		const centerThumb = (thumbWidth / 100) * percentage * -1;
		const centerProgressBar =
			thumbWidth +
			(rangeWidth / 100) * percentage -
			(thumbWidth / 100) * percentage;
		setPosition(percentage);
		setMarginLeft(centerThumb);
		setProgressBarWidth(centerProgressBar);
	}, [percentage]);

	return (
		<SliderContainer showable={showable} isDetail={isDetail}>
			<div className="sliderContainer">
				<div
					className="progressBarCover"
					style={{ width: `${progressBarWidth}px` }}
				></div>
				<div
					className="thumb"
					ref={thumbRef}
					style={{
						left: `${position}%`,
						marginLeft: `${marginLeft}px`,
					}}
				></div>
				<input
					type="range"
					value={position}
					ref={rangeRef}
					step={0.01}
					className="range"
					onChange={onChange}
				/>
			</div>
		</SliderContainer>
	);
}

export default PlayerSlider;
