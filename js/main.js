const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

// Marc's magic ^o^
let scene = new Scene();

let cam = new Camera(new CamSettings(2, 1, 600, 300));

scene.add([cam]);

let rendering = false;
const renderFrame = () => {
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

  // Allow new renders
  rendering = false;
};

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

		if(type === 'v') {
			vectors.push(new Vector(values))
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

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("render-start")
    .addEventListener("click", renderFrame);
  document
    .getElementById("obj-import-file")
    .addEventListener("change", loadObjFile);
});
