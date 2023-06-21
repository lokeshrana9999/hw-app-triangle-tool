export function getAngleBetweenLines(
	line1,
	line2,
	refrencePointIndex1,
	refrencePointIndex2
) {
	//line1 = [{x:number, y:number}, {x:number, y:number}]
	//line2 = [{x:number, y:number}, {x:number, y:number}]
	//refrencePointIndex1 = 0 or 1
	//refrencePointIndex2 = 0 or 1
	if (refrencePointIndex1 === 0) {
		line1 = [line1[0], line1[1]];
	} else {
		line1 = [line1[1], line1[0]];
	}
	if (refrencePointIndex2 === 0) {
		line2 = [line2[0], line2[1]];
	} else {
		line2 = [line2[1], line2[0]];
	}
	let angle1 = Math.atan2(line1[0].y - line1[1].y, line1[0].x - line1[1].x);
	let angle2 = Math.atan2(line2[0].y - line2[1].y, line2[0].x - line2[1].x);
	return getAbsoluteDifferenceBetweenAngles(angle1, angle2);
}

export function getPointOnLine(line, refrencePointIndex, distance) {
	//line = [{x:number, y:number}, {x:number, y:number}]
	//refrencePoint = {x:number, y:number}
	//distance = number
	//Given point should be between either points of the line
	if (line.length != 2) {
		console.log("ERROR: line.length != 2");
		return;
	}
	const refrencePoint = line[refrencePointIndex];
	let point = { x: 0, y: 0 };
	console.log(
		"🚀 ~ file: misc.js:20 ~ getPointOnLine ~ refrencePoint:",
		refrencePoint,
		line,
		refrencePointIndex,
		distance
	);
	let lineLength = Math.sqrt(
		Math.pow(line[0].x - line[1].x, 2) + Math.pow(line[0].y - line[1].y, 2)
	);
	const distanceRatio = distance / lineLength;
	if (refrencePointIndex === 0) {
		point.x = line[0].x + distanceRatio * (line[1].x - line[0].x);
		point.y = line[0].y + distanceRatio * (line[1].y - line[0].y);
	} else {
		point.x = line[1].x + distanceRatio * (line[0].x - line[1].x);
		point.y = line[1].y + distanceRatio * (line[0].y - line[1].y);
	}
	return point;
}

export function convertToSmallerPositiveAngle(angle) {
	while (angle < 0) {
		angle += 2 * Math.PI;
	}

	if (angle > Math.PI) {
		angle = 2 * Math.PI - angle;
	}
	return angle;
}

export function getAbsoluteDifferenceBetweenAngles(angle1, angle2) {
	let diff = Math.abs(
		((Math.abs(angle1 - angle2) + Math.PI) % (2 * Math.PI)) - Math.PI
	);
	return diff;
}

export function compareLines(line1, line2) {
	//line1 = [{x:number, y:number}, {x:number, y:number}]
	//line2 = [{x:number, y:number}, {x:number, y:number}]
	let sameLines = true;
	for (let i = 0; i < 2; i++) {
		if (!(line1[0].x == line2[i].x && line1[0].y == line2[i].y)) {
			sameLines = false;
		}
	}
	return sameLines;
}
