const pad = (n, width, z) => {
	z = z || "0";
	n = n + "";
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};


/*====================================================
 * Marc's magic ^o^
 *====================================================*/
const cam = new Camera(new CamSettings(2, 1, 600/6, 300/6));

const tri0 = new Triangle([ new Vector([0,0,2]), new Vector([0,0,0]), new Vector([2,0,0]) ]);
const tri1 = new Triangle([ new Vector([0,0,2]), new Vector([2,0,2]), new Vector([2,0,0]) ]);

const mesh = new Mesh();
mesh.add([tri0,tri1]);
mesh.tr.translate(new Vector([-1,3,-1]));

const scene = new Scene();
scene.add([cam, mesh]);


/*====================================================
 * RENDER FUNCTION
 *====================================================*/
let rendering = false;
const renderFrame = () => {
	const drawPixel = (canvas, pixel, x, y, w, h) => {
		canvas.fillStyle = `#${pad(new Number(pixel).toString(16), 6)}`;
		canvas.fillRect(x, y, w, h);
	};

	// Prevent new renders if already rendering
	if (rendering) throw new Error("Already rendering");
	rendering = true;

	// Get frame
	let getFrameT1 = performance.now();
	let frame = cam.getFrame();
	let getFrameT2 = performance.now();
	console.log("Render took " + (getFrameT2 - getFrameT1) + " milliseconds.");

	// Get canvas
	const canvasElement = document.getElementById("canvas");
	const canvas = canvasElement.getContext("2d");
	// canvasElement.width = cam.settings.rasterWidth;
	// canvasElement.height = cam.settings.rasterHeight;

	// Render on canvas
	let canvasDrawT1 = performance.now();
	for (let j = 0; j < frame.length; j++) {
		// If all the same, draw single line
		if (frame[j].every(pixel => pixel === frame[j][0])) {
			drawPixel(canvas, frame[j][0], 0, j, frame[j].length, 1);
			continue;
		}
		// If not all the same, draw in batch
		let prevPixelPos = 0;
		let prevPixel = frame[j][0];

		for (let i = 0; i < frame[0].length; i++) {
			const pixel = frame[j][i];

			// If pixel changed mid way throught render
			if (pixel != prevPixel) {
				drawPixel(canvas, prevPixel, prevPixelPos, j, i, 1);
				prevPixel = pixel;
				prevPixelPos = i;
			}
			// If reached the end
			else if (i === frame[0].length - 1)
				drawPixel(canvas, prevPixel, prevPixelPos, j, i, 1);
		}
	}

	let canvasDrawT2 = performance.now();

	console.log("Draw on canvas took " + (canvasDrawT2 - canvasDrawT1) + " milliseconds.");

	// Allow new renders
	rendering = false;
};


/*====================================================
 * UPLOAD FILE FUNCTION
 *====================================================*/
const readUploadedFileAsText = inputFile => {
	const temporaryFileReader = new FileReader();

	return new Promise((resolve, reject) => {
		temporaryFileReader.onerror = () => {
			temporaryFileReader.abort();
			reject(new DOMException("Problem parsing input file."));
		};

		temporaryFileReader.onload = () => {
			resolve(temporaryFileReader.result);
		};
		temporaryFileReader.readAsText(inputFile);
	});
};


/*====================================================
 * LOAD OBJ FUNCTION
 *====================================================*/
const loadObjFile = async event => {
	// Get input file
	const input = event.target;
	const [file] = input.files;
	if (!file.name.endsWith(".obj")) return alert("Invalid file extension");

	// Read file contents
	const text = await readUploadedFileAsText(file);
	const lines = text.split(/[\r\n]+/g);

	// Create mesh
	let mesh = new Mesh();

	// Create data storage
	const vectors = [];
	const triangles = [];

	// Process file
	lines.forEach(line => {
		if (line === "") return;

		// Process each line
		const data = line.split(" ");
		const type = data[0];
		const values = data.slice(1).map(i => parseFloat(i));

		if (type === "v") {
			vectors.push(new Vector(values));
			return;
		}

		if (type === "f") {
			triangles.push(
				new Triangle([
					vectors[values[0] - 1].clone(),
					vectors[values[1] - 1].clone(),
					vectors[values[2] - 1].clone()
				])
			);
			return;
		}
	});

	mesh.add(triangles);

	// Add mest to scene and render
	scene.add([mesh]);
	renderFrame();
};


/*====================================================
 * CONTROLS FUNCTION
 *====================================================*/
const controls = event => {
	const key = event.key.toLowerCase();

	if (key == 'w')
		cam.tr.translate(new Vector([0,0.1,0]));
	else if (key == 's')
		cam.tr.translate(new Vector([0,-0.1,0]));
	else if (key == 'd')
		cam.tr.translate(new Vector([0.1,0,0]));
	else if (key == 'a')
		cam.tr.translate(new Vector([-0.1,0,0]));
	else if (key == 'shift')
		cam.tr.translate(new Vector([0,0,0.1]));
	else if (key == 'alt')
		cam.tr.translate(new Vector([0,0,-0.1]));

	else if (key == 'arrowup')
		cam.tr.rotateX(Math.PI/32);
	else if (key == 'arrowdown')
		cam.tr.rotateX(-Math.PI/32);
	else if (key == 'arrowright')
		cam.tr.rotateZ(Math.PI/32);
	else if (key == 'arrowleft')
		cam.tr.rotateZ(-Math.PI/32);
	else if (key == '1' || key == 'end')
		cam.tr.rotateY(Math.PI/32);
	else if (key == '3' || key == 'pagedown')
		cam.tr.rotateY(-Math.PI/32);
	
	else return;
		
	renderFrame();
};


/*====================================================
 * Listeners
 *====================================================*/
document.addEventListener("DOMContentLoaded", () => {
	document
		.getElementById("render-start")
		.addEventListener("click", renderFrame);
	document
		.getElementById("obj-import-file")
		.addEventListener("change", loadObjFile);
	document
		.addEventListener("keydown", controls);
});
