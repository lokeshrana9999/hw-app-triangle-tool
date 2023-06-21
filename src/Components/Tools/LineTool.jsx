import { ReactComponent as LineIcon } from "../../icons/line-icon.svg";
import {
	getAngleBetweenLines,
	getPointOnLine,
	convertToSmallerPositiveAngle,
	getAbsoluteDifferenceBetweenAngles,
	compareLines,
} from "../Utils/misc";
export default class LineTool {
	constructor() {
		this.icon = LineIcon;
		this.tempState = false;
		this.lastPoint = null;
		this.key = "line";
	}

	onOpenAreaClick(coordinates, items) {
		if (!this.tempState) {
			// Add a new point to the
			items.lines.push([coordinates]);
			this.tempState = true;
			this.lastPoint = coordinates;
		} else {
			//Get index of line segment by this.lastPoint
			const index = items.lines.findIndex(
				(line) => line[0] === this.lastPoint
			);
			// Add the second point to the last line segment and finalize it.
			items.lines[index].push(coordinates);
			this.tempState = false;
		}
		return items;
	}

	Element(items) {
		const lines = items?.lines;
		if (!lines) return null;
		const elements = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length < 2) continue;
			const points = line
				.map((point) => `${point.x},${point.y}`)
				.join(" ");
			elements.push(
				<polyline
					key={i}
					strokeWidth="3"
					stroke="red"
					points={points}
				/>
			);
		}
		return elements;
	}

	PointElement(items, handlePointClick) {
		const lines = items?.lines;
		if (!lines) return null;
		const elements = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length < 2) continue;
			//Also push a point for each point in the line
			for (let j = 0; j < line.length; j++) {
				const point = line[j];
				//Check if point already exists
				if (
					elements.find(
						(element) =>
							element.props.cx === point.x &&
							element.props.cy === point.y
					)
				)
					continue;
				elements.push(
					<circle
						key={`${i}-${j}`}
						cx={point.x}
						cy={point.y}
						r="5"
						fill="blue"
						onClick={handlePointClick}
						// onClick={(event) => {
						// 	event.stopPropagation();
						// 	this.onClickPoint(point, items, setItems);
						// }}
						zIndex="100"
					/>
				);
			}
		}
		return elements;
	}
	TempStateElement(items, currCursorPos) {
		const lines = items?.lines;
		if (!lines) return null;
		if (!this.tempState) return null;
		const elements = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length > 1) continue;
			const points = `${line[0].x},${line[0].y} ${currCursorPos.x},${currCursorPos.y}`;
			elements.push(
				<polyline
					key={i}
					strokeWidth="3"
					stroke="green"
					points={points}
				/>
			);
			//Also push a point for each point in the line
			for (let j = 0; j < line.length; j++) {
				const point = line[j];
				//Check if point already exists
				if (
					elements.find(
						(element) =>
							element.props.cx === point.x &&
							element.props.cy === point.y
					)
				)
					continue;
				elements.push(
					<circle
						key={`${i}-${j}`}
						cx={point.x}
						cy={point.y}
						r="5"
						fill="yellow"
					/>
				);
			}
		}
		elements.push(
			<circle
				key="temp"
				cx={currCursorPos.x}
				cy={currCursorPos.y}
				r="5"
				fill="yellow"
			/>
		);
		return elements;
	}

	SecondaryElements(items) {
		//TODO: Calculate the length of each line and display it
		let tiltLabels = [];
		let angleLabels = [];
		const lines = items?.lines;
		if (!lines) return null;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length < 2) continue;
			const length = Math.sqrt(
				Math.pow(line[1].x - line[0].x, 2) +
					Math.pow(line[1].y - line[0].y, 2)
			);
			const tilt = Math.atan(
				(line[1].y - line[0].y) / (line[1].x - line[0].x)
			);
			const lengthLabel = length.toFixed(2);

			tiltLabels.push(
				<>
					<rect
						key={`${i}-rect`}
						x={(line[0].x + line[1].x) / 2 - 20}
						y={(line[0].y + line[1].y) / 2 - 20}
						width={40 + (lengthLabel.length + 3) * 10}
						height="23"
						fill="red"
					/>
					<text
						key={i}
						x={(line[0].x + line[1].x) / 2}
						y={(line[0].y + line[1].y) / 2}
						fontSize="20"
						fill="white"
						// transform={`rotate(${tilt * 180 / Math.PI}, ${(line[0].x + line[1].x) / 2}, ${(line[0].y + line[1].y) / 2})`}
					>
						{`${lengthLabel} cm`}
					</text>
				</>
			);
		}
		//TODO: Create line sets for common points and calculate the angle between them
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length < 2) continue;
			for (let j = 0; j < line.length; j++) {
				const point = line[j];
				let pointLines = [];
				for (let k = 0; k < lines.length; k++) {
					const line2 = lines[k];
					if (line2.length < 2) continue;
					for (let l = 0; l < line2.length; l++) {
						const point2 = line2[l];
						if (point2.x === point.x && point2.y === point.y) {
							//Found the point
							pointLines.push(lines[k]);
						}
					}
				}
				let anglesToBeDisplayed = [];
				if (pointLines.length > 1) {
					for (let k = 0; k < pointLines.length; k++) {
						const line1 = pointLines[k];
						for (let l = 0; l < pointLines.length; l++) {
							const line2 = pointLines[l];
							if (line1 === line2) continue;
							const referencePointIndexLine1 = line1.findIndex(
								(innerPoint) =>
									innerPoint.x === point.x &&
									innerPoint.y === point.y
							);
							const referencePointIndexLine2 = line2.findIndex(
								(innerPoint) =>
									innerPoint.x === point.x &&
									innerPoint.y === point.y
							);

							const angle = getAngleBetweenLines(
								line1,
								line2,
								referencePointIndexLine1,
								referencePointIndexLine2
							);

							//Check if line1 and line2's angle already exists in anglesToBeDisplayed
							const repeatAngle = anglesToBeDisplayed.filter(
								(angleToBeDisplayed) =>
									getAbsoluteDifferenceBetweenAngles(
										angleToBeDisplayed.angle,
										angle
									) === 0
							);
							let sameLines = false;
							if (repeatAngle.length > 0) {
								for (let m = 0; m < repeatAngle.length; m++) {
									const angleToBeDisplayed = repeatAngle[m];
									const angleToBeDisplayedLines =
										angleToBeDisplayed.lines;
									sameLines =
										compareLines(
											angleToBeDisplayedLines[0],
											line2
										) &&
										compareLines(
											angleToBeDisplayedLines[1],
											line1
										);
								}
							}
							if (sameLines) continue;

							//Calculate the points on either lines to display the arc
							const arcP1 = getPointOnLine(
								line1,
								referencePointIndexLine1,
								100
							);
							const arcP2 = getPointOnLine(
								line2,
								referencePointIndexLine2,
								100
							);
							anglesToBeDisplayed.push({
								angle: angle,
								arcP1: arcP1,
								arcP2: arcP2,
								lines: [line1, line2],
							});
						}
					}
				}
				console.log(
					"🚀 ~ file: LineTool.jsx:227 ~ LineTool ~ SecondaryElements ~ anglesToBeDisplayed:",
					anglesToBeDisplayed
				);
				for (let k = 0; k < anglesToBeDisplayed.length; k++) {
					const angle = anglesToBeDisplayed[k];
					const properAngle = angle.angle;

					console.log(
						"🚀 ~ file: LineTool.jsx:232 ~ LineTool ~ SecondaryElements ~ angle:",
						angle
					);
					const angleInDegrees = (properAngle * 180) / Math.PI;
					const angleLabel = angleInDegrees.toFixed(1);
					const arcP1 = angle.arcP1;
					const arcP2 = angle.arcP2;
					const angleLabelX = (arcP1.x + arcP2.x) / 2;
					const angleLabelY = (arcP1.y + arcP2.y) / 2;
					const angleLabelLength = angleLabel.length + 1;
					angleLabels.push(
						<>
							<path
								key={`${i}-${j}-${k}`}
								d={`M ${arcP1.x} ${arcP1.y} A ${angleInDegrees} ${angleInDegrees}, 0 0 0, ${arcP2.x} ${arcP2.y} L ${point.x} ${point.y} Z`}
								stroke="purple"
								strokeWidth="2"
								fill="purple"
							/>
							{/* <rect
								key={`${i}-${j}-${k}-rect`}
								x={angleLabelX - 20}
								y={angleLabelY - 20}
								width={40 + angleLabelLength * 10}
								height="23"
								fill="flourescent"
							/> */}
							<text
								key={`${i}-${j}-${k}-text`}
								x={angleLabelX}
								y={angleLabelY}
								fontSize="20"
                                fontWeight={700}
								fill="white"
							>
								{`${angleLabel}°`}
							</text>
							<circle
								key={`${i}-${j}`}
								cx={arcP1.x}
								cy={arcP1.y}
								r="5"
								fill="maroon"
								// onClick={handlePointClick}
								// onClick={(event) => {
								// 	event.stopPropagation();
								// 	this.onClickPoint(point, items, setItems);
								// }}
								zIndex="100"
							/>
							<circle
								key={`${i}-${j}`}
								cx={arcP2.x}
								cy={arcP2.y}
								r="5"
								fill="maroon"
								// onClick={handlePointClick}
								// onClick={(event) => {
								// 	event.stopPropagation();
								// 	this.onClickPoint(point, items, setItems);
								// }}
								zIndex="100"
							/>
						</>
					);
				}
			}
		}
		//TODO:

		return [tiltLabels, angleLabels];
	}
}
