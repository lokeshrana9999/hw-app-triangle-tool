import React, { useState } from "react";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import LineTool from "./Tools/LineTool";
const lineTool = new LineTool();

const tools = [lineTool];
const DrawingBoard = () => {
	const [activeTool, setActiveTool] = useState(null);
	const [items, setItems] = useState({
		lines: [],
	});
	console.log(
		"🚀 ~ file: DrawingBoard.jsx:10 ~ DrawingBoard ~ items:",
		items
	);

	// Instantiate the tools.

	// Function to handle clicks on the drawing board's open area.
	const handleOpenAreaClick = (coordinates) => {
		if (activeTool) {
			const modifiedItems = activeTool.onOpenAreaClick(
				coordinates,
				items
			);
			setItems({ ...modifiedItems });
		}
		// if (state.activeTool) {
		// 	state.activeTool.onOpenAreaClick(coordinates, state);
		// 	setState({ ...state }); // This will cause the component to re-render.
		// }
	};

	// Function to handle clicks on a drawing element.
	const handleElementClick = (coordinates) => {
		// if (activeTool) {
		// 	activeTool.onClickPoint(coordinates, state);
		// 	setState({ ...state }); // This will cause the component to re-render.
		// }
	};

	return (
		<div className="drawing-board-wrapper">
			{/* <button onClick={() => setState({ ...state, activeTool: lineTool })}>
        Select Line Tool
      </button> */}
			<Toolbar
				tools={tools}
				setActiveTool={setActiveTool}
				activeTool={activeTool}
			/>
			<Canvas
				tools={tools}
				activeTool={activeTool}
				items={items}
				handleOpenAreaClick={handleOpenAreaClick}
                setItems={setItems}
			/>
		</div>
	);
};

export default DrawingBoard;
