const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

// Marc's magic ^o^
let scene = new Scene();

let cam = new Camera(new CamSettings(2, 1, 600, 300));
let triangle1 = new Triangle([
  new Vector([2, 0, 0]),
  new Vector([0, 2, 0]),
  new Vector([0, 0, 2])
]);
let triangle2 = triangle1.clone();
triangle2.tr.translate(new Vector([0, 5, 0]));
let nul = new Null();
nul.tr.translate(new Vector([1, 0, 0.5]));
nul.add([triangle2]);

triangle1.tr.translate(new Vector([6, -0.5, 1]));
triangle1.tr.rotateZ(Math.PI / 2);

let mesh = new Mesh();
mesh.add([triangle1]);
mesh.tr.translate(new Vector([-2, 3, 0]));
mesh.tr.rotateZ(Math.PI / 2);

scene.add([cam, mesh, nul]);

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
  canvasElement.width = 600;
  canvasElement.height = 300;

  // Render on canvas
  let canvasDrawT1 = performance.now();
  for (let j = 0; j < frame.length; j++) {
    // If all the same, draw single line
    if (frame[j].every(pixel => pixel.me === frame[j][0].me)) {
      drawPixel(canvas, frame[j][0].me, 0, j, frame[j].length, 1);
      continue;
    }
    // If not all the same, draw in batch
    let prevPixelPos = 0;
    let prevPixel = frame[j][0].me;

    for (let i = 0; i < frame[0].length; i++) {
      const pixel = frame[j][i].me;

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

  console.log(
    "Draw on canvas took " + (canvasDrawT2 - canvasDrawT1) + " milliseconds."
  );

  console.log(cam);

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

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("render-start")
    .addEventListener("click", renderFrame);
  document
    .getElementById("obj-import-file")
    .addEventListener("change", loadObjFile);
});
