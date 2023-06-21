import { ReactComponent as LineIcon } from "../../icons/line-icon.svg";

export default class LineTool {
	constructor() {
		this.icon = LineIcon;
		this.tempState = false;
		this.lastPoint = null;
		this.key = "line";
	}

	onOpenAreaClick(coordinates, items) {
        console.log("🚀 ~ file: LineTool.jsx:13 ~ LineTool ~ onOpenAreaClick ~ this.tempState:", this.tempState)
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

	onElementClick() {
		// No state changes for the Line Tool on element clicks.
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

	// onClickPoint(coordinates, items, setItems) {
	// 	console.log("🚀 ~ file: LineTool.jsx:146 ~ LineTool ~ onClickPoint ~ coordinates:", items, this.tempState, coordinates)
	// 	if (this.tempState) {
	// 		//Find current point index
	// 		const index = items.lines.findIndex(
	// 			(line) => line[0] === this.lastPoint
	// 		);

	// 		// Add the clicked point to the last line segment and finalize it.
	// 		items.lines[index].push(coordinates);
	// 		this.tempState = false;
    //         setItems(items);
	// 	} else {
	// 		// Start a new line segment with the clicked point.
	// 		items.lines.push([coordinates]);
	// 		this.tempState = true;
	// 		this.lastPoint = coordinates;
    //         setItems(items);
	// 	}
	// }
}
