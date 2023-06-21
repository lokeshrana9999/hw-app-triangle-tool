import React from "react";

const Toolbar = (props) => {
	const { tools, activeTool, setActiveTool } = props;
	return (
		<div className="toolbar-wrapper">
			{tools.map((tool) => {
				const currentToolActive =
					activeTool && activeTool.key === tool.key;
				return (
					<button
						key={tool.key}
						className={`toolbar-button ${
							currentToolActive ? "toolbar-button-active" : ""
						}`}
						onClick={() => {
							currentToolActive
								? setActiveTool(null)
								: setActiveTool(tool);
						}}
					>
						<tool.icon />
					</button>
				);
			})}
		</div>
	);
};

export default Toolbar;
