import React, { useState, useEffect, useMemo, useCallback } from "react";

const SVGGridBackground = () => {
	return (
		<>
			<defs>
				<pattern
					id="smallGrid"
					width="8"
					height="8"
					patternUnits="userSpaceOnUse"
				>
					<path
						d="M 8 0 L 0 0 0 8"
						fill="none"
						stroke="gray"
						stroke-width="0.5"
					/>
				</pattern>
				<pattern
					id="grid"
					width="80"
					height="80"
					patternUnits="userSpaceOnUse"
				>
					<rect width="80" height="80" fill="url(#smallGrid)" />
					<path
						d="M 80 0 L 0 0 0 80"
						fill="none"
						stroke="gray"
						stroke-width="1"
					/>
				</pattern>
			</defs>

			<rect width="100%" height="100%" fill="url(#grid)" />
		</>
	);
};

const Canvas = (props) => {
	const svgRef = React.useRef(null);
	const { handleOpenAreaClick, tools, items, activeTool, setItems } = props;
	const [referencePoint, setReferencePointSvg] = useState({
		x: 0,
		y: 0,
	});
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const handleMouseMove = useCallback(
		(event) => {
			const { clientX, clientY } = event;
			const { x, y } = referencePoint;

			setMousePosition({ x: clientX - x, y: clientY - y });
		},
		[referencePoint]
	);

	useEffect(() => {
		const updateReferencePoint = () => {
			const svgElement = svgRef.current;
			if (svgElement) {
				const item = svgElement.getBoundingClientRect();
				const { left, top } = item;
				setReferencePointSvg({ x: left, y: top });
			}
		};

		updateReferencePoint(); // Initial update

		const handleResize = () => {
			updateReferencePoint();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [referencePoint]);
	const handleCanvasClick = (event) => {
		const { pageX, pageY } = event;
		const coordinates = {
			x: pageX - referencePoint.x,
			y: pageY - referencePoint.y,
		};
		handleOpenAreaClick(coordinates);
	};

	const handlePointClick = (event) => {
        event.stopPropagation();
		const eventTarget = event.target;
		const { cx, cy } = eventTarget.attributes;
		const coordinates = {
			x: Number(cx.value),
			y: Number(cy.value),
		};
		handleOpenAreaClick(coordinates);
	};

	const elements = tools.map((tool) => {
		return tool.Element(items);
	});

	const points = tools.map((tool) => {
		return tool.PointElement(items, handlePointClick);
	});
	console.log("🚀 ~ file: Canvas.jsx:116 ~ points ~ points:", points)

	const tempElements = useMemo(() => {
		return activeTool?.TempStateElement(items, mousePosition);
	}, [mousePosition]);
	return (
		<div className="canvas-wrapper">
			<svg
				ref={svgRef}
				width="100%"
				height="100%"
				xmlns="http://www.w3.org/2000/svg"
				onClick={handleCanvasClick}
			>
				<SVGGridBackground />
				{elements.map((element) => {
					return element;
				})}
				{tempElements?.map((element) => {
					return element;
				})}
				{points.map((element) => {
                    // console.log("🚀 ~ file: Canvas.jsx:139 ~ {points.map ~ element:", element)
                    // // element.onClick = handlePointClick;
                    // element.props = {
                    //     ...element.props,
                    //     onClick: handlePointClick,
                    // }
					return element;
				})}
			</svg>
		</div>
	);
};

export default Canvas;
