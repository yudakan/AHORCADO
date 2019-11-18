const pad = (n, width, z) => {
	z = z || "0";
	n = n + "";
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

let rendering = false;
const renderFrame = () => {
	// Prevent new renders if already rendering
	if (rendering) throw new Error("Already rendering");
	rendering = true;

	// Marc's magic ^o^
	let scene = new Scene();

	let cam = new Camera(new CamSettings(2, 1, 600, 300));
	let triangle1 = new Triangle([
		new Vector([2, 5, 0]),
		new Vector([0, 5, 0]),
		new Vector([0, 5, 2])
	]);
	// triangle1.tr.translate(new Vector([0, 5, 0]));

	// let triangle2 = triangle1.clone();
	// triangle2.tr.translate(new Vector([0, 5, 0]));
	// let nul = new Null();
	// nul.tr.translate(new Vector([1, 0, 0.5]));
	// nul.add([triangle2]);

	// triangle1.tr.translate(new Vector([6, -0.5, 1]));
	// triangle1.tr.rotateZ(Math.PI / 2);

	// let mesh = new Mesh();
	// mesh.add([triangle1]);
	// mesh.tr.translate(new Vector([-2, 3, 0]));
	// mesh.tr.rotateZ(Math.PI / 2);

	scene.add([cam, triangle1]);

	// Get frame
	let getFrameT1 = performance.now();
	let frame = cam.getFrame();
	let getFrameT2 = performance.now();
	console.log("Render took " + (getFrameT2 - getFrameT1) + " milliseconds.");

	// Get canvas
	const canvasElement = document.getElementById("canvas");
	const canvas = canvasElement.getContext("2d");
	canvasElement.width = 600;
	canvasElement.height = 300;

	// Render on canvas
	let canvasDrawT1 = performance.now();
	for (let j = 0; j < frame.length; j++)
		for (let i = 0; i < frame[0].length; i++) {
			const pixel = frame[j][i].me;
			canvas.fillStyle = `#${pad(new Number(pixel).toString(16), 6)}`;
			canvas.fillRect(i, j, 1, 1);
		}
	let canvasDrawT2 = performance.now();

	console.log(
		"Draw on canvas took " + (canvasDrawT2 - canvasDrawT1) + " milliseconds."
	);

	console.log(cam);

	// Allow new renders
	rendering = false;
};

document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("render-start")
		.addEventListener("click", renderFrame);
});
